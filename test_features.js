const fs = require('fs');

const featureList = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'));

const total = featureList.length;
const passing = featureList.filter(f => f.passes).length;
const failing = total - passing;
const percentage = ((passing / total) * 100).toFixed(1);

console.log(`Features: ${passing}/${total} passing (${percentage}%)`);
console.log(`Remaining: ${failing} features to implement`);
