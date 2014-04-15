var should = require('should');
var fs = require ('fs');
var pegstrip = require('../lib/pegstrip.js');

function read(file) {
	return fs.readFileSync(__dirname + '/' + file, 'utf8');
}

it('should correctly strip css.pegjs', function() {
	pegstrip(read('css.pegjs')).should.equal(read('css.peg'));
});