#!/usr/bin/env node

var argv = require('optimist').argv;
var utils = require('./src/utils');

var _ = require('lodash');
var verify = require('check-types').verify;
var isUrl = require('npm-utils').isUrl;

function checkTopLevelNpmDependencies(folder, verbose) {
  verify.string(folder, 'missing folder string');

  var pkg = utils.getPackage(process.cwd());
  var deps = utils.getAllDependencies(pkg);

  if (verbose) {
    console.log(pkg.name + ' declares:\n' +
      JSON.stringify(deps, null, 2));
  }

  var ok = true;
  _.forOwn(deps, function (declaredVersion, dep) {
    if (isUrl(declaredVersion)) {
      console.log('skipping git url', declaredVersion);
      return;
    }
    ok = ok && utils.checkDependency(dep, declaredVersion, verbose);
  });

  return ok;
}

if (!module.parent) {
  var verbose = argv.verbose;
  var ok = checkTopLevelNpmDependencies(process.cwd(), verbose);
  process.exit(ok ? 0 : 1);
  return;
}

module.exports = checkTopLevelNpmDependencies;
