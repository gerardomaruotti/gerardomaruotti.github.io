import assert from 'node:assert/strict';
import test from 'node:test';
import { oauthReturnURL } from '../src/oauth-return.js';

test('approved assistant callbacks preserve the authorization response', async (t) => {
  for (const callback of [
    'https://chatgpt.com/connector_platform_oauth_redirect',
    'https://www.cursor.com/agents/mcp/oauth/callback',
    'https://www.cursor.com/bot/mcp/oauth/callback',
  ]) {
    await t.test(callback, () => {
      const target = oauthReturnURL(`${callback}?code=synthetic-code&state=synthetic-state&iss=https%3A%2F%2Fnorthstar.example%2Foauth.json`);
      assert.equal(target.searchParams.get('code'), 'synthetic-code');
      assert.equal(target.searchParams.get('state'), 'synthetic-state');
      assert.equal(target.searchParams.get('iss'), 'https://northstar.example/oauth.json');
    });
  }
});

test('authorization responses never navigate to an unapproved destination', async (t) => {
  for (const target of [
    'https://example.invalid/agents/mcp/oauth/callback',
    'https://www.cursor.com.example.invalid/agents/mcp/oauth/callback',
    'https://chatgpt.com.example.invalid/connector_platform_oauth_redirect',
    'http://www.cursor.com/agents/mcp/oauth/callback',
    'https://www.cursor.com/other-path',
    'https://chatgpt.com/other-path',
    'https://www.cursor.com:8443/agents/mcp/oauth/callback',
    'https://user:password@chatgpt.com/connector_platform_oauth_redirect',
    'https://www.cursor.com/agents/mcp/oauth/callback#fragment',
    'javascript:alert(1)',
    '//www.cursor.com/agents/mcp/oauth/callback',
  ]) {
    await t.test(target, () => {
      assert.throws(() => oauthReturnURL(target));
    });
  }
});
