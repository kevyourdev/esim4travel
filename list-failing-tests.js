const fs = require('fs');

const data = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'));
const failing = data.filter(f => !f.passes);

console.log(`\n=== FAILING TESTS (${failing.length} remaining) ===\n`);

failing.forEach((f, i) => {
  console.log(`${i+1}. [${f.category}] ${f.description}`);
});

console.log(`\n=== PROGRESS: ${data.filter(f => f.passes).length}/${data.length} passing (${((data.filter(f => f.passes).length / data.length) * 100).toFixed(1)}%) ===\n`);
