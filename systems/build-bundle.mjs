import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const files = [
  'state.js',
  'buildings.js',
  'population.js',
  'military.js',
  'trade.js',
  'religion.js',
  'ui.js',
  'simulation.js',
  'registry.js',
  'villageTheme.js',
  'game.js',
];

let output = `// Generated compatibility bundle from systems/*.js.\n// Source modules remain authoritative; regenerate after module edits.\n\n`;

for (const file of files) {
  let text = await readFile(join('systems', file), 'utf8');
  text = text.replace(/^\uFEFF/, '');
  text = text.replace(/^import\s+[^;]+;\s*$/gm, '');
  text = text.replace(/^export\s+/gm, '');
  output += `\n// ---- ${file} ----\n${text}\n`;
}

await writeFile(join('systems', 'game.bundle.js'), output, 'utf8');
console.log(`Generated systems/game.bundle.js (${output.length} bytes)`);
