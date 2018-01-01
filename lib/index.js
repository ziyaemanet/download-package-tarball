const {join:joinPath} = require('path')

const downloadTarball = require('download-tarball')
const mkdirp = require('mkdirp-then')
const {readdir, move} = require('fs-extra')
const tmp = require('then-tmp')
const npa = require('npm-package-arg')
const readJSON = require('then-read-json')
const uuid = require('uuid')


const makeParentDir = (dir, scope) => {
  return scope ? mkdirp(joinPath(dir, scope)) : mkdirp(dir);
};

module.exports = async ({url, gotOpts, dir}) => {
  const {path: tmpPath, cleanupCallback} = await tmp.dir();
  await downloadTarball({url, gotOpts, dir: tmpPath});
  const [fromDirname] = await readdir(tmpPath);
  const src = joinPath(tmpPath, fromDirname);
  const {name} = await readJSON(joinPath(src, 'package.json'));
  const {scope} = npa(name);
  const dest = joinPath(dir, name);
  await makeParentDir(dir, scope);

  try {
    await move(src, dest, { overwrite: false });
  } catch (e) {
    const newDest = `${dest}-${uuid()}`
    await move(src, newDest, { overwrite: false })
  }

  cleanupCallback();
};
