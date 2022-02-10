/* eslint-disable no-useless-escape */

const flip = require('./data/flip.js');
const tiny = require('./data/tiny.js');
const bent = require('./data/bent.js');
const copy = require('./data/copy.js')

module.exports = {
	bent: function(str) {
		let c = '';
		for (let a, d = 0, e = str.length; d < e; d++) {
			(a = bent[str.charAt(d)]),
			typeof a == 'undefined' && (a = str.charAt(d)),
			(c += a);
		}
		return c;
	},
	flip: function(str) {
		const c = [];
		for (let a, d = 0, e = str.length; d < e; d++) {
			(a = str.charAt(d)),
			d > 0 &&
				(a == '\u0324' || a == '\u0317' || a == '\u0316' || a == '\u032e')
				? ((a = flip[str.charAt(d - 1) + a]), c.pop())
				: ((a = flip[a]), typeof a == 'undefined' && (a = str.charAt(d))),
			c.push(a);
		}
		return c.reverse().join('');
	},
	mirror: function(str) {
		let c = [];
		const d = [];
		for (let a, e = 0, f = str.length; e < f; e++) {
			(a = str.charAt(e)),
			e > 0 &&
				(a == '\u0308' || a == '\u0300' || a == '\u0301' || a == '\u0302')
				? ((a = copy[str.charAt(e - 1) + a]), c.pop())
				: ((a = copy[a]), typeof a == 'undefined' && (a = str.charAt(e))),
			a == '\n' ? (d.push(c.reverse().join('')), (c = [])) : c.push(a);
		}
		d.push(c.reverse().join(''));
		return d.join('\n');
	},
	randomCase: function(string) {
		let result = '';
		if (!string) throw new TypeError('Sudo Error: A string was not specified.');
		if (typeof string !== 'string') {
			throw new TypeError('Sudo Error: Provided string is Invalid.');
		}
		for (const i in string) {
			const Random = Math.floor(Math.random() * 2);
			result += Random == 1 ? string[i].toLowerCase() : string[i].toUpperCase();
		}
		return result;
	},
	randomHexColor: function() {
		return (
			'#' +
			('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6)
		);
	},
	randomizeNumber: function(start, end) {
		if (!start) throw new TypeError('Sudo Error: A number was not specified.');
		if (!end) throw new TypeError('Sudo Error: A number was not specified.');
		if (typeof start !== 'number' && typeof end !== 'number') {
			throw new TypeError('Sudo Error: Provided number data is Invalid');
		}
		const res = Math.floor(Math.random() * (end - start + 1) + start);
		return res;
	},
	randomizeString: function(array) {
		if (!array) throw new TypeError('Sudo Error: A array was not specified.');
		if (typeof array !== 'object') {
			throw new TypeError('Sudo Error: The provided array is invalid.');
		}
		const res = Math.floor(Math.random() * array.length);
		return array[res];
	},
	reverseText: function(string) {
		return string.split('').reverse().join('');
	},
	tinyCaptial: function(str) {
		let c = '',
			a;
		str = str.toUpperCase();
		for (let d = 0, e = str.length; d < e; d++) {
			(a = tiny[str.charAt(d)]),
			typeof a == 'undefined' && (a = str.charAt(d)),
			(c += a);
		}
		return c;
	},
	vaporwave: function(string) {
		return string
			.replace(/[a-zA-Z0-9!\?\.'";:\]\[}{\)\(@#\$%\^&\*\-_=\+`~><]/g, (char) =>
				String.fromCharCode(0xfee0 + char.charCodeAt(0)),
			)
			.replace(/ /g, ' ');
	},
	Sudo: require('./src/Sudo'),
	Snake : require('./src/Snake'),
	Fight : require('./src/Fight'),
	Trivia : require('./src/Trivia'),
	FastType : require('./src/FastType'),
	QuickClick : require('./src/QuickClick'),
	ChaosWords : require('./src/ChaosWords'),
	LieSwatter : require('./src/LieSwatter'),
	Calculator : require('./src/Calculator'),
	ShuffleGuess : require('./src/ShuffleGuess'),
	GuessTheNumber : require('./src/GuessTheNumber'),
	WouldYouRather : require('./src/WouldYouRather'),
	GuessThePokemon : require('./src/GuessThePokemon'),
	RockPaperScissors : require('./src/RockPaperScissors'),
	WillYouPressTheButton : require('./src/WillYouPressTheButton'),
};