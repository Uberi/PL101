var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

fs.readFile('Scheem.peg', 'ascii', function(err, data) {
    var parse = PEG.buildParser(data).parse;
    assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );
});