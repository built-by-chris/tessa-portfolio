import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import test from 'node:test';

const output = resolve('dist');
const origin = 'https://tessarouse.me';

function collectHtml(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectHtml(path);
    return entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
  });
}

function attribute(element, name) {
  const match = element.match(new RegExp('\\b' + name + '\\s*=\\s*(["\x27])(.*?)\\1', 'i'));
  return match?.[2];
}

function outputFile(pathname) {
  let path;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (!path.startsWith('/') || path.includes('\\') || path.includes('\0')) return null;
  const relativePath = path.replace(/^\/+/, '');
  const candidates = [
    join(output, relativePath),
    join(output, relativePath, 'index.html'),
    join(output, relativePath + '.html'),
  ];
  return candidates.find((candidate) => candidate.startsWith(output + sep) && existsSync(candidate) && statSync(candidate).isFile()) ?? null;
}

test('built pages have working internal links and basic accessible HTML', () => {
  const pages = collectHtml(output);
  assert.ok(pages.length >= 6, 'Expected an Astro build containing the main site pages');
  const problems = [];
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const label = relative(output, file);
    if (!/<html\b[^>]*\blang=["']en["']/i.test(html)) problems.push(label + ': missing lang=en');
    if (!/<main\b[^>]*\bid=["']main-content["']/i.test(html)) problems.push(label + ': missing main landmark');
    if (!/<a\b[^>]*href=["']#main-content["']/i.test(html)) problems.push(label + ': missing skip link');
    if (!/<title>[^<]+<\/title>/i.test(html)) problems.push(label + ': missing document title');
    if ((html.match(/<h1\b/gi) ?? []).length !== 1) problems.push(label + ': expected exactly one h1');

    for (const img of html.match(/<img\b[^>]*>/gi) ?? []) {
      if (attribute(img, 'alt') === undefined) problems.push(label + ': image missing alt attribute');
    }

    const ownPath = '/' + relative(output, file).split(sep).join('/').replace(/(?:index)?\.html$/, '');
    for (const anchor of html.match(/<a\b[^>]*>/gi) ?? []) {
      const href = attribute(anchor, 'href');
      if (href === undefined || !href.trim() || /^(?:mailto:|tel:|javascript:)/i.test(href)) continue;
      let url;
      try {
        url = new URL(href.replaceAll('&amp;', '&'), origin + ownPath);
      } catch {
        problems.push(label + ': invalid link ' + href);
        continue;
      }
      if (url.origin !== origin) continue;
      const target = outputFile(url.pathname);
      if (!target) {
        problems.push(label + ': unresolved internal link ' + href);
        continue;
      }
      if (url.hash && url.hash !== '#') {
        let id;
        try { id = decodeURIComponent(url.hash.slice(1)); } catch { id = ''; }
        const targetHtml = readFileSync(target, 'utf8');
        const ids = [...targetHtml.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
        if (!ids.includes(id)) problems.push(label + ': missing fragment target ' + href);
      }
    }
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});
