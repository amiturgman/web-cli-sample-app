
var api = { console: { autoLoad: false} };

var express = require('express');
var router = api.router = express.Router();
var docRouter = require('docrouter').docRouter;

module.exports = api;

docRouter(router, '/api/sample', function (router) {

    router.get('/json/:tparam1/:tparam2', function (req, res) {
      var tparam1 = req.params.tparam1;
      var tparam2 = req.params.tparam2;
      var qparam = req.query['qparam'];

      var o = { tparam1: tparam1, tparam2: tparam2, qparam: qparam };
      console.log('o', o);
      console.warn('o', o);
      console.info('o', o);
      console.error('o', o);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(o));
    },
    {
      id: 'sample_json',
      name: 'json',
      usage: 'json tparam1 qparam [tparam2]',
      example: 'json tparam1 qparamValue',
      doc: 'sample for a GET command getting template params and a query param',
      params: {
        "tparam1": {
          "short": "b",
          "type": "string",
          "doc": "template param",
          "style": "template",
          "required": "true"
        },
        "qparam": {
          "short": "q",
          "type": "string",
          "doc": "querty string param",
          "style": "query",
          "required": "true"
        },
        tparam2: {
          "short": "a",
          "type": "string",
          "doc": "template param",
          "style": "template",
          "required": "true",
          "defaultValue": "someTemplateValue"
        }
      }
    });

    router.post('/html', function (req, res) {
      var flag = req.query.flag;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end("<div style='background-color: red;'>HTML output: body param: " + req.body.bparam +
                      " Flag: " + flag + "</div>");
    },
    {
      id: 'sample_html',
      name: 'html',
      usage: 'html tparam qparam',
      example: 'html tparam qparam',
      doc: 'sample for a POST command getting a template param returning html',
      params: {
        "bparam": {
          "short": "b",
          "type": "string",
          "doc": "post body param",
          "style": "body",
          "required": "true"
        },
        "flag": {
          "short": "f",
          "type": "bool",
          "doc": "some boolean flag",
          "style": "query",
          "required": "true"
        }
      }
    });

    router.post('/htmlbcast', function (req, res) {
      var flag = req.query.flag;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end("<div class='anode-sample-class'>HTML output: (): POST Param: " + req.body.bparam +
                          " Flag: " + flag + "</div>");
    },
    {
      id: 'sample_htmlbcast',
      name: 'htmlbcast',
      usage: 'htmlbcast tparam qparam',
      example: 'htmlbcast tparam qparam',
      doc: 'sample for a broadcasting POST command getting a template param returning html',
      broadcast: true,
      params: {
        "bparam": {
          "short": "b",
          "type": "string",
          "doc": "POST param",
          "style": "body",
          "required": "true"
        },
        "flag": {
          "short": "f",
          "type": "bool",
          "doc": "some boolean flag",
          "style": "query",
          "required": "true"
        }
      },
      controller: {
        css: '.anode-sample-class{ background-color: green; }'
      }
    });

    router.post('/htmlbcasthandler', function (req, res) {
      var flag = req.query.flag;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end("<div style='background-color: yellow;'>HTML output: (): POST Param: " + req.body.bparam +
                          " Flag: " + flag + "</div>");
    },
    {
      id: 'sample_htmlbcasthandler',
      name: 'htmlbcasthandler',
      usage: 'htmlbcasthandler tparam qparam',
      example: 'htmlbcasthandler tparam qparam',
      doc: 'sample for a broadcasting POST command getting a template param returning html with handler',
      broadcast: true,
      params: {
        "bparam": {
          "short": "b",
          "type": "string",
          "doc": "POST param",
          "style": "body",
          "required": "true"
        },
        "flag": {
          "short": "f",
          "type": "bool",
          "doc": "some boolean flag",
          "style": "query",
          "required": "true"
        }
      },
      controller: {
        url: '../../plugins/sample/sample2.js' // relative to /api/sample
      }
    });

    router.get('/bcast', function (req, res) {
      res.json({ host: process.env.COMPUTERNAME || 'local', someData: 'data' });
    },
    {
      id: 'sample_bcast',
      name: 'bcast',
      usage: 'sample bcast',
      example: 'sample bcast',
      doc: 'sample for a broadcasting command',
      broadcast: true
    });

    router.get('/handler/:tparam', function (req, res) {
      var tparam = req.params.tparam;
      var qparam = req.query['qparam'];

      var o = { tparam: tparam };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(o));
    },
    {
      id: 'sample_handler',
      name: 'handler',
      usage: 'handler',
      example: 'handler',
      doc: 'sample for a GET command using external handler',
      params: {
        "tparam": {
          "short": "t",
          "type": "string",
          "doc": "template param",
          "style": "template",
          "required": "true"
        }
      },
      controller: {
        url: '../../plugins/sample/sample.js',     // relative to /api/sample
        cssUrl: '../../plugins/sample/sample.css'  // relative to /api/sample
      }
    });

    router.get('/clientonly', function (req, res) {
      res.writeHead(500);
      res.end('we should not get here since this is only a client side command');
    },
    {
      id: 'sample_clientonly',
      name: 'clientonly',
      usage: 'clientonly',
      example: 'clientonly',
      doc: 'sample for a client side only command',
      params: {
        "someparam": {
          "short": "s",
          "type": "string",
          "doc": "some param",
          "required": "true"
        }
      },
      controller: {
        clientOnly: true,
        url: '../../plugins/sample/sample.js'     // relative to /api/sample
      }
    });

});