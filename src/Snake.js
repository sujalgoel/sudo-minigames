const Discord = require('discord.js');
const functions = require('../functions/function');

module.exports = async (options) => {
	functions.checkForUpdates();
	if (!options.message) throw new Error('Sudo Error: message argument was not specified.');
	if (typeof options.message !== 'object') throw new TypeError('Sudo Error: Invalid Discord Message was provided.');

	if (!options.embed) options.embed = {};
	if (typeof options.embed !== 'object') throw new TypeError('Sudo Error: embed must be an object.');

	if (!options.embed.title) options.embed.title = 'Snake | Sudo Development';
	if (typeof options.embed.title !== 'string') throw new TypeError('Sudo Error: title must be a string.');

	if (!options.embed.description) options.embed.description = 'GG, you scored **{{score}}** points!';
	if (typeof options.embed.description !== 'string') throw new TypeError('Sudo Error: description must be a string.');

	if (!options.embed.color) options.embed.color = functions.randomHexColor();
	if (typeof options.embed.color !== 'string') throw new TypeError('Sudo Error: color must be a string.');

	if (!options.embed.footer) options.embed.footer = '©️ Sudo Development';
	if (typeof options.embed.footer !== 'string') throw new TypeError('Sudo Error: embed footer must be a string.');

	if (!options.embed.timestamp) options.embed.timestamp = true;
	if (typeof options.embed.timestamp !== 'boolean') throw new TypeError('Sudo Error: timestamp must be a boolean.');

	if (!options.emojis) options.emojis = {};
	if (typeof options.emojis !== 'object') throw new TypeError('Sudo Error: emojis must be an object.');

	if (!options.emojis.empty) options.emojis.empty = '⬛';
	if (typeof options.emojis.empty !== 'string') throw new TypeError('Sudo Error: empty emoji must be an emoji.');

	if (!options.emojis.snakeBody) options.emojis.snakeBody = '🟩';
	if (typeof options.emojis.snakeBody !== 'string') throw new TypeError('Sudo Error: snakeBody emoji must be an emoji.');

	if (!options.emojis.snakeHead) options.emojis.snakeHead = '🟨';
	if (typeof options.emojis.snakeHead !== 'string') throw new TypeError('Sudo Error: snakeHead emoji must be an emoji.');

	if (!options.emojis.snakeTail) options.emojis.snakeTail = '🟧';
	if (typeof options.emojis.snakeTail !== 'string') throw new TypeError('Sudo Error: snakeTail emoji must be an emoji.');

	if (!options.emojis.food) options.emojis.food = '🍎';
	if (typeof options.emojis.food !== 'string') throw new TypeError('Sudo Error: food emoji must be an emoji.');

	if (!options.emojis.up) options.emojis.up = '⬆️';
	if (typeof options.emojis.up !== 'string') throw new TypeError('Sudo Error: up emoji must be an emoji.');

	if (!options.emojis.right) options.emojis.right = '⬅️';
	if (typeof options.emojis.right !== 'string') throw new TypeError('Sudo Error: right emoji must be an emoji.');

	if (!options.emojis.down) options.emojis.down = '⬇️';
	if (typeof options.emojis.down !== 'string') throw new TypeError('Sudo Error: down emoji must be an emoji.');

	if (!options.emojis.left) options.emojis.left = '➡️';
	if (typeof options.emojis.left !== 'string') throw new TypeError('Sudo Error: left emoji must be an emoji.');

	if (!options.othersMessage) options.othersMessage = 'Only <@{{author}}> can use the buttons!';
	if (typeof options.othersMessage !== 'string') throw new TypeError('Sudo Error: othersMessage must be a string.');

	if (!options.buttonText) options.buttonText = 'Cancel';
	if (typeof options.buttonText !== 'string') throw new TypeError('Sudo Error: buttonText must be a string.');

	const id1 = functions.getRandomID();
	const id2 = functions.getRandomID();
	const id3 = functions.getRandomID();
	const id4 = functions.getRandomID();
	const id5 = functions.getRandomID();
	const id6 = functions.getRandomID();
	const id7 = functions.getRandomID();

	let score = 0;
	const width = 15;
	const height = 10;
	const gameBoard = [];
	let inGame = false;
	let snakeLength = 1;
	const apple = { x: 0, y: 0 };
	let snake = [{ x: 0, y: 0 }];
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			gameBoard[y * width + x] = options.emojis.empty;
		}
	}

	function gameBoardToString() {
		let str = '';
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (x == apple.x && y == apple.y) {
					str += options.emojis.food;
					continue;
				}
				let flag = true;
				for (let s = 0; s < snake.length; s++) {
					if (x == snake[s].x && y == snake[s].y) {
						if (s == 0) {
							str += options.emojis.snakeHead;
						} else if (s == snake.length - 1) {
							str += options.emojis.snakeTail;
						} else {
							str += options.emojis.snakeBody;
						}
						flag = false;
					}
				}
				if (flag) {
					str += gameBoard[y * width + x];
				}
			}
			str += '\n';
		}
		return str;
	}

	function isLocInSnake(pos) {
		return snake.find((sPos) => sPos.x == pos.x && sPos.y == pos.y);
	}

	function newappleLoc() {
		let newapplePos = {
			x: 0,
			y: 0,
		};
		do {
			newapplePos = {
				x: parseInt(Math.random() * width),
				y: parseInt(Math.random() * height),
			};
		} while (isLocInSnake(newapplePos));
		apple.x = newapplePos.x;
		apple.y = newapplePos.y;
	}

	function step(msg) {
		if (apple.x == snake[0].x && apple.y == snake[0].y) {
			score += 1;
			snakeLength++;
			newappleLoc();
		}

		const editEmbed = new Discord.MessageEmbed()
			.setColor(options.embed.color)
			.setTitle(options.embed.title)
			.setFooter(options.embed.footer)
			.setDescription(gameBoardToString());
		if (options.embed.timestamp) editEmbed.setTimestamp();
		lock1.setDisabled();
		lock2.setDisabled();
		w = new Discord.MessageButton().setEmoji(options.emojis.up).setStyle('PRIMARY').setCustomId(id2);
		a = new Discord.MessageButton().setEmoji(options.emojis.right).setStyle('PRIMARY').setCustomId(id3);
		s = new Discord.MessageButton().setEmoji(options.emojis.down).setStyle('PRIMARY').setCustomId(id4);
		d = new Discord.MessageButton().setEmoji(options.emojis.left).setStyle('PRIMARY').setCustomId(id5);
		stopy = new Discord.MessageButton().setLabel(options.buttonText).setStyle('DANGER').setCustomId(id6);

		msg.edit({
			embeds: [editEmbed],
			components: [
				{
					type: 1,
					components: [lock1, w, lock2, stopy],
				},
				{
					type: 1,
					components: [a, s, d],
				},
			],
		});
	}

	function gameOver(m) {
		w.setDisabled();
		a.setDisabled();
		s.setDisabled();
		d.setDisabled();
		stopy.setDisabled();
		lock1.setDisabled();
		lock2.setDisabled();
		inGame = false;

		const editEmbed = new Discord.MessageEmbed()
			.setColor(options.embed.color)
			.setTitle(options.embed.title)
			.setFooter(options.embed.footer)
			.setDescription(options.embed.description.replace('{{score}}', score));
		if (options.embed.timestamp) {
			editEmbed.setTimestamp();
		}

		m.edit({
			embeds: [editEmbed],
			components: [
				{
					type: 1,
					components: [lock1, w, lock2, stopy],
				},
				{
					type: 1,
					components: [a, s, d],
				},
			],
		});
	}

	if (inGame) return;
	inGame = true;
	score = 0;
	snakeLength = 1;
	snake = [{ x: 5, y: 5 }];
	newappleLoc();
	const embed = new Discord.MessageEmbed()
		.setColor(options.embed.color)
		.setTitle(options.embed.title)
		.setFooter(options.embed.footer)
		.setDescription(gameBoardToString());
	if (options.embed.timestamp) embed.setTimestamp();

	const lock1 = new Discord.MessageButton().setLabel('\u200b').setStyle('SECONDARY').setCustomId(id1).setDisabled();
	let w = new Discord.MessageButton().setEmoji(options.emojis.up).setStyle('PRIMARY').setCustomId(id2);
	const lock2 = new Discord.MessageButton().setLabel('\u200b').setStyle('SECONDARY').setCustomId(id7).setDisabled();
	let a = new Discord.MessageButton().setEmoji(options.emojis.right).setStyle('PRIMARY').setCustomId(id3);
	let s = new Discord.MessageButton().setEmoji(options.emojis.down).setStyle('PRIMARY').setCustomId(id4);
	let d = new Discord.MessageButton().setEmoji(options.emojis.left).setStyle('PRIMARY').setCustomId(id5);
	let stopy = new Discord.MessageButton().setLabel(options.buttonText).setStyle('DANGER').setCustomId(id6);

	const m = await options.message.reply({
		embeds: [embed],
		components: [
			{
				type: 1,
				components: [lock1, w, lock2, stopy],
			},
			{
				type: 1,
				components: [a, s, d],
			},
		],
	});

	const collector = m.createMessageComponentCollector({filter: (fn) => fn});

	collector.on('collect', async (btn) => {
		if (btn.user.id !== options.message.author.id) {
			return btn.reply({
				content: options.othersMessage.replace(
					'{{author}}',
					options.message.member.id,
				),
				ephemeral: true,
			});
		}
		await btn.deferUpdate();

		const snakeHead = snake[0];
		const nextPos = {
			x: snakeHead.x,
			y: snakeHead.y,
		};

		if (btn.customId === id3) {
			let nextX = snakeHead.x - 1;
			if (nextX < 0) {
				nextX = width - 1;
			}
			nextPos.x = nextX;
		} else if (btn.customId === id2) {
			let nextY = snakeHead.y - 1;
			if (nextY < 0) {
				nextY = height - 1;
			}
			nextPos.y = nextY;
		} else if (btn.customId === id4) {
			let nextY = snakeHead.y + 1;
			if (nextY >= height) {
				nextY = 0;
			}
			nextPos.y = nextY;
		} else if (btn.customId === id5) {
			let nextX = snakeHead.x + 1;
			if (nextX >= width) {
				nextX = 0;
			}
			nextPos.x = nextX;
		} else if (btn.customId === id6) {
			gameOver(m);
			collector.stop();
		}

		if (isLocInSnake(nextPos)) {
			gameOver(m);
			collector.stop();
		} else {
			snake.unshift(nextPos);
			if (snake.length > snakeLength) {
				snake.pop();
			}
			step(m);
		}
	});
};
