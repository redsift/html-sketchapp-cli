const { promisify } = require('es6-promisify');
const rimrafAsync = promisify(require('rimraf'));
const path = require('path');
const { exec } = require('child-process-promise');
const dirContentsToObject = require('../_utils/dirContentsToObject');

const distPath = path.join(__dirname, 'dist');

beforeEach(() => rimrafAsync(distPath));

test('fails when referencing unknown Symbol', (done) => {
  exec(
    [
      'node ../../bin/cli',
      '--puppeteer-args="--no-sandbox --disable-setuid-sandbox"',
      '--out-dir dist',
      '--file unknown-symbol.html'
    ].join(' '),
    { cwd: __dirname }
  ).catch(err => {
    expect(err.stderr).toMatch('Unknown symbol master: Some Symbol');
    done();
  });
});

test('generates symbolInstance nodes', async () => {
  await exec(
    [
      'node ../../bin/cli',
      '--puppeteer-args="--no-sandbox --disable-setuid-sandbox"',
      '--out-dir dist',
      '--file index.html',
      '--viewports.Desktop 1024x768',
      '--viewports.Mobile 320x568'
    ].join(' '),
    { cwd: __dirname }
  );

  const output = await dirContentsToObject(distPath);
  expect(output).toMatchSnapshot();
});
