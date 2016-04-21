
var api = { console: { autoLoad: true} };

var express = require('express'),
    router = api.router = express.Router(),
    docRouter = require('docrouter').docRouter,
    logReader = require('azure-logging'),
    url = require('url'),
    sanitize = require('validator').sanitize,
    config = require('../config');

module.exports = api;

docRouter(router, "/api/log", function (router) {
    router.get('/', handleLogRequest, getDocRouterInfo());
});

function getDocRouterInfo() {

  var logParams = {};
  for (var i = 0; i < logReader.params.length; i++) {
    var p = logReader.params[i];
    if (p.name == 'format' || p.name == 'nocolors')
      continue;

    var param = { style: 'query', type: p.type };

    if (p.desc) param.doc = p.desc;
    if (p.required) param.required = p.required;
    if (p.short) param.short = p.short;
    if (p.options) param.options = p.options;
    if (p.defaultValue) param.defaultValue = p.defaultValue;

    switch (p.name) {
      case 'app':
        param.defaultEnvVar = "app";
        break;
    }

    logParams[p.name] = param;
  }

  return {
    id: 'api_log_getLogs',
    name: 'log',
    usage: 'log [--top number] [-a app] [-l level] [-s since] [--message message] [--skip number] [--limit number]',
    example: 'log --top 10 -a console',
    doc: 'Get logs from azure logging',
    params: logParams,
    response: { representations: ['application/json'] },
    controller: {
      url: '../../plugins/log/log.js', // relative to /api/log
      cssUrl: '../../plugins/log/log.css' // relative to /api/log
    }
  };
}

function handleLogRequest(req, res) {

  if (!config.log.enabled) {
    var msg = 'Log feature is disabled. To enable, please provide Log Azure Storage account settings in config file or environment variables';
    console.warn(msg);
    res.writeHead(404);
    return res.end(msg);
  }
  
  var options = {};

  for (var i = 0; i < logReader.params.length; i++) {
    var p = logReader.params[i];
    if (req.query[p.name]) options[p.name] = req.query[p.name];
  }
  options['format'] = 'text';
  options['nocolors'] = true;


  options.transporters = config.log.transporters;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  console.log('log options query', options);

  var results = [];
  logReader.reader(options, function(err, r) {
    if (err) {
      console.warn('Failed to obtain log reader', err);
      return res.end(JSON.stringify(err, null, 2));
    }
    r.on('line', function (data) { results.push(data); });
    r.on('end', function () { res.end(JSON.stringify(results)); });
    r.on('error', function (err) { res.end(JSON.stringify(err, null, 2)); });
  });
}