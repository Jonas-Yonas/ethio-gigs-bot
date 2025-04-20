const rateLimitMap = new Map();
const RATE_LIMIT_INTERVAL_MS = 60 * 1000; // 1 minute per post

export function gigRateLimiter(ctx, next) {
  const userId = ctx.from.id;
  const now = Date.now();
  const lastTime = rateLimitMap.get(userId) || 0;

  if (now - lastTime < RATE_LIMIT_INTERVAL_MS) {
    const waitSeconds = Math.ceil(
      (RATE_LIMIT_INTERVAL_MS - (now - lastTime)) / 1000
    );
    return ctx.reply(
      `⏳ Please wait ${waitSeconds}s before posting another gig.`
    );
  }

  rateLimitMap.set(userId, now);
  return next();
}
