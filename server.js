
var config = require('./config');
var log = require('./lib/log');

var app = require('./app');

app.set('port', process.env.PORT || 3000);

if (config.log.enabled) {
  log.init({
    domain: process.env.COMPUTERNAME || '',
    instanceId: log.getInstanceId(),
    app: config.apps.console.name,
    level: config.log.level,
    transporters: config.log.transporters
  },
    function(err) {
      if (err) return console.error(err);
      console.log('starting server...');
      return runWebsite();
    });
}
else
  return runWebsite();

function runWebsite() {
  var server = app.listen(app.get('port'), function(err) {
    if (err) return console.error(err);
    console.log('server listening on port', server.address().port);
  });
}
