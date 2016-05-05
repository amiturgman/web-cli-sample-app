
var api = { console: { autoLoad: true } };

var express = require('express'),
  router = api.router = express.Router(),
  docRouter = require('docrouter').docRouter,
  fs = require('fs'),
  marked = require('marked'),
  path = require('path');

module.exports = api;

var docsPaths = [ path.join(__dirname, '..', 'docs')];
console.log('docsPath', docsPaths);

docRouter(router, '/api/man', function(router) {
  
  docsPaths.forEach(function (docsPath, index) {
    fs.readdir(docsPath, function(err, files) {
      console.log('files', files);
      files.forEach(function(file) {
        
        if (!file.endsWith('.md')) return;
        
        var filename = file.replace('.md', '');
        router.get('/'+filename, fileHandler(docsPath, file), {
          id: 'man_'+filename,
          name: filename,
          usage: 'man '+filename,
          example: 'man '+filename,
          doc: getDescription(filename),
          params: {},
          response: { representations: ['text/html'] },
          controller: {
            cssUrl: '../../plugins/man/markdown.css'
          }
        });
      });
    });
  });

  function getDescription(file) {
    switch(file) {
      case 'intro': return 'General introduction to the console';
      case 'commands': return 'Manual for executing commands';
      case 'env': return 'Introduction to the console\'s environment management';
      case 'app': return 'Manual for manage your app';
      default: return 'Getting manual for '+ file;
    }
  }

  function fileHandler(docsPath, filename) {
    return function(req, res) {
      var filePath = path.join(docsPath, filename);
      console.log('reading file', filePath);
      
      fs.readFile(filePath, function(err, data) {
        if (err) {
          return res.json({ status: 'ERROR', message: 'error reading file', file: filePath, error: err.message });
        }

        var html = "<div class='markdown-body'>"+marked(data.toString())+"</div>";
        res.writeHead(200, {'Content-Type': 'application/html' });
        res.end(html);
      });
    };
  }

});
