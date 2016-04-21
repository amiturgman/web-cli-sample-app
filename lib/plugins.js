var fs = require('fs');
var path = require('path');

module.exports = function(dirs) {

	var router = require('express').Router();

  var list = [];
  var plugins = { router: router, list: list};

  if (!dirs) return plugins;
  if (typeof dirs === 'string') dirs = [dirs];
  if (dirs.constructor !== Array) throw new Error('dirs should be either a string or an array of strings');  

	// load all .js modules from the directory list 
  dirs.forEach(function(dir) {
    dir = path.resolve(dir);
    console.log('Loading plugin from', dir);

    var modules = fs.readdirSync(dir);
    modules.forEach(function (file) {
      var module = /(.+)\.js/.exec(file);
      if (module) {
        var p = path.join(dir, file);
        var plugin = require(p);
     
        var route = "/" + module[1];
        if (module[1] === "root") route = "/";
        console.log(route, '==>', p);

        router.use(route, plugin.router || plugin);

        if (!plugin.console.autoLoad) return;
        list.push({'route': 'api'+route, console: plugin.console});
      }
    });
  });  

	return plugins;
};

