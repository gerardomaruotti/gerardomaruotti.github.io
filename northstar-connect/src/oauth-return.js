const approvedCallbacks = new Set([
  'https://chatgpt.com/connector_platform_oauth_redirect',
  'https://www.cursor.com/agents/mcp/oauth/callback',
  'https://www.cursor.com/bot/mcp/oauth/callback',
]);

export function oauthReturnURL(value) {
  const target = new URL(value);
  if (target.username || target.password || target.hash || !approvedCallbacks.has(`${target.origin}${target.pathname}`)) {
    throw new Error('The approved OAuth return address is unavailable. Return to your assistant and reconnect.');
  }
  return target;
}
