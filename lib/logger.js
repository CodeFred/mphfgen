var _ = require('underscore');
var cli = require('cli');
var util = require('util');

['debug','error','fatal','info','ok'].forEach(addExport);
function addExport(name) {
    module.exports[name] = expand;
    
    function expand() {
        var args = [];
        var copy = _.partial(invoke, args, 'push');
        
        _.each(arguments, copy);
        cli[name](util.format.apply(util, args));
    }
}

function invoke(target, op, x) {
    target[op](x);
}
