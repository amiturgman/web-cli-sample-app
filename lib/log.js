
var logging = require('azure-logging');

/*
 * This module uses azure-logging to encapsulate console.log with a substitute
 * method that logs messages to an azure table.
 * 
 * Once init is called, there is no need to call require('pl-log') again
 * in this process.
 */
function init(options, cb) {
    logging.writer(options, function (err, logwriter) {
        if (err) return cb(err);

        // replace console.xxx with logwriter.xxx
        logging.interceptor.replace(console, logwriter);

        return cb();
    });
};

function getInstanceId() {
    var instanceId = process.env.COMPUTERNAME;
    if (!instanceId) return 'local';
    return instanceId;
}

module.exports = {
    init: init,
    getInstanceId: getInstanceId
};
