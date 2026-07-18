/**
 * Basic detection of bots from User-Agent string
 */
export function isBot(userAgent) {
  if (!userAgent) return false;
  
  const botPatterns = [
    /bot/i,
    /spider/i,
    /crawl/i,
    /slurp/i,
    /googlebot/i,
    /bingbot/i,
    /claudebot/i,
    /gptbot/i,
    /yandex/i,
    /duckduckbot/i,
    /baiduspider/i
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
}
