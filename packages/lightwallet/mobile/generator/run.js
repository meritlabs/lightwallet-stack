var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var dirName = process.argv[2];
if (!dirName) {
  throw 'ERROR: no module name provided';
}

var dirPath = path.normalize(__dirname + '/../src/pages/' + dirName);
if (fs.existsSync(dirPath)) {
  throw 'ERROR: module exists!';
}

moduleName = '';
var fileName = dirName
  .split('/')
  .pop()
  .toLowerCase();
fileName.split('-').forEach(function(word) {
  moduleName += word.charAt(0).toUpperCase() + word.slice(1);
});

var componentName = moduleName + 'View';
var interpolate = function(content) {
  content = content.replace(/\$\$componentName\$\$/gi, componentName);
  content = content.replace(/\$\$moduleName\$\$/gi, moduleName);
  content = content.replace(/\$\$fileName\$\$/gi, fileName);
  return content;
};

console.log("generating module '" + moduleName + "' in " + dirPath);

mkdirp(dirPath, function(err) {
  if (err) throw err;

  var content = fs.readFileSync(__dirname + '/templates/view.html', 'utf8');
  fs.writeFileSync(dirPath + '/' + fileName + '.html', interpolate(content));

  var content = fs.readFileSync(__dirname + '/templates/module.ts', 'utf8');
  fs.writeFileSync(dirPath + '/' + fileName + '.module.ts', interpolate(content));

  var content = fs.readFileSync(__dirname + '/templates/view.ts', 'utf8');
  fs.writeFileSync(dirPath + '/' + fileName + '.ts', interpolate(content));

  var content = fs.readFileSync(__dirname + '/templates/style.scss', 'utf8');
  fs.writeFileSync(dirPath + '/' + fileName + '.scss', interpolate(content));

  console.log('success');
});
