Web-based Command Line Interface Console
========================================
This is a sample application for using the [web-cli](https://github.com/amiturgman/web-cli) html [Polymer](https://www.polymer-project.org/1.0/) control. 

The application is a holistic solution for a web based CLI, with the following features implemented:

* **Authentication**- using Google authentication
* **Authorization**- Maintaining a list of authorized users
* **Logging**- query application logs (the console application logs or any other application using the same [azure-logging](https://github.com/amiturgman/azure-logging) node module.

The features are automatically enabled based on the provided configuration, so you can start by running the app as is before onboarding with Google for the authentication, or subscribing with Azure to provide an Azure Storage Account settings for the users and logs features.


Plugins samples
---------------
The application implements a few plugins to extend the console with more commands.
The plugins can be found in the [api](api) folder. The app reads this folder and adds the plugins dynamically, so basically, adding a plugin can be done by just adding a file to this folder.

Detailed description of how to extent the console can be found [here](https://github.com/amiturgman/aCLI/blob/master/docs/extend.md). 
The documentation can also be accessed using the `man` command from within the console. The `man` command itself is implemented as a plugin. 

![Example for the app](https://github.com/amiturgman/web-cli-sample-app/raw/master/images/demo.png "Screenshot")


Deployment
---------
The application can be cloned and run locally immediately on you machine. It can be deployed to Azure using the `Deploy To Azure` button (will be added soon!), or on any other cloud hosting platform. 


Running Locally
---------------

	git clone https://github.com/amiturgman/web-cli-sample-app.git
	cd web-cli-sample-app
	npm install
	cd public
	bower install
	npm start

Browse to `http://localhost:3000`


To enable the features described above, refer to the [config](config.js) file, and provide the relevant settings based on the features you'de like to enable.
You can either define these setting as environment variables, or define them in the file itself.


Enable Google Authentication
----------------------------
1. Browse to [Google Developer Console](https://console.developers.google.com/?pli=1). 
2. Under `Use Google APIs`, click `Enable and Manage APIs` link.
3. Select `Google+ API` and click `Enable`.
4. Open the `Credentials` tab. Click the `Create Credentials` select box and select `OAuth client ID`.
5. Select `Web Application` option from the menu and fill in the following details:
  * In the `Authorized JavaScript origins`, add the Url for your website: `http://localhost:3000` in this case.
  * In the `Authorized redirect URIs`, add the callback Url: `http://localhost:3000/.auth/login/google/callback` in this case.
  * Click the `Create` button.
6. You'll get a `client Id` and a `client secret`. Copy these strings to a temporary file. We'll use it in a bit.

** you can also use your web application url instead of `localhost` if you deploy it on the cloud.


# License
[MIT](LICENSE)

