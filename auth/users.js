var azure = require('azure-storage'),
  moment = require('moment'),
  storageConfig = require('../config').storage;

if (!storageConfig.enabled)
  return console.warn('Users management is disabled. Define Azure storage account configuration in config file to enable this feature');

var USERS_TABLE_NAME = 'users';

var tableService = azure.createTableService(storageConfig.account, storageConfig.key)
      .withFilter(new azure.ExponentialRetryPolicyFilter());

tableService.createTableIfNotExists(USERS_TABLE_NAME, function(err, result, response) {
  if (err) {
    console.error('could not create users table', err);
  }
});

var entGen = azure.TableUtilities.entityGenerator;

function getUserKeys(opts) {
  return {
    PartitionKey: entGen.String('1'),
    RowKey: entGen.String(opts.email)
  };
}

function getUserFromEntity(entity) {
  return {
    name: entity.name._,
    'added by': entity.addedBy._,
    'added date (utc)': moment(entity.date._).utc().format('YYYY-MM-DD HH:mm:ss')
  };
}

function upsertUser(opts, cb) {

  if (!opts.email) return cb(new Error('email was not provided'));
  if (!opts.name) return cb(new Error('name was not provided'));
  if (!opts.addedBy) return cb(new Error('addedBy was not provided'));
  
  var userKeys = getUserKeys(opts); 
  var entity = {
    PartitionKey: userKeys.PartitionKey,
    RowKey: userKeys.RowKey,
    name: entGen.String(opts.name),
    addedBy: entGen.String(opts.addedBy),
    date: entGen.DateTime(new Date()),
  };

  return tableService.insertOrReplaceEntity(USERS_TABLE_NAME, entity, function(err, result, response) {
    if (err) console.error('error upserting user', err, opts);
    return cb(err);
  });
}

function getUser(opts, cb) {

  if (!opts.email) return cb(new Error('email was not provided'));  

  var userKeys = getUserKeys(opts);

  return tableService.retrieveEntity(USERS_TABLE_NAME, userKeys.PartitionKey._, userKeys.RowKey._, function(err, result, response) {
    if (err) {
      console.error('error retrieving user', err, opts);

      // not a real error, user does not exists      
      if (response.statusCode === 404) {
        return cb();
      }

      return cb(err);
    }
    return cb(null, getUserFromEntity(result));
  });
}

function listUsers(opts, cb) {
  var query = new azure.TableQuery();

  return tableService.queryEntities(USERS_TABLE_NAME, query, null, function(err, result, response) {
    if (err) {
      console.error('error retrieving users', err, opts);
      return cb(err);
    }
    var users = {};
    result.entries.forEach(function(entity) {
      users[entity.RowKey._] = opts.extended ? getUserFromEntity(entity) : entity.name._;
    });
    return cb(null, users);
  });
}

function removeUser(opts, cb) {

  if (!opts.email) return cb(new Error('email was not provided'));  

  var userKeys = getUserKeys(opts);

  return tableService.deleteEntity(USERS_TABLE_NAME, userKeys, function(err, response) {
    if (err) {
      console.error('error deleting user', err, opts);

      // not a real error, user does not exists      
      if (response.statusCode === 404) {
        return cb(null, false);
      }

      return cb(err);
    }
    return cb(null, true);
  });
}

module.exports = {
  upsertUser: upsertUser,
  getUser: getUser,
  listUsers: listUsers,
  removeUser: removeUser
};
