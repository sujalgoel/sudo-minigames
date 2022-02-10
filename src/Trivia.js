const axios = require('axios');
const Discord = require('discord.js');
const difficulties = ['hard', 'medium', 'easy'];
const functions = require('../functions/function');

module.exports = async (options) => {
	functions.checkForUpdates();
	if (!options.message) throw new Error('Sudo Error: message argument was not specified.');
	if (typeof options.message !== 'object') throw new TypeError('Sudo Error: Invalid Discord Message was provided.');

	if (!options.embed) options.embed = {};
	if (typeof options.embed !== 'object') throw new TypeError('Sudo Error: embed must be an object.');

	if (!options.embed.title) options.embed.title = 'Trivia | Sudo Development';
	if (typeof options.embed.title !== 'string') throw new TypeError('Sudo Error: embed title must be a string.');

	if (!options.embed.description) options.embed.description = 'You only have **{{time}}** to guess the answer!';
	if (typeof options.embed.description !== 'string') throw new TypeError('Sudo Error: embed title must be a string.');

	if (!options.embed.color) options.embed.color = functions.randomHexColor();
	if (typeof options.embed.color !== 'string') throw new TypeError('Sudo Error: embed color must be a string.');

	if (!options.embed.footer) options.embed.footer = '©️ Sudo Development';
	if (typeof options.embed.footer !== 'string') throw new TypeError('Sudo Error: embed footer must be a string.');

	if (!options.embed.timestamp) options.embed.timestamp = true;
	if (typeof options.embed.timestamp !== 'boolean') throw new TypeError('Sudo Error: timestamp must be a boolean.');

	if (!options.difficulty || !difficulties.includes(options.difficulty)) options.difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
	if (typeof options.difficulty !== 'string') throw new TypeError('Sudo Error: difficulty must be a string.');

	if (!options.thinkMessage) options.thinkMessage = 'I am thinking';
	if (typeof options.thinkMessage !== 'string') throw new TypeError('Sudo Error: thinkMessage must be a boolean.');

	if (!options.winMessage) options.winMessage = 'GG, It was **{{answer}}**. You gave the correct answer in **{{time}}**.';
	if (typeof options.winMessage !== 'string') throw new TypeError('Sudo Error: winMessage must be a boolean.');

	if (!options.loseMessage) options.loseMessage = 'Better luck next time! The correct answer was **{{answer}}**.';
	if (typeof options.loseMessage !== 'string') throw new TypeError('Sudo Error: loseMessage must be a boolean.');

	if (!options.emojis) options.emojis = {};
	if (typeof options.emojis !== 'object') throw new TypeError('Sudo Error: emojis must be an object.');

	if (!options.emojis.one) options.emojis.one = '1️⃣';
	if (typeof options.emojis.one !== 'string') throw new TypeError('Sudo Error: emoji one must be an emoji.');

	if (!options.emojis.two) options.emojis.two = '2️⃣';
	if (typeof options.emojis.two !== 'string') throw new TypeError('Sudo Error: emoji two must be an emoji.');

	if (!options.emojis.three) options.emojis.three = '3️⃣';
	if (typeof options.emojis.three !== 'string') throw new TypeError('Sudo Error: emoji three must be an emoji.');

	if (!options.emojis.four) options.emojis.four = '4️⃣';
	if (typeof options.emojis.four !== 'string') throw new TypeError('Sudo Error: emoji four must be an emoji.');

	if (!options.time) options.time = 60000;
	if (parseInt(options.time) < 10000) throw new Error('Sudo Error: time argument must be greater than 10 Seconds (in ms i.e. 10000).',);

	if (typeof options.time !== 'number') throw new TypeError('Sudo Error: time must be a number.');

	if (!options.othersMessage) options.othersMessage = 'Only <@{{author}}> can use the buttons!';
	if (typeof options.othersMessage !== 'string') throw new TypeError('Sudo Error: othersMessage must be a string.');

	if (!options.apiKey) throw new Error('Sudo Error: apiKey must be specified. \nVisit https://api.sujalgoel.engineer/ to get yourself one.',);
	if (typeof options.apiKey !== 'string') throw new TypeError('Sudo Error: apiKey must be a string.');

	const id1 = functions.getRandomID();
	const id2 = functions.getRandomID();
	const id3 = functions.getRandomID();
	const id4 = functions.getRandomID();
	const think = await options.message.reply({
		embeds: [
			new Discord.MessageEmbed()
				.setTitle(`${options.thinkMessage}.`)
				.setColor(options.embed.color),
		],
	});

	const question = {};

	await think.edit({
		embeds: [
			new Discord.MessageEmbed()
				.setTitle(`${options.thinkMessage}..`)
				.setColor(options.embed.color),
		],
	});

	await think.edit({
		embeds: [
			new Discord.MessageEmbed()
				.setTitle(`${options.thinkMessage}...`)
				.setColor(options.embed.color),
		],
	});

	const { data } = await axios({
		url: `https://api.sujalgoel.engineer/fun/trivia?difficulty=${options.difficulty}`,
		headers: {
			Authorization: `Sujal ${options.apiKey}`,
		},
		responseType: 'json',
	});

	question.correct = data.data.index;
	question.options = data.data.options;
	question.question = data.data.question;
	question.difficulty = data.data.difficulty;

	await think.edit({embeds: [new Discord.MessageEmbed().setTitle(`${options.thinkMessage}..`).setColor(options.embed.color),],});

	let winningID;

	if (question.correct === 0) {winningID = id1;
	} else if (question.correct === 1) {winningID = id2;
	} else if (question.correct === 2) {winningID = id3;
	} else if (question.correct === 3) {winningID = id4;
	}

	const btn1 = new Discord.MessageButton().setStyle('PRIMARY').setEmoji(options.emojis.one).setCustomId(id1);

	const btn2 = new Discord.MessageButton().setStyle('PRIMARY').setEmoji(options.emojis.two).setCustomId(id2);

	const btn3 = new Discord.MessageButton().setStyle('PRIMARY').setEmoji(options.emojis.three).setCustomId(id3);

	const btn4 = new Discord.MessageButton().setStyle('PRIMARY').setEmoji(options.emojis.four).setCustomId(id4);

	await think.edit({embeds: [new Discord.MessageEmbed().setTitle(`${options.thinkMessage}.`).setColor(options.embed.color),],});

	let opt = '';

	for (let i = 0; i < question.options.length; i++) {opt += `**${i + 1})** ${question.options[i]}\n`;}

	const embed = new Discord.MessageEmbed()
		.setTitle(options.embed.title)
		.addField(
			question.question,
			`${options.embed.description.replace(
				'{{time}}',
				functions.convertTime(options.time),
			)}\n\n${opt}`,
		)
		.setColor(options.embed.color)
		.setFooter(options.embed.footer);
	if (options.embed.timestamp) embed.setTimestamp();

	await think.edit({
		embeds: [embed],
		components: [{ type: 1, components: [btn1, btn2, btn3, btn4] }],
	});

	const gameCreatedAt = Date.now();
	const gameCollector = think.createMessageComponentCollector({filter: (fn) => fn,time: options.time,});

	gameCollector.on('collect', async (trivia) => {
		if (trivia.user.id !== options.message.author.id) {
			return trivia.reply({
				content: options.othersMessage.replace(
					'{{author}}',
					options.message.member.id,
				),
				ephemeral: true,
			});
		}
		await trivia.deferUpdate();
		if (trivia.customId === winningID) {
			btn1.setDisabled();
			btn2.setDisabled();
			btn3.setDisabled();
			btn4.setDisabled();
			gameCollector.stop();
			if (winningID === id1) {
				btn1.setStyle('SUCCESS');
				btn2.setStyle('DANGER');
				btn3.setStyle('DANGER');
				btn4.setStyle('DANGER');
			} else if (winningID === id2) {
				btn1.setStyle('DANGER');
				btn2.setStyle('SUCCESS');
				btn3.setStyle('DANGER');
				btn4.setStyle('DANGER');
			} else if (winningID === id3) {
				btn1.setStyle('DANGER');
				btn2.setStyle('DANGER');
				btn3.setStyle('SUCCESS');
				btn4.setStyle('DANGER');
			} else if (winningID === id4) {
				btn1.setStyle('DANGER');
				btn2.setStyle('DANGER');
				btn3.setStyle('DANGER');
				btn4.setStyle('SUCCESS');
			}
			think.edit({
				embeds: [embed],
				components: [{ type: 1, components: [btn1, btn2, btn3, btn4] }],
			});
			const time = functions.convertTime(Date.now() - gameCreatedAt);
			const winEmbed = new Discord.MessageEmbed()
				.setDescription(
					`${options.winMessage
						.replace('{{answer}}', question.options[question.correct])
						.replace('{{time}}', time)}`,
				)
				.setColor(options.embed.color)
				.setFooter(options.embed.footer);
			if (options.embed.timestamp) winEmbed.setTimestamp();

			options.message.reply({ embeds: [winEmbed] });
		} else {
			btn1.setDisabled();
			btn2.setDisabled();
			btn3.setDisabled();
			btn4.setDisabled();

			gameCollector.stop();
			if (winningID === id1) {
				btn1.setStyle('SUCCESS');
				if (trivia.customId === id2) {
					btn2.setStyle('DANGER');
					btn3.setStyle('SECONDARY');
					btn4.setStyle('SECONDARY');
				} else if (trivia.customId === id3) {
					btn2.setStyle('SECONDARY');
					btn3.setStyle('DANGER');
					btn4.setStyle('SECONDARY');
				} else if (trivia.customId === id4) {
					btn2.setStyle('SECONDARY');
					btn3.setStyle('SECONDARY');
					btn4.setStyle('DANGER');
				}
			} else if (winningID === id2) {
				btn2.setStyle('SUCCESS');
				if (trivia.customId === id1) {
					btn1.setStyle('DANGER');
					btn3.setStyle('SECONDARY');
					btn4.setStyle('SECONDARY');
				} else if (trivia.customId === id3) {
					btn1.setStyle('SECONDARY');
					btn3.setStyle('DANGER');
					btn4.setStyle('SECONDARY');
				} else if (trivia.customId === id4) {
					btn1.setStyle('SECONDARY');
					btn3.setStyle('SECONDARY');
					btn4.setStyle('DANGER');
				}
			} else if (winningID === id3) {
				btn3.setStyle('SUCCESS');
				if (trivia.customId === id1) {
					btn1.setStyle('DANGER');
					btn2.setStyle('SECONDARY');
					btn4.setStyle('SECONDARY');
				} else if (trivia.customId === id2) {
					btn1.setStyle('SECONDARY');
					btn2.setStyle('DANGER');
					btn4.setStyle('SECONDARY');
				} else if (trivia.customId === id4) {
					btn1.setStyle('SECONDARY');
					btn2.setStyle('SECONDARY');
					btn4.setStyle('DANGER');
				}
			} else if (winningID === id4) {
				btn4.setStyle('SUCCESS');
				if (trivia.customId === id1) {
					btn1.setStyle('DANGER');
					btn2.setStyle('SECONDARY');
					btn3.setStyle('SECONDARY');
				} else if (trivia.customId === id2) {
					btn1.setStyle('SECONDARY');
					btn2.setStyle('DANGER');
					btn3.setStyle('SECONDARY');
				} else if (trivia.customId === id3) {
					btn1.setStyle('SECONDARY');
					btn2.setStyle('SECONDARY');
					btn3.setStyle('DANGER');
				}
			}
			think.edit({
				embeds: [embed],
				components: [{ type: 1, components: [btn1, btn2, btn3, btn4] }],
			});
			const lostEmbed = new Discord.MessageEmbed()
				.setDescription(
					`${options.loseMessage.replace(
						'{{answer}}',
						question.options[question.correct],
					)}`,
				)
				.setColor(options.embed.color)
				.setFooter(options.embed.footer);
			if (options.embed.timestamp) {
				lostEmbed.setTimestamp();
			}
			options.message.reply({ embeds: [lostEmbed] });
		}
	});

	gameCollector.on('end', (trivia, reason) => {
		if (reason === 'time') {
			btn1.setDisabled();
			btn2.setDisabled();
			btn3.setDisabled();
			btn4.setDisabled();
			if (winningID === id1) {
				btn1.setStyle('SUCCESS');
				btn2.setStyle('SECONDARY');
				btn3.setStyle('SECONDARY');
				btn4.setStyle('SECONDARY');
			} else if (winningID === id2) {
				btn1.setStyle('SECONDARY');
				btn2.setStyle('SUCCESS');
				btn3.setStyle('SECONDARY');
				btn4.setStyle('SECONDARY');
			} else if (winningID === id3) {
				btn1.setStyle('SECONDARY');
				btn2.setStyle('SECONDARY');
				btn3.setStyle('SUCCESS');
				btn4.setStyle('SECONDARY');
			} else if (winningID === id4) {
				btn1.setStyle('SECONDARY');
				btn2.setStyle('SECONDARY');
				btn3.setStyle('SECONDARY');
				btn4.setStyle('SUCCESS');
			}
			think.edit({
				embeds: [embed],
				components: [{ type: 1, components: [btn1, btn2, btn3, btn4] }],
			});
			const lostEmbed = new Discord.MessageEmbed()
				.setDescription(
					`${options.loseMessage.replace(
						'{{answer}}',
						question.options[question.correct],
					)}`,
				)
				.setColor(options.embed.color)
				.setFooter(options.embed.footer);
			if (options.embed.timestamp) {
				lostEmbed.setTimestamp();
			}
			options.message.reply({ embeds: [lostEmbed] });
		}
	});
};
