$(function () {

  // get plugins and user details from the server.
  // we could have also provided the pluginsUrl property on the control itselft, and the control would have fetched this data.
  // since we need to get the user details anyway, we're using the same request to get all the data at once and providing the plugins explicitely.
  getPluginsAndUser(function (err, cliData) { 
    if (err) return console.error(err);
    var user = cliData.user || {};

    // environment variables to use by this console instance
    var environmentVars = {
      app: { type: 'string', value: 'console', description: 'The current app name', userReadOnly: false },
    };

    if (user.name)
      environmentVars.username = { type: 'string', value: user.name, description: 'The current username', userReadOnly: true }; 


    var webCli = $('#webCli')[0];


    // webCli is ready to be initialized    
    webCli.onReady = function () {

      // init the console with options object
      webCli.init({
        environment: environmentVars,
        plugins: cliData.apis,
        commands: getLocalCommands(),
        broadcastUrlGenerator: broadcastUrlGenerator,
        welcomeMessage: '<p>Welcome to the web-cli demo app!</p>' +
          'Type <b>help</b> to start exploring the commands currently supported or <b>man</b> to get a list of available manuals for this console. <br />' +
          'Watch the <b><a href="sticky-notes" target="_blank">sticky-notes-like</a></b> sample for creating multiple console instances.<br/>' + 
          'Type <b>plugins install sample /api/sample/!! -p</b> to install the sample plugin which is not added by default. You can then type <b>help sample</b> to see the list of available sample commands. <br/>'
      });

      updatePrompt();


      // listen on envronment variables changes and update the consolde prompt string accordingly.
      // in this case, we'de like to reflect the change in the app name.
      webCli.addEventListener('envChanged', function (e) {
        console.log('envChanged!', e.detail);
        updatePrompt();
      });
      
    }

    // updates the prompt string    
    function updatePrompt() {
      // this is the cli control 
      var app = webCli.env('app');
      var image = user.image ? "<img src='" + user.image + "' class='promptImage' width='18px'/>" : '';
      var prompt = image + '[';
      if (user.name) prompt += user.name + '\\';
      if (app) prompt += '' + app + '';
      prompt += ']>';
      webCli.prompt(prompt);
    }

  });  

  // get plugins metadata and user details from the server  
  function getPluginsAndUser(cb) {
    $.getJSON('cli', function (data, success, xhr) {
      if (xhr.status != 200 || !data) return cb(new Error('got status code:' + xhr.status + '; response:' + xhr.responseText));
      return cb(null, data);
    })
    .error(function (xhr) {
      return new Error('error: status code:' + xhr.status + ' status text:' + xhr.statusText + ' response text:' + xhr.responseText);
    });  
  }

  // this is the place to extend the console
  // with more client-side commands
  function getLocalCommands() {
    
    var versionCommand = {
      name: 'version',
      description: "gets the version of this console",
      usage: 'version',
      example: 'version',
      params: [],
      exec: function (args, context) {
        return '1.0';
      }
    };

    var commands = [versionCommand];
    return commands;
  }

  // returns an array of ajaxOptions used by cli when broadcasting a request
  // this method should basically return a list of ajaxRequestOptions objects representing the
  // different servers to send the request to.
  // this is mainly used when we're administrating a farm of servers, and
  // we wish to get response from all of them, aggregate the result and then show all of them.
  // in this case, for the sake of the demo, i'll return the same object multiple times.
  // in real-world scenarios this is the place to change headers, url, etc. 
  function broadcastUrlGenerator(ajaxRequestOptions) {
    return [ajaxRequestOptions, ajaxRequestOptions, ajaxRequestOptions];
  }

});
