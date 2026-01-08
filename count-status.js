const fs = require('fs');
const features = JSON.parse(fs.readFileSync('feature_list.json'));
const total = features.length;
const passing = features.filter(f => f.passes).length;
console.log('Total:', total);
console.log('Passing:', passing);
console.log('Failing:', total - passing);
