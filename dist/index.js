'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('path');

const joinPath = _require.join;


const downloadTarball = require('download-tarball');
const mkdirp = require('mkdirp-then');

var _require2 = require('fs-extra');

const readdir = _require2.readdir,
      move = _require2.move;

const tmp = require('then-tmp');
const npa = require('npm-package-arg');
const readJSON = require('then-read-json');
const uuid = require('uuid');

const makeParentDir = (dir, scope) => {
  return scope ? mkdirp(joinPath(dir, scope)) : mkdirp(dir);
};

module.exports = (() => {
  var _ref = _asyncToGenerator(function* (_ref2) {
    let url = _ref2.url,
        gotOpts = _ref2.gotOpts,
        dir = _ref2.dir;

    var _ref3 = yield tmp.dir();

    const tmpPath = _ref3.path,
          cleanupCallback = _ref3.cleanupCallback;

    yield downloadTarball({ url: url, gotOpts: gotOpts, dir: tmpPath });

    var _ref4 = yield readdir(tmpPath),
        _ref5 = _slicedToArray(_ref4, 1);

    const fromDirname = _ref5[0];

    const src = joinPath(tmpPath, fromDirname);

    var _ref6 = yield readJSON(joinPath(src, 'package.json'));

    const name = _ref6.name;

    var _npa = npa(name);

    const scope = _npa.scope;

    const dest = joinPath(dir, name);
    yield makeParentDir(dir, scope);

    try {
      yield move(src, dest, { overwrite: false });
    } catch (e) {
      const newDest = `${dest}-${uuid()}`;
      yield move(src, newDest, { overwrite: false });
    }

    cleanupCallback();
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();