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

    var highestZ = 0;
    var highestId = 0;

    var colors = ['#fffaf0', '#ffffef', '#f5f5dc', '#ffffcc'];
    var colorIndex = 0;
    
    $("#btnNewNote").click(function () {
        CreateNote();
    });

    function CreateNote(id, note, timestamp, left, top, zindex) {

        if(id && id>=highestId) highestId = id + 1;
        var noteId = id || ++highestId;
        var time = timestamp || new Date().toLocaleTimeString();
        var text = note || " ";
        var _left = left || Math.round(Math.random() * 400) + "px";
        var _top = top || Math.round(Math.random() * 300) + "px";
        if(zindex && zindex>=highestZ) highestZ = zindex + 1;
        var _zindex = zindex || ++highestZ;

        var webCli = $(".note").first().clone().attr("id", noteId)
          .find(".cli-container").append($('<web-cli>')).end()
          .css({
            left: _left,
            top: _top,
            "z-index": _zindex,
            backgroundColor: colors[colorIndex++%colors.length]
          })
          .appendTo("body")
          .find(".modifiedTime").html(time).end()
          .find(".edit").html(text).end()
          .draggable()
          .show()
          .resizable()
          .click(function (e) {
            $(this)
                .find(".cli-input").focus();
           })
          .mousedown(function(e) {
            $(this).css("z-index", ++highestZ);
          })
          .find(".closebutton")
          .click(function () {
            var note = $(this).parents(".note");

            var duration = event.shiftKey ? 2 : .25;
            note.css(
            {  /* http://css3.bradshawenterprises.com/transitions/ */
              webkitTransition: '-webkit-transform ' + duration + 's ease-in, opacity ' + duration + 's ease-in',
              webkitTransformOrigin: "0 0",
              webkitTransform: 'skew(30deg, 0deg) scale(0)',
              opacity: '0'
            });


            setTimeout(function () {
                  note.remove();
            }, duration * 1000);

          }).end()
          .find("web-cli")[0];


        // webCli is ready to be initialized    
        webCli.onReady = function () {
          // init the console with options object
          webCli.init({
            environment: environmentVars,
            plugins: cliData.apis,
            sid: 'console' + noteId,
            welcomeMessage: '<p>Welcome to the web-cli demo app!</p>' +
              'Type <b>help</b> to start exploring the commands currently supported or <b>man</b> to get a list of available manuals for this console. <br />' +
              'Type <b>plugins install sample /api/sample/!! -p</b> to install the sample plugin which is not added by default. You can then type <b>help sample</b> to see the list of available sample commands. <br/>'
          });

          updatePrompt(webCli);

          // listen on envronment variables changes and update the consolde prompt string accordingly.
          // in this case, we'de like to reflect the change in the app name.
          webCli.addEventListener('envChanged', function (e) {
            console.log('envChanged!', e.detail);
            updatePrompt(webCli);
          });
        }
      }
    

    // extending jQuery with the setTime method
    (function ($) {
      $.fn.setTime = function () {
        var date = new Date();
        var time = date.toLocaleTimeString();
        $(this).find(".modifiedTime").html(time);
        return $(this);
      }
    });
   

    // updates the prompt string    
    function updatePrompt(webCli) {
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
    $.getJSON('../cli', function (data, success, xhr) {
      if (xhr.status != 200 || !data) return cb(new Error('got status code:' + xhr.status + '; response:' + xhr.responseText));
      for (var i = 0; i < data.apis.length; i++)
        data.apis[i].route = '../' + data.apis[i].route; 
      return cb(null, data);
    })
    .error(function (xhr) {
      return new Error('error: status code:' + xhr.status + ' status text:' + xhr.statusText + ' response text:' + xhr.responseText);
    });  
  }
   
});