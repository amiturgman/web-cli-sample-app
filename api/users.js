
var api = { console: { autoLoad: true} };

var express = require('express'),
  router = api.router = express.Router(),
  docRouter = require('docrouter').docRouter,
  users = require('../auth/users'),
  config = require('../config');

module.exports = api;

docRouter(router, "/api/users", function (router) {


  // make sure feature is enabled  
  router.use(function (req, res, next) { 
    if (config.users.enabled)
      return next();
    
    var msg = 'Users feature is disabled. To enable, please provide Azure Storage account, and Google authentication settings in config file or environment variables';
    console.warn(msg);
    res.writeHead(404);
    return res.end(msg);
  });

  
  router.post('/add', function (req, res) { 

    var email = req.body['email'];
    var name = req.body['name'];

    console.log('req.user', req.user);

    return users.upsertUser({
        email: email,
        name: name,
        addedBy: req.user.email
      },
      function(err, user) {
        if (err) return res.json({ err: err.message });

        var result = {
          status: 'OK',
          message: 'user added successfully'
        };

        return res.json(result);
    });
  },
  {
      id: 'users_add',
      name: 'add',
      usage: 'users add -e [GoogleAccount] -n [UserName]',
      example: 'users add -e user@gmail.com -n "User Name"',
      doc: 'Adds a user to the console admins',
      params: {
        "email": {
          "short": "e",
          "type": "string",
          "doc": "google account email address",
          "style": "body",
          "required": true
        },
        "name": {
          "short": "n",
          "type": "string",
          "doc": "user's name",
          "style": "body",
          "required": true
        }
      },
      response: { representations: ['application/json'] }
    }
  );

  router.get('/list', function(req, res) { 
    var extended = req.query.extended;
    return users.listUsers({ extended: extended }, function(err, result) {
      if (err) return res.json({ err: err.message });
      return res.json(result);
    });
  },
  {
      id: 'users_list',
      name: 'list',
      usage: 'users list',
      example: 'users list',
      doc: 'Gets the list of admins',
      params: {
        "extended": {
          "short": "x",
          "type": "boolean",
          "doc": "provides extended info for each user",
          "style": "query"
        }
      },
      response: { representations: ['application/json'] }
    }
  );


 router.get('/get', function(req, res) {
    var email = req.query['email'];
    return users.getUser({ email: email}, function(err, user) {
      if (err) return res.json({ err: err.message });
      var result = user ? user : {
        status: 'error',
        message: 'user does not exist',
        user: email
      };
      return res.json(user);
    });
  },
  {
      id: 'users_get',
      name: 'get',
      usage: 'users get -e [GoogleAccount]',
      example: 'users get -e user@gmail.com',
      doc: 'Gets info for a specific user',
      params: {
        "email": {
          "short": "e",
          "type": "string",
          "doc": "google account email address",
          "style": "query"
        }
      },
      response: { representations: ['application/json'] }
    }
  );

  router.post('/remove', function (req, res) { 
    var email = req.body['email'];
    
    return users.removeUser({
        email: email
      },
      function(err, userExisted) {
        if (err) return res.json({ err: err.message });

        var result = {
          status: userExisted ? 'OK' : 'error',
          message: userExisted ? 'user removed successfully' : 'user was not found',
          user: email
        };

        return res.json(result);
    });
  },
  {
      id: 'users_remove',
      name: 'remove',
      usage: 'users remove -e [GoogleAccount]',
      example: 'users remove -e user@gmail.com',
      doc: 'Removes a user from the console admins',
      params: {
        "email": {
          "short": "e",
          "type": "string",
          "doc": "google account email address",
          "style": "body",
          "required": true
        }
      },
      response: { representations: ['application/json'] }
    }
  );


});
