const Discord = require('discord.js');
const functions = require('../functions/function');

module.exports = async (options) => {
	functions.checkForUpdates();
	if (!options.message) {
		throw new Error('Sudo Error: message argument was not specified.');
	}
	if (typeof options.message !== 'object') {
		throw new TypeError('Sudo Error: Invalid Discord Message was provided.');
	}

	if (!options.embed) options.embed = {};
	if (typeof options.embed !== 'object') {
		throw new TypeError('Sudo Error: embed must be an object.');
	}

	if (!options.embed.title) {
		options.embed.title = 'Chaos Words | Sudo Development';
	}
	if (typeof options.embed.title !== 'string') {
		throw new TypeError('Sudo Error: embed title must be a string.');
	}

	if (!options.embed.description) {
		options.embed.description =
			'You have **{{time}}** to find the hidden words in the below sentence.';
	}
	if (typeof options.embed.description !== 'string') {
		throw new TypeError('Sudo Error: embed color must be a string.');
	}

	if (!options.embed.field1) options.embed.field1 = 'Sentence:';
	if (typeof options.embed.field1 !== 'string') {
		throw new TypeError('Sudo Error: field1 must be a string.');
	}

	if (!options.embed.field2) {
		options.embed.field2 = 'Words Found/Remaining Words:';
	}
	if (typeof options.embed.field2 !== 'string') {
		throw new TypeError('Sudo Error: field2 must be a string.');
	}

	if (!options.embed.field3) options.embed.field3 = 'Words found:';
	if (typeof options.embed.field3 !== 'string') {
		throw new TypeError('Sudo Error: field3 must be a string.');
	}

	if (!options.embed.field4) options.embed.field4 = 'Words:';
	if (typeof options.embed.field4 !== 'string') {
		throw new TypeError('Sudo Error: field4 must be a string.');
	}

	if (!options.embed.color) options.embed.color = functions.randomHexColor();
	if (typeof options.embed.color !== 'string') {
		throw new TypeError('Sudo Error: embed color must be a string.');
	}

	if (!options.embed.footer) {
		options.embed.footer = '©️ Sudo Development';
	}
	if (typeof options.embed.footer !== 'string') {
		throw new TypeError('Sudo Error: embed footer must be a string.');
	}

	if (!options.embed.timestamp) options.embed.timestamp = true;
	if (typeof options.embed.timestamp !== 'boolean') {
		throw new TypeError('Sudo Error: timestamp must be a boolean.');
	}

	if (!options.winMessage) {
		options.winMessage = 'GG, You won! You made it in **{{time}}**.';
	}
	if (typeof options.winMessage !== 'string') {
		throw new TypeError('Sudo Error: winMessage must be a string.');
	}

	if (!options.loseMessage) options.loseMessage = 'Better luck next time!';
	if (typeof options.loseMessage !== 'string') {
		throw new TypeError('Sudo Error: loseMessage must be a string.');
	}

	if (!options.wrongWordMessage) {
		options.wrongWordMessage =
			'Wrong Guess! You have **{{remaining_tries}}** tries left.';
	}
	if (typeof options.wrongWordMessage !== 'string') {
		throw new TypeError('Sudo Error: wrongWordMessage must be a string.');
	}

	if (!options.correctWordMessage) {
		options.correctWordMessage =
			'GG, **{{word}}** was correct! You have to find **{{remaining}}** more word(s).';
	}
	if (typeof options.correctWordMessage !== 'string') {
		throw new TypeError('Sudo Error: correctWordMessage must be a string.');
	}

	if (!options.time) options.time = 60000;
	if (parseInt(options.time) < 10000) {
		throw new Error(
			'Sudo Error: time argument must be greater than 10 Seconds (in ms i.e. 10000).',
		);
	}
	if (typeof options.time !== 'number') {
		throw new TypeError('Sudo Error: time must be a number.');
	}

	if (!options.words) {
		options.words = functions.getRandomSentence(
			Math.floor(Math.random() * 6) + 2,
		);
	}
	if (typeof options.words !== 'object') {
		throw new TypeError('Sudo Error: words must be an array.');
	}

	if (!options.charGenerated) {
		options.charGenerated = options.words.join('').length - 1;
	}
	if (typeof options.charGenerated !== 'number') {
		throw new TypeError('Sudo Error: charGenerated must be a number.');
	}

	if (!options.maxTries) options.maxTries = 10;
	if (typeof options.maxTries !== 'number') {
		throw new TypeError('Sudo Error: maxTries must be a number.');
	}

	if (!options.othersMessage) {
		options.othersMessage = 'Only <@{{author}}> can use the buttons!';
	}
	if (typeof options.othersMessage !== 'string') {
		throw new TypeError('Sudo Error: othersMessage must be a string.');
	}

	if (!options.buttonText) options.buttonText = 'Cancel';
	if (typeof options.buttonText !== 'string') {
		throw new TypeError('Sudo Error: buttonText must be a string.');
	}

	if (options.message instanceof Discord.Interaction && !options.message.deferred) {
		await options.message.deferReply();
	}

	const authorId =
		options.message instanceof Discord.Interaction
			? options.message.user.id
			: options.message.author.id;

	const id = functions.getRandomID(20);

	let tries = 0;
	const array = [];
	let remaining = 0;
	const guessed = [];

	if (options.words.join('').length > options.charGenerated) {
		options.charGenerated = options.words.join('').length - 1;
	}

	for (let i = 0; i < options.charGenerated; i++) {
		array.push(
			'abcdefghijklmnopqrstuvwxyz'.charAt(
				Math.floor(Math.random() * 'abcdefghijklmnopqrstuvwxyz'.length),
			),
		);
	}

	options.words.forEach((e) => {
		array.splice(Math.floor(Math.random() * array.length), 0, e);
	});

	const embed = new Discord.MessageEmbed()
		.setTitle(options.embed.title)
		.setDescription(
			options.embed.description.replace(
				'{{time}}',
				functions.convertTime(options.time),
			),
		)
		.addField(options.embed.field1, array.join(''))
		.addField(options.embed.field2, `0/${options.words.length}`)
		.setFooter(options.embed.footer)
		.setColor(options.embed.color);
	if (options.embed.timestamp) {
		embed.setTimestamp();
	}

	let btn1 = new Discord.MessageButton()
		.setStyle('DANGER')
		.setLabel(options.buttonText)
		.setCustomId(id);

	const mes =
		options.message instanceof Discord.Interaction
			? await options.message.editReply({
				embeds: [embed],
				components: [{ type: 1, components: [btn1] }],
			})
			: await options.message.reply({
				embeds: [embed],
				components: [{ type: 1, components: [btn1] }],
			});

	const gameCreatedAt = Date.now();
	const game = await options.message.channel.createMessageCollector({
		filter: (m) => m.author.id === authorId,
		time: options.time,
	});

	game.on('collect', async (msg) => {
		const condition =
			options.words.includes(msg.content.toLowerCase()) &&
			!guessed.includes(msg.content.toLowerCase());
		if (condition) {
			remaining++;
			guessed.push(msg.content.toLowerCase());
			array.splice(array.indexOf(msg.content.toLowerCase()), 1);
			const _embed = new Discord.MessageEmbed()
				.setTitle(options.embed.title)
				.setDescription(
					options.embed.description.replace(
						'{{time}}',
						functions.convertTime(options.time),
					),
				)
				.addField(options.embed.field1, array.join(''))
				.addField(options.embed.field3, `${guessed.join(', ')}`)
				.addField(options.embed.field2, `${remaining}/${options.words.length}`)
				.setFooter(options.embed.footer)
				.setColor(options.embed.color);
			if (options.embed.timestamp) {
				_embed.setTimestamp();
			}

			btn1 = new Discord.MessageButton()
				.setStyle('DANGER')
				.setLabel(options.buttonText)
				.setCustomId(id);

			if (remaining === options.words.length) {
				btn1.setDisabled();
				const time = functions.convertTime(Date.now() - gameCreatedAt);
				const __embed = new Discord.MessageEmbed()
					.setTitle(options.embed.title)
					.addField(options.embed.field1, array.join(''))
					.setDescription(options.winMessage.replace('{{time}}', time))
					.addField(options.embed.field4, `${options.words.join(', ')}`)
					.setFooter(options.embed.footer)
					.setColor(options.embed.color);
				if (options.embed.timestamp) {
					__embed.setTimestamp();
				}

				mes instanceof Discord.Interaction
					? await mes.editReply({
						embeds: [__embed],
						components: [{ type: 1, components: [btn1] }],
					})
					: await mes.edit({
						embeds: [__embed],
						components: [{ type: 1, components: [btn1] }],
					});

				msg.reply({
					embeds: [__embed],
				});

				return game.stop();
			}

			mes instanceof Discord.Interaction
				? await mes.editReply({
					embeds: [_embed],
					components: [{ type: 1, components: [btn1] }],
				})
				: await mes.edit({
					embeds: [_embed],
					components: [{ type: 1, components: [btn1] }],
				});

			const __embed = new Discord.MessageEmbed()
				.setDescription(
					`${options.correctWordMessage
						.replace('{{word}}', msg.content.toLowerCase())
						.replace('{{remaining}}', options.words.length - remaining)}`,
				)
				.setColor(options.embed.color)
				.setFooter(options.embed.footer);

			if (options.embed.timestamp) {
				__embed.setTimestamp();
			}

			msg.reply({
				embeds: [__embed],
			});

		} else {
			tries++;
			if (tries === options.maxTries) {
				const _embed = new Discord.MessageEmbed()
					.setTitle(options.embed.title)
					.setDescription(options.loseMessage)
					.addField(options.embed.field1, array.join(''))
					.addField(options.embed.field4, `${options.words.join(', ')}`)
					.setFooter(options.embed.footer)
					.setColor(options.embed.color);
				if (options.embed.timestamp) {
					_embed.setTimestamp();
				}

				btn1.setDisabled();

				mes instanceof Discord.Interaction
					? await mes.editReply({
						embeds: [_embed],
						components: [{ type: 1, components: [btn1] }],
					})
					: await mes.edit({
						embeds: [_embed],
						components: [{ type: 1, components: [btn1] }],
					});

				msg.reply({
					embeds: [_embed],
				});

				return game.stop();
			}

			const _embed = new Discord.MessageEmbed()
				.setDescription(
					`${options.wrongWordMessage.replace(
						'{{remaining_tries}}',
						`${options.maxTries - tries}`,
					)}`,
				)
				.setColor(options.embed.color)
				.setFooter(options.embed.footer);
			if (options.embed.timestamp) {
				_embed.setTimestamp();
			}

			msg.reply({
				embeds: [_embed],
			});
		}
	});

	game.on('end', async (msg, reason) => {
		if (reason === 'time') {
			const _embed = new Discord.MessageEmbed()
				.setTitle(options.embed.title)
				.setDescription(options.loseMessage)
				.addField(options.embed.field1, array.join(''))
				.addField(options.embed.field4, `${options.words.join(', ')}`)
				.setFooter(options.embed.footer)
				.setColor(options.embed.color);
			if (options.embed.timestamp) {
				_embed.setTimestamp();
			}

			btn1.setDisabled();

			mes instanceof Discord.Interaction
				? await mes.editReply({
					embeds: [_embed],
					components: [{ type: 1, components: [btn1] }],
				})
				: await mes.edit({
					embeds: [_embed],
					components: [{ type: 1, components: [btn1] }],
				});

			options.message instanceof Discord.Interaction
				? options.message.followUp({
					embeds: [_embed],
				})
				: options.message.reply({
					embeds: [_embed],
				});
		}
	});

	const gameCollector = mes.createMessageComponentCollector({
		filter: (fn) => fn,
	});

	gameCollector.on('collect', async (button) => {
		if (button.user.id !== authorId) {
			return button.reply({
				content: options.othersMessage.replace(
					'{{author}}',
					authorId,
				),
				ephemeral: true,
			});
		}

		await button.deferUpdate();

		btn1.setDisabled();

		const _embed = new Discord.MessageEmbed()
			.setTitle(options.embed.title)
			.setDescription(options.loseMessage)
			.addField(options.embed.field1, array.join(''))
			.addField(options.embed.field4, `${options.words.join(', ')}`)
			.setFooter(options.embed.footer)
			.setColor(options.embed.color);
		if (options.embed.timestamp) {
			_embed.setTimestamp();
		}

		mes instanceof Discord.Interaction
			? await mes.editReply({
				embeds: [_embed],
				components: [{ type: 1, components: [btn1] }],
			})
			: await mes.edit({
				embeds: [_embed],
				components: [{ type: 1, components: [btn1] }],
			});

		gameCollector.stop();
		return game.stop();
	});
};
