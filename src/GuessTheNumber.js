const currentGames = new Object();
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
		options.embed.title = 'Guess The Number | Sudo Development';
	}
	if (typeof options.embed.title !== 'string') {
		throw new TypeError('Sudo Error: embed title must be a string.');
	}

	if (!options.embed.description) {
		options.embed.description = 'You have **{{time}}** to guess the number.';
	}
	if (typeof options.embed.description !== 'string') {
		throw new TypeError('Sudo Error: embed color must be a string.');
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

	if (!options.publicGame) options.publicGame = false;
	if (typeof options.publicGame !== 'boolean') {
		throw new TypeError('Sudo Error: publicGame must be a boolean.');
	}

	if (!options.number) options.number = Math.floor(Math.random() * 1000);
	if (typeof options.number !== 'number') {
		throw new TypeError('Sudo Error: number must be a number.');
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

	if (!options.winMessage) options.winMessage = {};
	if (typeof options.winMessage !== 'object') {
		throw new TypeError('Sudo Error: winMessage must be an object.');
	}

	if (!options.winMessage.publicGame) {
		options.winMessage.publicGame =
			'GG, The number which I guessed was **{{number}}**. <@{{winner}}> made it in **{{time}}**.\n\n__**Stats of the game:**__\n**Duration**: {{time}}\n**Number of participants**: {{totalparticipants}} Participants\n**Participants**: {{participants}}';
	}
	if (typeof options.winMessage.publicGame !== 'string') {
		throw new TypeError('Sudo Error: winMessage must be a string.');
	}

	if (!options.winMessage.privateGame) {
		options.winMessage.privateGame =
			'GG, The number which I guessed was **{{number}}**. You made it in **{{time}}**.';
	}
	if (typeof options.winMessage.privateGame !== 'string') {
		throw new TypeError('Sudo Error: winMessage must be a string.');
	}

	if (!options.loseMessage) {
		options.loseMessage =
			'Better luck next time! The number which I guessed was **{{number}}**.';
	}
	if (typeof options.loseMessage !== 'string') {
		throw new TypeError('Sudo Error: loseMessage must be a string.');
	}

	if (!options.bigNumberMessage) {
		options.bigNumberMessage =
			'No {{author}}! My number is greater than **{{number}}**.';
	}
	if (typeof options.bigNumberMessage !== 'string') {
		throw new TypeError('Sudo Error: bigNumberMessage must be a string.');
	}

	if (!options.smallNumberMessage) {
		options.smallNumberMessage =
			'No {{author}}! My number is smaller than **{{number}}**.';
	}
	if (typeof options.smallNumberMessage !== 'string') {
		throw new TypeError('Sudo Error: smallNumberMessage must be a string.');
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

	const id = functions.getRandomID(20);

	if (options.publicGame) {
		if (!options.ongoingMessage) {
			options.ongoingMessage =
				'A game is already runnning in <#{{channel}}>. You can\'t start a new one!';
		}
		if (typeof options.ongoingMessage !== 'string') {
			throw new TypeError('Sudo Error: ongoingMessage must be a string.');
		}

		const participants = [];
		if (currentGames[options.message.guild.id]) {
			const embed = new Discord.MessageEmbed()
				.setDescription(
					options.ongoingMessage.replace(
						/{{channel}}/g,
						currentGames[`${options.message.guild.id}_channel`],
					),
				)
				.setFooter(options.embed.footer)
				.setColor(options.embed.color);
			if (options.embed.timestamp) {
				embed.setTimestamp();
			}
			return options.message.reply({ embeds: [embed] });
		}

		const embed = new Discord.MessageEmbed()
			.setDescription(
				`${options.embed.description.replace(
					/{{time}}/g,
					functions.convertTime(options.time),
				)}`,
			)
			.setTitle(options.embed.title)
			.setFooter(options.embed.footer)
			.setColor(options.embed.color);

		if (options.embed.timestamp) {
			embed.setTimestamp();
		}

		const btn1 = new Discord.MessageButton()
			.setStyle('DANGER')
			.setLabel(options.buttonText)
			.setCustomId(id);
		const msg = await options.message.reply({
			embeds: [embed],
			components: [{ type: 1, components: [btn1] }],
		});

		const gameCreatedAt = Date.now();

		const collector = await options.message.channel.createMessageCollector({
			filter: (fn) => !fn.author.bot,
			time: options.time,
		});

		const gameCollector = msg.createMessageComponentCollector({
			filter: (fn) => fn,
		});

		currentGames[options.message.guild.id] = true;
		currentGames[`${options.message.guild.id}_channel`] = options.message.channel.id;

		collector.on('collect', async (_msg) => {
			if (!participants.includes(_msg.author.id)) {
				participants.push(_msg.author.id);
			}
			// if (isNaN(_msg.content)) {
			// 	return;
			// }
			const parsedNumber = parseInt(_msg.content);
			if (parsedNumber === options.number) {
				const time = functions.convertTime(Date.now() - gameCreatedAt);
				const _embed = new Discord.MessageEmbed()
					.setDescription(
						`${options.winMessage.publicGame
							.replace(/{{number}}/g, options.number)
							.replace(/{{winner}}/g, _msg.author.id)
							.replace(/{{time}}/g, time)
							.replace(/{{totalparticipants}}/g, participants.length)
							.replace(
								/{{participants}}/g,
								participants.map((p) => '<@' + p + '>').join(', '),
							)}`,
					)
					.setTitle(options.embed.title)
					.setFooter(options.embed.footer)
					.setColor(options.embed.color);
				if (options.embed.timestamp) {
					_embed.setTimestamp();
				}
				btn1.setDisabled();
				await msg.edit({
					embeds: [embed],
					components: [{ type: 1, components: [btn1] }],
				});
				_msg.reply({ embeds: [_embed] });
				gameCollector.stop();
				collector.stop();
			}
			if (parseInt(_msg.content) < options.number) {
				const _embed = new Discord.MessageEmbed()
					.setDescription(
						options.bigNumberMessage
							.replace(/{{author}}/g, _msg.author.toString())
							.replace(/{{number}}/g, parsedNumber),
					)
					.setColor(options.embed.color);
				_msg.reply({ embeds: [_embed] });
			}
			if (parseInt(_msg.content) > options.number) {
				const _embed = new Discord.MessageEmbed()
					.setDescription(
						options.smallNumberMessage
							.replace(/{{author}}/g, _msg.author.toString())
							.replace(/{{number}}/g, parsedNumber),
					)
					.setColor(options.embed.color);
				_msg.reply({ embeds: [_embed] });
			}
		});

		gameCollector.on('collect', async (button) => {
			if (button.user.id !== options.message.author.id) {
				return button.reply({
					content: options.othersMessage.replace(
						/{{author}}/g,
						options.message.member.id,
					),
					ephemeral: true,
				});
			}

			await button.deferUpdate();

			if (button.customId === id) {
				btn1.setDisabled();
				gameCollector.stop();
				collector.stop();
				msg.edit({
					embeds: [embed],
					components: [{ type: 1, components: [btn1] }],
				});
				const _embed = new Discord.MessageEmbed()
					.setTitle(options.embed.title)
					.setDescription(
						options.loseMessage.replace(/{{number}}/g, options.number),
					)
					.setColor(options.embed.color)
					.setFooter(options.embed.footer);
				if (options.embed.timestamp) {
					_embed.setTimestamp();
				}
				options.message.reply({
					embeds: [_embed],
				});
			}
		});
		collector.on('end', async (_collected, reason) => {
			delete currentGames[options.message.guild.id];
			if (reason === 'time') {
				const _embed = new Discord.MessageEmbed()
					.setTitle(options.embed.title)
					.setDescription(
						options.loseMessage.replace(/{{number}}/g, options.number),
					)
					.setColor(options.embed.color)
					.setFooter(options.embed.footer);
				if (options.embed.timestamp) {
					_embed.setTimestamp();
				}
				btn1.setDisabled();
				await msg.edit({
					embeds: [embed],
					components: [{ type: 1, components: [btn1] }],
				});
				return options.message.reply({ embeds: [_embed] });
			}
		});
	} else {
		const embed = new Discord.MessageEmbed()
			.setDescription(
				`${options.embed.description.replace(
					/{{time}}/g,
					functions.convertTime(options.time),
				)}`,
			)
			.setTitle(options.embed.title)
			.setFooter(options.embed.footer)
			.setColor(options.embed.color);
		if (options.embed.timestamp) {
			embed.setTimestamp();
		}
		const btn1 = new Discord.MessageButton()
			.setStyle('DANGER')
			.setLabel(options.buttonText)
			.setCustomId(id);
		const msg = await options.message.reply({
			embeds: [embed],
			components: [{ type: 1, components: [btn1] }],
		});
		const gameCreatedAt = Date.now();

		const collector = await options.message.channel.createMessageCollector({
			filter: (m) => m.author.id === options.message.author.id,
			time: options.time,
		});

		const gameCollector = msg.createMessageComponentCollector({
			filter: (fn) => fn,
		});

		collector.on('collect', async (_msg) => {
			if (_msg.author.id !== options.message.author.id) return;
			// if (isNaN(_msg.content)) {
			// 	return;
			// }
			const parsedNumber = parseInt(_msg.content, 10);
			if (parsedNumber === options.number) {
				const time = functions.convertTime(Date.now() - gameCreatedAt);
				const _embed = new Discord.MessageEmbed()
					.setDescription(
						`${options.winMessage.privateGame
							.replace(/{{time}}/g, time)
							.replace(/{{number}}/g, options.number)}`,
					)
					.setTitle(options.embed.title)
					.setFooter(options.embed.footer)
					.setColor(options.embed.color);
				if (options.embed.timestamp) {
					_embed.setTimestamp();
				}
				btn1.setDisabled();
				await msg.edit({
					embeds: [embed],
					components: [{ type: 1, components: [btn1] }],
				});
				_msg.reply({ embeds: [_embed] });
				gameCollector.stop();
				collector.stop();
			}
			if (parseInt(_msg.content) < options.number) {
				const _embed = new Discord.MessageEmbed()
					.setDescription(
						options.bigNumberMessage
							.replace(/{{author}}/g, _msg.author.toString())
							.replace(/{{number}}/g, parsedNumber),
					)
					.setColor(options.embed.color);
				_msg.reply({ embeds: [_embed] });
			}
			if (parseInt(_msg.content) > options.number) {
				const _embed = new Discord.MessageEmbed()
					.setDescription(
						options.smallNumberMessage
							.replace(/{{author}}/g, _msg.author.toString())
							.replace(/{{number}}/g, parsedNumber),
					)
					.setColor(options.embed.color);
				_msg.reply({ embeds: [_embed] });
			}
		});

		gameCollector.on('collect', async (button) => {
			if (button.user.id !== options.message.author.id) {
				return button.reply({
					content: options.othersMessage.replace(
						/{{author}}/g,
						options.message.member.id,
					),
					ephemeral: true,
				});
			}

			await button.deferUpdate();

			if (button.customId === id) {
				btn1.setDisabled();
				gameCollector.stop();
				collector.stop();
				msg.edit({
					embeds: [embed],
					components: [{ type: 1, components: [btn1] }],
				});
				const _embed = new Discord.MessageEmbed()
					.setTitle(options.embed.title)
					.setDescription(
						options.loseMessage.replace(/{{number}}/g, options.number),
					)
					.setColor(options.embed.color)
					.setFooter(options.embed.footer);
				if (options.embed.timestamp) {
					_embed.setTimestamp();
				}
				options.message.reply({
					embeds: [_embed],
				});
			}
		});
		collector.on('end', async (_collected, reason) => {
			if (reason === 'time') {
				const _embed = new Discord.MessageEmbed()
					.setTitle(options.embed.title)
					.setDescription(
						options.loseMessage.replace(/{{number}}/g, options.number),
					)
					.setColor(options.embed.color)
					.setFooter(options.embed.footer);
				if (options.embed.timestamp) {
					_embed.setTimestamp();
				}
				btn1.setDisabled();
				await msg.edit({
					embeds: [embed],
					components: [{ type: 1, components: [btn1] }],
				});
				return options.message.reply({ embeds: [_embed] });
			}
		});
	}
};
