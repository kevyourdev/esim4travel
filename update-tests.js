const fs = require('fs');

const featureListPath = './feature_list.json';
const features = JSON.parse(fs.readFileSync(featureListPath, 'utf8'));

// Tests verified in this session
const testsToMark = [
  "Direct URL navigation works for all pages",
  "Quantity cannot be decreased below 1",
  "Checkout cannot proceed with empty cart",
  "Privacy policy link is accessible from checkout",
  "Terms and conditions link is accessible from checkout",
  "About page or company info is accessible",
  "Help Center or Support page is accessible from footer",
  "Refund Policy page is accessible and displays content",
  "Social media icons link to appropriate pages",
  "Trust badges and security indicators are visible",
  "Homepage hero has animated or visually interesting background"
];

let updateCount = 0;

features.forEach(feature => {
  if (testsToMark.includes(feature.description) && feature.passes === false) {
    feature.passes = true;
    updateCount++;
    console.log(`✓ Marked as passing: ${feature.description}`);
  }
});

fs.writeFileSync(featureListPath, JSON.stringify(features, null, 2));
console.log(`\n${updateCount} tests updated to passing status`);
