const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./feature_list.json', 'utf8'));
const total = data.length;
const passing = data.filter(t => t.passes).length;
console.log(`Tests: ${passing}/${total} passing (${(passing/total*100).toFixed(1)}%)`);
