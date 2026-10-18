import { createClient } from '@supabase/supabase-js';
import { configuration } from './configuration.js';

// Keep login tokens off this shared website origin's persistent storage. Only
// the PKCE verifier survives the sign-in redirect, in this tab's sessionStorage.
const memory = new Map();
const codeVerifierKey = 'northstar-consent-session-code-verifier';
const storage = {
  getItem: (key) => key === codeVerifierKey ? sessionStorage.getItem(key) : memory.get(key) ?? null,
  setItem: (key, value) => { if (key === codeVerifierKey) sessionStorage.setItem(key, value); else memory.set(key, value); },
  removeItem: (key) => { if (key === codeVerifierKey) sessionStorage.removeItem(key); else memory.delete(key); },
};
const client = createClient(configuration.supabaseUrl, configuration.publishableKey, {
  auth: { storage, storageKey: 'northstar-consent-session', flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
const element = (id) => document.getElementById(id);
const pendingKey = 'northstar-consent-authorization';
const queryId = new URL(location.href).searchParams.get('authorization_id');
if (queryId && /^[A-Za-z0-9_-]{16,256}$/.test(queryId)) sessionStorage.setItem(pendingKey, queryId);
let authorizationId = sessionStorage.getItem(pendingKey);
let oauthClientId;
let busy = false;
function status(message, error = false) { element('status').textContent = message; element('status').classList.toggle('error', error); }
function setBusy(value) {
  busy = value;
  document.querySelectorAll('button').forEach((button) => { button.disabled = value; });
  if (!value) element('approve').disabled = !document.querySelector('#accounts input:checked');
}
async function rpc(name, parameters = {}) {
  const { data, error } = await client.rpc(name, parameters);
  if (error) throw new Error('The connection is unavailable for this account or its settings. Try signing in again.');
  return data;
}
async function authorizationRequest(id, action) {
  const { data: { session } } = await client.auth.getSession();
  if (!session) throw new Error('Sign in again to approve this connection.');
  const response = await fetch(`${configuration.mcpUrl}/authorizations/${encodeURIComponent(id)}${action ? '/consent' : ''}`, {
    method: action ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
    ...(action ? { body: JSON.stringify({ action }) } : {}),
  });
  if (!response.ok) throw new Error('This request expired or is unavailable. Start again from ChatGPT.');
  return response.json();
}
function redirectFromAuth(data) {
  const target = new URL(data.redirect_url);
  if (target.protocol !== 'https:' || target.hostname !== 'chatgpt.com') throw new Error('The approved OAuth return address is unavailable. Return to ChatGPT and reconnect.');
  sessionStorage.removeItem(pendingKey);
  location.assign(target.href);
}
function showConnections(connections) {
  const list = element('connection-list');
  list.replaceChildren();
  if (!connections.length) { const empty = document.createElement('p'); empty.textContent = 'No active reviews.'; list.append(empty); }
  for (const connection of connections) {
    const row = document.createElement('div'); row.className = 'connection';
    const text = document.createElement('p');
    text.textContent = `Northstar review · ${connection.account_ids.length} account(s) · ${connection.history_days} days of history · expires ${new Date(connection.expires_at).toLocaleDateString()}`;
    const revoke = document.createElement('button'); revoke.textContent = 'Revoke access'; revoke.className = 'secondary-button';
    revoke.addEventListener('click', async () => {
      setBusy(true);
      try {
        await rpc('mcp_revoke_grant', { p_client_id: connection.client_id });
        status('Access revoked. Future Northstar requests are blocked.');
        await loadAccount();
      } catch (error) { status(error.message, true); }
      finally { setBusy(false); }
    });
    row.append(text, revoke); list.append(row);
  }
}
async function loadAccount() {
  const { data: { session } } = await client.auth.getSession();
  for (const id of ['login', 'consent', 'connections', 'sign-out']) element(id).hidden = true;
  if (!session) { element('login').hidden = false; status('Sign in with your existing Northstar account.'); return; }
  element('sign-out').hidden = false;
  let details;
  if (authorizationId) {
    details = await authorizationRequest(authorizationId);
    if (details.redirect_url) { redirectFromAuth(details); return; }
    oauthClientId = details.client.id;
  }
  const context = await rpc('mcp_consent_context', { p_client_id: oauthClientId ?? null });
  if (!authorizationId) {
    showConnections(context.connections); element('connections').hidden = false;
    status('Manage your Northstar connections.'); return;
  }
  element('client-description').textContent = `${details.client.name || 'ChatGPT'} requests read-only Northstar summaries.`;
  const accounts = element('accounts'); accounts.replaceChildren();
  for (const account of context.accounts) {
    const label = document.createElement('label'); label.className = 'account';
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.value = account.id;
    checkbox.addEventListener('change', () => { if (!busy) element('approve').disabled = !accounts.querySelector('input:checked'); });
    const text = document.createElement('span'); text.textContent = `${account.name} · ${account.currency}`;
    label.append(checkbox, text); accounts.append(label);
  }
  element('time-zone').value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  element('consent').hidden = false;
  status(context.accounts.length ? 'Choose the accounts to include.' : 'No eligible accounts. Add an account in Northstar first.');
}
async function run(operation) {
  if (busy) return;
  setBusy(true);
  try { await operation(); }
  catch (error) { status(error.message || 'Unable to connect. Please try again.', true); }
  finally { setBusy(false); }
}
element('login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  run(async () => {
    if (!element('password').value) throw new Error('Enter your password or request a sign-in link.');
    const { error } = await client.auth.signInWithPassword({ email: element('email').value.trim(), password: element('password').value });
    element('password').value = '';
    if (error) throw new Error('Unable to sign in. Check your details or request a sign-in link.');
    await loadAccount();
  });
});
element('magic-link').addEventListener('click', () => run(async () => {
  if (!element('email').reportValidity()) return;
  const { error } = await client.auth.signInWithOtp({ email: element('email').value.trim(), options: { shouldCreateUser: false, emailRedirectTo: `${location.origin}/northstar-connect/` } });
  if (error) throw new Error('Unable to send a sign-in link. Try again later.');
  status('If this email belongs to a Northstar account, a sign-in link has been sent. Open it in this same browser tab.');
}));
element('apple').addEventListener('click', () => run(async () => {
  const { error } = await client.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: `${location.origin}/northstar-connect/` } });
  if (error) throw new Error('Apple sign-in is unavailable here. Use your Northstar email sign-in method.');
}));
element('consent-form').addEventListener('submit', (event) => {
  event.preventDefault();
  run(async () => {
    const accounts = [...document.querySelectorAll('#accounts input:checked')].map((input) => input.value);
    if (!oauthClientId || !accounts.length) throw new Error('Choose at least one account.');
    await rpc('mcp_save_grant', { p_client_id: oauthClientId, p_account_ids: accounts, p_history_days: Number(element('history').value), p_time_zone: element('time-zone').value.trim() });
    redirectFromAuth(await authorizationRequest(authorizationId, 'approve'));
  });
});
element('deny').addEventListener('click', () => run(async () => {
  redirectFromAuth(await authorizationRequest(authorizationId, 'deny'));
}));
element('sign-out').addEventListener('click', () => run(async () => {
  await client.auth.signOut({ scope: 'local' });
  sessionStorage.removeItem(pendingKey); authorizationId = null; oauthClientId = undefined;
  await loadAccount();
}));
run(loadAccount);
