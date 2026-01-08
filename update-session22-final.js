const fs = require('fs');

const features = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'));

const testsToPass = [
  'Language selector displays in footer (mock)',
  'Password fields mask input characters'
];

let updatedCount = 0;
features.forEach(feature => {
  if (testsToPass.includes(feature.description) && !feature.passes) {
    feature.passes = true;
    updatedCount++;
    console.log(`✅ Marked as passing: ${feature.description}`);
  }
});

fs.writeFileSync('feature_list.json', JSON.stringify(features, null, 2));
console.log(`\n✅ Updated ${updatedCount} tests to passing`);

const passingCount = features.filter(f => f.passes).length;
const totalCount = features.length;
console.log(`\n📊 Progress: ${passingCount}/${totalCount} tests passing (${((passingCount/totalCount)*100).toFixed(1)}%)`);
