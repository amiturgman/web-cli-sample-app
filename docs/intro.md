Introduction
============
Anode dashboard is aimed to provide means for an anode developer to track and manage her applications running on anode farm.
The dashboard is designed to be extensible, allowing new commands to be easily added and integrated into it.

Currently, the dashboard supports the following commands and features

 * `log`- Fetch and filter logs base on different parameters. Type `help log` for a list of available parameters.
 * `app`- Get or perform application related actions such as getting the application's metadata, getting the list of applications, reviewing the last commits or restarting an application.
 * `set`- Manages environment variables, used by the dashboard and some of the commands.
 * `tab`- Creates a new dashboard window, supporting different persistent sessions.

Type `help` to see the full list of commands currently supported. Use `help commandName` to get help for a specific command.
 
Type `man env` or see command details using `help set` to learn more about __Managing Environment Variables__.  
Type `man commands` to learn more about the __Command Structure__.  
Type `man app` or see command details using `help app` to learn more about __Managing My Application__.  
Type `man extend` to learn more about __Extending Anode Console__.  
Type `man plugins` to learn more about __Creating Management API For My App__'.  
Type `man tabs` to learn more about __Managing Parallel Console Sessions__.  
Type `man docker` to learn more about __Keeping Things Important To Me On Screen__.