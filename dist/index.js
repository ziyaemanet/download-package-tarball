'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _downloadTarball = require('download-tarball');

var _downloadTarball2 = _interopRequireDefault(_downloadTarball);

var _rimrafThen = require('rimraf-then');

var _rimrafThen2 = _interopRequireDefault(_rimrafThen);

var _mkdirpThen = require('mkdirp-then');

var _mkdirpThen2 = _interopRequireDefault(_mkdirpThen);

var _fsExtra = require('fs-extra');

var _thenTmp = require('then-tmp');

var _thenTmp2 = _interopRequireDefault(_thenTmp);

var _npmPackageArg = require('npm-package-arg');

var _npmPackageArg2 = _interopRequireDefault(_npmPackageArg);

var _thenReadJson = require('then-read-json');

var _thenReadJson2 = _interopRequireDefault(_thenReadJson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const makeParentDir = (dir, scope) => {
  return scope ? (0, _mkdirpThen2.default)((0, _path.join)(dir, scope)) : (0, _mkdirpThen2.default)(dir);
};

module.exports = (() => {
  var _ref = _asyncToGenerator(function* (_ref2) {
    let url = _ref2.url,
        gotOpts = _ref2.gotOpts,
        dir = _ref2.dir;

    var _ref3 = yield _thenTmp2.default.dir();

    const tmpPath = _ref3.path,
          cleanupCallback = _ref3.cleanupCallback;

    yield (0, _downloadTarball2.default)({ url: url, gotOpts: gotOpts, dir: tmpPath });

    var _ref4 = yield (0, _fsExtra.readdir)(tmpPath),
        _ref5 = _slicedToArray(_ref4, 1);

    const fromDirname = _ref5[0];

    const src = (0, _path.join)(tmpPath, fromDirname);

    var _ref6 = yield (0, _thenReadJson2.default)((0, _path.join)(src, 'package.json'));

    const name = _ref6.name;

    var _npa = (0, _npmPackageArg2.default)(name);

    const scope = _npa.scope;

    const dest = (0, _path.join)(dir, name);

    yield makeParentDir(dir, scope);

    try {
      yield (0, _fsExtra.move)(src, dest, { overwrite: false });
    } catch (e) {
      const packageDir = dest.split('/');
      const packageName = packageDir[packageDir.length - 1];
      const splitName = packageName.split('-');
      const version = parseInt(splitName[splitName.length - 1]);
      const newDest = `${dest}-${version ? version + 1 : 0}`;
      yield (0, _fsExtra.move)(src, newDest, { overwrite: false });
    }

    cleanupCallback();
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();