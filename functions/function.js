const words = require('../data/words.json');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	getRandomID: function() { return String(Math.random()) },
	getRandomSentence: function(length) {
		const word = [];
		for (let i = 0; i < length; i++) {
			word.push(words[Math.floor(Math.random() * words.length)]);
		}
		return word;
	},
	shuffleString: function(string) {
		const str = string.split('');
		const length = str.length;
		for (let i = length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const tmp = str[i];
			str[i] = str[j];
			str[j] = tmp;
		}
		return str.join('');
	},
	convertTime: function(time) {
		const absoluteSeconds = Math.floor((time / 1000) % 60);
		const absoluteMinutes = Math.floor((time / (1000 * 60)) % 60);
		const absoluteHours = Math.floor((time / (1000 * 60 * 60)) % 24);
		const absoluteDays = Math.floor(time / (1000 * 60 * 60 * 24));
		const d = absoluteDays
			? absoluteDays === 1
				? '1 day'
				: `${absoluteDays} days`
			: null;
		const h = absoluteHours
			? absoluteHours === 1
				? '1 hour'
				: `${absoluteHours} hours`
			: null;
		const m = absoluteMinutes
			? absoluteMinutes === 1
				? '1 minute'
				: `${absoluteMinutes} minutes`
			: null;
		const s = absoluteSeconds
			? absoluteSeconds === 1
				? '1 second'
				: `${absoluteSeconds} seconds`
			: null;
		const absoluteTime = [];
		if (d) absoluteTime.push(d);
		if (h) absoluteTime.push(h);
		if (m) absoluteTime.push(m);
		if (s) absoluteTime.push(s);
		return absoluteTime.join(', ');
	},
	shuffleArray: function(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	},
	randomHexColor: function() { return Math.floor(Math.random() * (0xffffff + 1)); },
	checkForUpdates: async function() {
		const package = require('../../../package.json');
		const vLatest = require('../package.json').version;
		const where = package.dependencies['sudo-minigames'] || package.devDependencies['sudo-minigames'];
		if (where.slice(1) !== vLatest) console.log(`\x1b[41m[WARNING] \x1b[0mOutdated version of \x1b[33msudo-minigames\x1b[0m. npm i sudo-minigames@latest to update to \x1b[32m${vLatest}\x1b[0m.`)
	},
	addRow: function(btns) {
		const row = new MessageActionRow();
		for (const btn of btns) {
			row.addComponents(btn);
		}
		return row;
	},
	createButton: function(label, disabled, getRandomID) {
		let style = 'SECONDARY';
		if (label === 'AC' || label === 'DC' || label === '⌫') {
			style = 'DANGER';
		} else if (label === '=') {
			style = 'SUCCESS';
		} else if (
			label === '(' ||
			label === ')' ||
			label === '^' ||
			label === '%' ||
			label === '÷' ||
			label === 'x' ||
			label === '-' ||
			label === '+' ||
			label === '.'
		) {
			style = 'PRIMARY';
		}
		if (disabled) {
			const btn = new MessageButton()
				.setLabel(label)
				.setStyle(style)
				.setDisabled();
			if (label === '\u200b') {
				btn.setCustomId(getRandomID(10));
			} else {
				btn.setCustomId('cal' + label);
			}
			return btn;
		} else {
			const btn = new MessageButton().setLabel(label).setStyle(style);
			if (label === '\u200b') {
				btn.setDisabled();
				btn.setCustomId(getRandomID(10));
			} else {
				btn.setCustomId('cal' + label);
			}
			return btn;
		}
	},
}
