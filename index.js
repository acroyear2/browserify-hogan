var hogan   = require('hogan.js'),
    through = require('through'),
    minify  = require('html-minifier').minify;

var filenamePattern = /\.(html|hogan|hg|mustache|ms)$/;
var minifierDefaults = {
    removeComments               : true,
    collapseWhitespace           : true,
    removeAttributeQuotes        : true,
    removeCommentsFromCDATA      : false,
    removeCDATASectionsFromCDATA : false,
    collapseBooleanAttributes    : false,
    removeRedundantAttributes    : false,
    useShortDoctype              : false,
    removeOptionalTags           : false,
    removeEmptyElements          : false
};

function extend (obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        if (!source) { return; }

        for (var key in source) {
            obj[key] = source[key];
        }
    });

    return obj;
}

module.exports = function (file, opts) {
    if (!filenamePattern.test(file)) return through();

    opts = opts || {};
    var minifierOpts = extend({}, minifierDefaults, opts.minifierOpts);

    var input = '';
    var write = function (buffer) {
        input += buffer;
    }

    var end = function () {
        this.queue('module.exports = new (require(\'hogan.js/lib/template\')).Template(' + 
            hogan.compile(minify(input, minifierOpts), { asString: true }) + ');');
        this.queue(null);
    }

    return through(write, end);
}
