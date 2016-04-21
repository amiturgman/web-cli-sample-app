/**
 * Created by JetBrains WebStorm.
 * User: amitu
 * Date: 1/15/12
 * Time: 1:50 PM
 * To change this template use File | Settings | File Templates.
 */

    //debugger;
    console.info('sample handler loaded');

    this.htmlbcasthandler = function(response){
        if (queryObject.get('debug')) debugger;
        var args = response.args;
        var context = response.context;
        var env = context.env;
        var command = context.command;
        var data = response.data;

        var res = $("<div>");
        _.each(data, function(instanceResult){
            var title = $("<div>").appendTo(res).html(instanceResult.instance);
            var data = $("<div>").appendTo(res).html(instanceResult.error || instanceResult.response);
        });
        response.promise.resolve(res);
    }

