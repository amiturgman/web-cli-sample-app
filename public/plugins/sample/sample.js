/**
 * Created by JetBrains WebStorm.
 * User: amitu
 * Date: 1/15/12
 * Time: 1:50 PM
 * To change this template use File | Settings | File Templates.
 */

    //debugger;
    console.info('sample handler loaded');

    // the following 2 lines are possible. in this case, the css are defined on the server side
    //anode.loadCss('plugins/sample.css');
    //anode.addCss(".anode-sample {width: 300px;border: 1px solid gray;background-color: rgba(236, 255, 117, 0.60);padding: 4px;}")

    // anode will always be in the global context in this stage as this script always loaded after anode is already initialized
    this.handler = function(error, response){
        if (queryObject.get('debug')) debugger;
        var args = response.args;
        var context = response.context;
        var env = context.env;
        var command = context.command;
        var data = response.data;

        var progress = 0;
        var intrvl = setInterval(function(){
            response.promise.setProgress(progress);
            if(progress==100) {
                clearInterval(intrvl);
                response.promise.resolve(
                        $("<div>").addClass('anode-sample').html(
                            'this is the client side plugin handler speaking.. got the following parametrs:' + JSON.stringify(args) +
                            '. got the following response: ' + JSON.stringify(data)));
            }
            progress+=10;
        }, 200);
    }


    this.clientonly = function(args, context) {
        return 'from client side: ' +args.someparam;
    }
