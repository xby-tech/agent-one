const { execSync } = require('child_process');
const path = require('path');

process.chdir(path.join(__dirname));
const port = process.argv[2] || '3002';

try {
  execSync(`npx next dev --port ${port}`, {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true,
  });
} catch (e) {
  process.exit(1);
}
