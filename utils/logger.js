'use strict';

/**
 * Minimal leveled logger.
 *
 * Level is controlled with the LOG_LEVEL env var
 * (error < warn < info < debug). Defaults to 'info'.
 * Never log sensitive data (API keys, tokens, user agents with PII).
 */

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const configured = String(process.env.LOG_LEVEL || 'info').toLowerCase();
const activeLevel = LEVELS[configured] !== undefined ? LEVELS[configured] : LEVELS.info;

function write(level, args) {
  if (LEVELS[level] > activeLevel) return;
  const line = [new Date().toISOString(), `[${level.toUpperCase()}]`, ...args];
  if (level === 'error') {
    console.error(...line);
  } else if (level === 'warn') {
    console.warn(...line);
  } else {
    console.log(...line);
  }
}

module.exports = {
  error: (...args) => write('error', args),
  warn: (...args) => write('warn', args),
  info: (...args) => write('info', args),
  debug: (...args) => write('debug', args)
};
