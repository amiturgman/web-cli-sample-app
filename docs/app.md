Managing My Application
=======================
Setting the console's predefined `app` environment variable to the name of your app, will make all of the app-related commands to run in the __context__ of your application.  
This is done by defining the `app` environment value as the default value for an app-related command.
Type `help log` for example, and see that the `$app` environment variable is defined as a default value for this command.
This design eliminates the need for you to always provide this value as part of the command, if set.

For example, to work in the context of the console's app, we'll run `set app console`, and from now on, all app-related commands will work with this app. The context application is also
visible in the prompt label, on the left side of the command line input text box.

Application Data and Actions
----------------------------
Some of the current supported app-related commands are-

* `app list`- Displays a list of all application.

Use `help app` to see the full list of app-based commands.

Application Logs
------------------------
To get logs for you application, use the `log` command. By just executing `log`, you'll get the last 100 log entries for the context application. 
If you'de like to filter logs base on the `farm` as well, set the `farm` environment variable accordingly, and it will be automatically used when filtering logs, or provide the `farm` variable as
part of the command line.  

Logs can be filtered based on few parameters-

* `level`- Should be `log`, `info`, `warn` or `error`. Default is `log`. Each value will filter all entries with the level chosen and higher.
* `farm`- Filter logs based on the farm name. This is a string value, currently not validated.
* `instance`- Filter logs based on the originated instance. This is a string value, currently not validated.
* `since`- Filter logs since a provided date. Example of using this parameter: `--since '2012-01-01 12:00'`.
* `message`- Filter logs by message. Example of using this parameter: `--message 'text to filter'`.
* `skip`- Number of entries to skip.
* `top`- Number of entries to return.

To get the full set of parameters used by the log command, type `help log`.

see _extend_ manual for information of creating management API for you application and integrating it with the console.