const fs = require('fs');
const path = require('path');

/** Escape a string so it can be used inside a RegExp. */
function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** RegExp that matches the given text exactly (ignoring surrounding whitespace). */
function exactText(text) {
  return new RegExp(`^\\s*${escapeRegExp(text)}\\s*$`);
}

/** Read a JSON file relative to the project root. */
function readJson(relativePath) {
  const fullPath = path.resolve(__dirname, '..', relativePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

/** Random lower-case letters, e.g. "kqzmxa". */
function randomString(length = 6) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let out = '';
  for (let i = 0; i < length; i += 1) out += letters[Math.floor(Math.random() * letters.length)];
  return out;
}

/** Random numeric string that never starts with 0, e.g. "4829105". */
function randomNumber(length = 6) {
  let out = String(Math.floor(Math.random() * 9) + 1);
  for (let i = 1; i < length; i += 1) out += Math.floor(Math.random() * 10);
  return out;
}

/** Capitalise the first letter of a string. */
function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/** Format a Date as yyyy-mm-dd. */
function formatDate(date = new Date()) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
}

/** Date n days from today. */
function addDays(days, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

/** Retry an async function a few times before giving up. */
async function retry(fn, { retries = 3, delayMs = 500 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

module.exports = {
  escapeRegExp,
  exactText,
  readJson,
  randomString,
  randomNumber,
  capitalize,
  formatDate,
  addDays,
  retry,
};
