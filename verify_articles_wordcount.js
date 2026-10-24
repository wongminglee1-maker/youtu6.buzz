const fs = require('fs');

function countChineseChars(file) {
  const content = fs.readFileSync(file, 'utf8');
  // Extract article body
  const match = content.match(/<article class="article-body">([\s\S]*?)<\/article>/i);
  if (!match) {
    console.log(`[ERROR] No <article class="article-body"> found in ${file}`);
    return 0;
  }
  const body = match[1];
  // Remove scripts, styles, html tags
  const cleanText = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, '');
  
  // Count chinese characters (\u4e00-\u9fa5)
  const cnMatches = cleanText.match(/[\u4e00-\u9fa5]/g) || [];
  return cnMatches.length;
}

const files = fs.readdirSync('articles').filter(f => f.endsWith('.html'));
for (const f of files) {
  const cnt = countChineseChars(`articles/${f}`);
  console.log(`${f.padEnd(40)}: ${cnt} Chinese chars (Target: 1500 - 2000)`);
}
