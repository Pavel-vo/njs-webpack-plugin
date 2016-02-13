var loaderUtils = require('loader-utils');
var njs = require('njs-compiler');
var swig = require('swig');

function NjsSwigPlugin(options) {
    if (!options) {
        options = {};
    }
    if (!options.tagName) {
        options.tagName = 'compileNjs';
    }
    var that = this;
    this.compiler = njs.create({runtime: options.runtime});
    var swigOptions = {cache: false, locals: options.locals};
    if (options.template_dir) {
        swigOptions.loader = swig.loaders.fs(options.template_dir);
    }
    this.swig = new swig.Swig(swigOptions);
    this.swig.setExtension(options.tagName, function (val) {
        return that.compiler.compile(val);
    });

    this.swig.setTag(
        options.tagName,
        function () {
            return true;
        }, function (compiler, args, content, parents, opts, blockName) {
            var val = '(function () {\n' +
                '  var _output = "";\n' +
                compiler(content, parents, opts, blockName) +
                '  return _output;\n' +
                '})()';
            var res = '_output += _ext.' + options.tagName + '(' + val + ');\n';
            return res;
        },
        true,
        true
    );

    this.loader = function (source) {
        var njsRequest = loaderUtils.getRemainingRequest(this);
        var jsRequest = loaderUtils.getCurrentRequest(this);
        var query = loaderUtils.parseQuery(this.query);
        try {
            var result = that.swig.render(source, {filename: njsRequest});
        }
        catch (e) {
            throw e;
        }
        this.callback(null, result);
    };
}

NjsSwigPlugin.prototype.apply = function (compiler) {
    var that = this;
    compiler.plugin("compilation", function (compilation) {
        compilation.plugin('normal-module-loader', function (loaderContext, module) {
            if (/\.js$/.test(module.request) && module.request.split(['!']).length == 1) {
                loaderContext.loaders.push({module: that.loader, request: module.request, path: module.request});
            }
        });

    });
};

module.exports = NjsSwigPlugin;
