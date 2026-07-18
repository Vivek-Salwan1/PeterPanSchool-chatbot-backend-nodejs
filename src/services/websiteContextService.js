const { env } = require('../config/env');

let websiteCache = { fetchedAt: 0, pages: [] };
let refreshInFlight = null;

function stripHtml(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ').trim();
}

function getSameSiteLinks(html, pageUrl) {
  const baseUrl = new URL(env.schoolWebsiteUrl);
  const links = new Set();
  const hrefPattern = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefPattern.exec(html)) !== null) {
    try {
      const url = new URL(match[1], pageUrl);
      url.hash = '';
      if (url.origin === baseUrl.origin && !url.pathname.match(/\.(pdf|jpg|jpeg|png|gif|webp|svg|zip)$/i)) links.add(url.toString());
    } catch { /* Ignore malformed website links. */ }
  }
  return [...links];
}

async function fetchWebsitePage(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'PeterPanSchoolsChatbot/1.0', Accept: 'text/html' },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Website fetch failed for ${url}: ${response.status} ${response.statusText}`);
  const html = await response.text();
  return { url, text: stripHtml(html), links: getSameSiteLinks(html, url) };
}

async function loadWebsitePages() {
  const visited = new Set();
  const pending = [env.schoolWebsiteUrl];
  const pages = [];
  while (pending.length && pages.length < env.maxWebsitePages) {
    const url = pending.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    try {
      const page = await fetchWebsitePage(url);
      pages.push(page);
      for (const link of page.links) {
        if (!visited.has(link) && pending.length + pages.length < env.maxWebsitePages * 2) pending.push(link);
      }
    } catch (error) {
      console.error('[WEBSITE_FETCH_ERROR]', error.message);
    }
  }
  websiteCache = { fetchedAt: Date.now(), pages };
  console.log(`[WEBSITE_CACHE] Loaded ${pages.length} page(s) from ${env.schoolWebsiteUrl}`);
  return pages;
}

async function getWebsitePages() {
  if (websiteCache.pages.length && Date.now() - websiteCache.fetchedAt < env.websiteCacheTtlMs) return websiteCache.pages;
  if (!refreshInFlight) refreshInFlight = loadWebsitePages().finally(() => { refreshInFlight = null; });
  return refreshInFlight;
}

function getQuestionWords(message) {
  return message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((word) => word.length > 2);
}

async function getWebsiteContext(message) {
  const pages = await getWebsitePages();
  const words = getQuestionWords(message);
  const scoredPages = pages.map((page) => ({ ...page, score: words.reduce((score, word) => score + Number(page.text.toLowerCase().includes(word)), 0) }))
    .sort((first, second) => second.score - first.score);
  const selected = scoredPages.filter((page) => page.score > 0).slice(0, 4);
  return (selected.length ? selected : scoredPages.slice(0, 3)).map((page) => `Source: ${page.url}\nContent: ${page.text.slice(0, 1800)}`)
    .join('\n\n').slice(0, env.maxWebsiteContextChars);
}

module.exports = { getWebsiteContext };

