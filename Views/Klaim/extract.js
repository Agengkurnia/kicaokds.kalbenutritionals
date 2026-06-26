const fs = require('fs');
const html = fs.readFileSync('Index.html', 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/g);
const mainScript = match[match.length - 1].replace(/<\/?script>/g, '');
fs.writeFileSync('test_script.js', mainScript);
