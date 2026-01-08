const fs = require('fs');
const path = require('path');

const featureListPath = path.join(__dirname, 'feature_list.json');
const features = JSON.parse(fs.readFileSync(featureListPath, 'utf8'));

// Features to mark as passing (by description)
const passingDescriptions = [
  "Header navigation displays all menu items",
  "Header Destinations dropdown shows region options",
  "Header cart icon click opens cart drawer",
  "Header becomes sticky on scroll",
  "Header has proper styling with teal color scheme",
  "Mobile header shows hamburger menu",
  "Footer displays all four columns",
  "Footer bottom bar displays correctly"
];

let updatedCount = 0;
features.forEach((feature, index) => {
  if (passingDescriptions.includes(feature.description) && !feature.passes) {
    feature.passes = true;
    updatedCount++;
    console.log(`✅ Feature #${index + 1}: ${feature.description}`);
  }
});

fs.writeFileSync(featureListPath, JSON.stringify(features, null, 2));
console.log(`\n✅ Updated ${updatedCount} features to passing status`);
console.log(`📊 Total passing: ${features.filter(f => f.passes).length}/${features.length}`);
