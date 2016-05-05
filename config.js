

// This is the main configuration file which helps you turn on and off some of the features
// supported in this example.
// To turn on any feature, please provide the relevant configuration details below.
// Not providing the neccessary configuration details will result in a feature being disabled.


// Authentication
// --------------
// only enabled if below details were provided
//
// Google's client Id
var auth_google_client_id = process.env.GOOGLE_CLIENT_ID;
//
// Google's client secret
var auth_google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
//
// Google's callback URL. Use the following format:
// for local: http://localhost:3000/.auth/login/google/callback
// for remote: http://yourWebAppUrl/.auth/login/google/callback
var auth_google_callback_url = process.env.GOOGLE_CALLBACK_URL;


// Authorization
// -------------
// only enabled if authentication details were provided above in addition to the following:
//
// this should be your google email address for the account that
// will manage the permissions for accessing the console.
// not providing this value will not enforce authorization, and
// everyone will be able to access the console, after authenticating with Google.
var auth_google_admin_account = process.env.GOOGLE_ADMIN_ACCOUNT;
//
// storage will be used to keep users list in an Azure table.
// not providing these details will result in disabling the users / authorization feature 
//
// azure storage account name
var storage_account = process.env.STORAGE_ACCOUNT;
//
// azure storage acount key
var storage_account_key = process.env.STORAGE_KEY;


// Logging
// -------
// this configuration is used by the azure-logging module to maintain application logs.
// using the log command, you'll be able to query for the application logs in the console.
// not providing the below information will result in disabling this feature.

// log azure storage account name
var log_storage_account = process.env.LOG_STORAGE_ACCOUNT;
//
// log azure storage acount key
var log_storage_account_key = process.env.LOG_STORAGE_KEY;


/*********   PLEASE DO NOT CHANGE ANYTHING BELOW THIS LINE   *********/

var config = {
    auth: {
        google: {
            clientID: auth_google_client_id,
            clientSecret: auth_google_client_secret,
            callbackURL: auth_google_callback_url,
            adminAccount: auth_google_admin_account,
            enabled: auth_google_client_id && auth_google_client_secret && auth_google_callback_url
        }
    },

    storage: {
        account: storage_account,
        key: storage_account_key,
        enabled: storage_account && storage_account_key 
    },
    
    log: {
        // minimum level to show logs
        level: process.env.LOG_LEVEL || 'log',

        // supported transporters for the application logs.
        // currently redirecting logs to both the console and Azure storage
        transporters: [
        {
            name: 'console', 
            write : true, 
            default: false,
            options: {
                level: 'log'
            }
        },
        {
            name: 'azuretable',
            write: true,
            default: true,
            options: {
                storage: {
                    account: log_storage_account,
                    key: log_storage_account_key
                }
            }
        }],

        enabled: log_storage_account && log_storage_account_key
      },
      apps: {
        console: { name: 'console', desc: 'the command line console web app' }
      }
};

config.users = {
    enabled: config.auth.google.enabled && config.auth.google.adminAccount && config.storage.enabled
}

module.exports = config;
