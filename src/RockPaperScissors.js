const Discord = require('discord.js');
const functions = require('../functions/function');

module.exports = async (options) => {
	functions.checkForUpdates();
	if (!options.message) throw new Error('Sudo Error: message argument was not specified.');
	if (typeof options.message !== 'object') throw new TypeError('Sudo Error: Invalid Discord Message was provided.');

	if (!options.opponent) throw new Error('Sudo Error: opponent argument was not specified.');
	if (typeof options.opponent !== 'object') throw new TypeError('Sudo Error: Invalid Discord User was provided.');

	if (!options.embed) options.embed = {};
	if (typeof options.embed !== 'object') throw new TypeError('Sudo Error: embed must be an object.');

	if (!options.embed.title) options.embed.title = 'Rock Paper Scissors | Sudo Development';
	if (typeof options.embed.title !== 'string') throw new TypeError('Sudo Error: embed title must be a string.');

	if (!options.embed.description) options.embed.description = 'Press the button below to choose your element.';
	if (typeof options.embed.description !== 'string') throw new TypeError('Sudo Error: embed description must be a string.');

	if (!options.embed.color) options.embed.color = functions.randomHexColor();
	if (typeof options.embed.color !== 'string') throw new TypeError('Sudo Error: embed color must be a string.');

	if (!options.embed.footer) options.embed.footer = '©️ Sudo Development';
	if (typeof options.embed.footer !== 'string') throw new TypeError('Sudo Error: embed footer must be a string.');

	if (!options.embed.timestamp) options.embed.timestamp = true;
	if (typeof options.embed.timestamp !== 'boolean') throw new TypeError('Sudo Error: setTimestamp must be a boolean.');

	if (!options.buttons) options.buttons = {};
	if (typeof options.buttons !== 'object') throw new TypeError('Sudo Error: buttons must be an object.');

	if (!options.buttons.rock) options.buttons.rock = 'Rock';
	if (typeof options.buttons.rock !== 'string') throw new Error('Sudo Error: rock button text must be a string.');

	if (!options.buttons.paper) options.buttons.paper = 'Paper';
	if (typeof options.buttons.paper !== 'string') throw new Error('Sudo Error: paper button text must be a string.');

	if (!options.buttons.scissors) options.buttons.scissors = 'Scissors';
	if (typeof options.buttons.scissors !== 'string') throw new Error('Sudo Error: scissors button text must be a string.');

	if (!options.buttons.accept) options.buttons.accept = 'Accept';
	if (typeof options.buttons.accept !== 'string') throw new Error('Sudo Error: accept button text must be a string.');

	if (!options.buttons.deny) options.buttons.deny = 'Deny';
	if (typeof options.buttons.deny !== 'string') throw new Error('Sudo Error: deny button text must be a string.');

	if (!options.time) options.time = 60000;
	if (parseInt(options.time) < 10000) throw new Error('Sudo Error: time argument must be greater than 10 Seconds (in ms i.e. 10000).');

	if (typeof options.time !== 'number') throw new TypeError('Sudo Error: time must be a number.');

	if (!options.acceptMessage) options.acceptMessage = '<@{{challenger}}> has challenged <@{{opponent}}> for a game of Rock Paper and Scissors!';
	if (typeof options.acceptMessage !== 'string') throw new Error('Sudo Error: acceptMessage must be a string.');

	if (!options.winMessage) options.winMessage = 'GG, <@{{winner}}> won!';
	if (typeof options.winMessage !== 'string') throw new TypeError('Sudo Error: winMessage must be a string.');

	if (!options.drawMessage) options.drawMessage = 'This game is deadlock!';
	if (typeof options.drawMessage !== 'string') throw new TypeError('Sudo Error: drawMessage must be a string.');

	if (!options.endMessage) options.endMessage = '<@{{opponent}}> didn\'t answer in time. So, I dropped the game!';
	if (typeof options.endMessage !== 'string') throw new TypeError('Sudo Error: endMessage must be a string.');

	if (!options.timeEndMessage) options.timeEndMessage = 'Both of you didn\'t pick something in time. So, I dropped the game!';
	if (typeof options.timeEndMessage !== 'string') throw new TypeError('Sudo Error: timeEndMessage must be a string.');

	if (!options.cancelMessage) options.cancelMessage = '<@{{opponent}}> refused to have a game of Rock Paper and Scissors with you!';
	if (typeof options.cancelMessage !== 'string') throw new TypeError('Sudo Error: cancelMessage must be a string.');

	if (!options.choseMessage) options.choseMessage = 'You picked {{emoji}}';
	if (typeof options.choseMessage !== 'string') throw new TypeError('Sudo Error: choseMessage must be a string.');

	if (!options.noChangeMessage) options.noChangeMessage = 'You cannot change your selection!';
	if (typeof options.noChangeMessage !== 'string') throw new TypeError('Sudo Error: noChangeMessage must be a string.');

	if (!options.othersMessage) options.othersMessage = 'Only {{author}} can use the buttons!';
	if (typeof options.othersMessage !== 'string') throw new TypeError('Sudo Error: othersMessage must be a string.');

	const id1 = functions.getRandomID();
	const id2 = functions.getRandomID();
	const id3 = functions.getRandomID();

	if (options.opponent.bot ||options.opponent.id === options.message.author.id) return;

	const acceptbutton = new Discord.MessageButton().setStyle('SUCCESS')	.setLabel(options.buttons.accept).setCustomId('accept');
	const denybutton = new Discord.MessageButton().setStyle('DANGER').setLabel(options.buttons.deny).setCustomId('deny');

	const embed = new Discord.MessageEmbed()
		.setTitle(options.embed.title)
		.setDescription(
			options.acceptMessage
				.replace('{{challenger}}', options.message.author.id)
				.replace('{{opponent}}', options.opponent.id),
		)
		.setFooter(options.embed.footer)
		.setColor(options.embed.color);
	if (options.embed.timestamp) embed.setTimestamp();

	const question = await options.message.reply({
		embeds: [embed],
		components: [{ type: 1, components: [acceptbutton, denybutton] }],
	});

	const Collector = await question.createMessageComponentCollector({
		filter: (fn) => fn,
		time: options.time,
	});

	Collector.on('collect', async (_btn) => {
		if (_btn.member.id !== options.opponent.id) {
			return _btn.reply({
				content: options.othersMessage.replace(
					'{{author}}',
					`<@${options.opponent.id}>`,
				),
				ephemeral: true,
			});
		}
		await _btn.deferUpdate();
		if (_btn.customId === 'deny') {
			denybutton.setDisabled();
			acceptbutton.setDisabled();
			const emd = new Discord.MessageEmbed()
				.setTitle(options.embed.title)
				.setDescription(
					options.cancelMessage.replace('{{opponent}}', options.opponent.id),
				)
				.setFooter(options.embed.footer)
				.setColor(options.embed.color);
			if (options.embed.timestamp) emd.setTimestamp();

			Collector.stop();
			return question.edit({
				embeds: [emd],
				components: [{ type: 1, components: [acceptbutton, denybutton] }],
			});
		} else if (_btn.customId === 'accept') {
			Collector.stop();
			const scissorsbtn = new Discord.MessageButton().setCustomId(id1).setLabel(options.buttons.scissors).setStyle('PRIMARY').setEmoji('✌️');
			const rockbtn = new Discord.MessageButton().setCustomId(id2).setLabel(options.buttons.rock).setStyle('PRIMARY').setEmoji('✊');
			const paperbtn = new Discord.MessageButton().setCustomId(id3).setLabel(options.buttons.paper).setStyle('PRIMARY').setEmoji('✋');
			let row = new Discord.MessageActionRow().addComponents(rockbtn).addComponents(paperbtn).addComponents(scissorsbtn);

	        const emd = new Discord.MessageEmbed()
				.setTitle(options.embed.title)
				.setDescription(options.embed.description)
				.setFooter(options.embed.footer)
				.setColor(options.embed.color);
			if (options.embed.timestamp) emd.setTimestamp();

			question.edit({
				embeds: [emd],
				components: [row],
			});
			let opponentChose;
			let opponentChoice;
			let challengerChose;
			let challengerChoice;
			const collector = question.createMessageComponentCollector({
				filter: (fn) => fn,
				time: options.time,
			});
			collector.on('collect', async (button) => {
				if (
					button.member.id !== options.opponent.id &&
					button.member.id !== options.message.author.id
				) {
					return button.reply({
						content: options.othersMessage.replace(
							'{{author}}',
							`<@${options.message.author.id}> and <@${options.opponent.id}>`,
						),
						ephemeral: true,
					});
				}
				if (button.member.id === options.message.author.id) {
					challengerChose = true;
					if (typeof challengerChoice !== 'undefined') {
						return button.reply({
							content: options.noChangeMessage,
							ephemeral: true,
						});
					}
					if (button.customId === id2) {
						challengerChoice = '✊';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✊'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
								);
							} else {
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
								);
							}
							rockbtn.setDisabled();
							paperbtn.setDisabled();
							scissorsbtn.setDisabled();
							row = new Discord.MessageActionRow()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new Discord.MessageEmbed()
								.setTitle(options.embed.title)
								.setColor(options.embed.color)
								.setDescription(result)
								.addFields(
									{
										name: options.message.author.username,
										value: challengerChoice,
										inline: true,
									},
									{
										name: options.opponent.username,
										value: opponentChoice,
										inline: true,
									},
								)
								.setFooter(options.embed.footer);
							if (options.embed.timestamp) _embed.setTimestamp();

							collector.stop();
							return question.edit({
								embeds: [_embed],
								components: [row],
							});
						}
					} else if (button.customId === id3) {
						challengerChoice = '✋';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✋'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
								);
							} else {
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
								);
							}
							rockbtn.setDisabled();
							paperbtn.setDisabled();
							scissorsbtn.setDisabled();
							row = new Discord.MessageActionRow()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new Discord.MessageEmbed()
								.setTitle(options.embed.title)
								.setColor(options.embed.color)
								.setDescription(result)
								.addFields(
									{
										name: options.message.author.username,
										value: challengerChoice,
										inline: true,
									},
									{
										name: options.opponent.username,
										value: opponentChoice,
										inline: true,
									},
								)
								.setFooter(options.embed.footer);
							if (options.embed.timestamp) _embed.setTimestamp();
							collector.stop();
							return question.edit({
								embeds: [_embed],
								components: [row],
							});
						}
					} else if (button.customId === id1) {
						challengerChoice = '✌️';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✌️'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
								);
							} else {
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
								);
							}
							rockbtn.setDisabled();
							paperbtn.setDisabled();
							scissorsbtn.setDisabled();
							row = new Discord.MessageActionRow().addComponents(rockbtn).addComponents(paperbtn).addComponents(scissorsbtn);
							const _embed = new Discord.MessageEmbed()
								.setTitle(options.embed.title)
								.setColor(options.embed.color)
								.setDescription(result)
								.addFields(
									{
										name: options.message.author.username,
										value: challengerChoice,
										inline: true,
									},
									{
										name: options.opponent.username,
										value: opponentChoice,
										inline: true,
									},
								)
								.setFooter(options.embed.footer);
							if (options.embed.timestamp) {
								_embed.setTimestamp();
							}
							collector.stop();
							return question.edit({
								embeds: [_embed],
								components: [row],
							});
						}
					}
				} else if (button.member.id === options.opponent.id) {
					opponentChose = true;
					if (typeof opponentChoice !== 'undefined') {
						return button.reply({
							content: options.noChangeMessage,
							ephemeral: true,
						});
					}
					if (button.customId === id2) {
						opponentChoice = '✊';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✊'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
								);
							} else {
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
								);
							}
							rockbtn.setDisabled();
							paperbtn.setDisabled();
							scissorsbtn.setDisabled();
							row = new Discord.MessageActionRow()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new Discord.MessageEmbed()
								.setTitle(options.embed.title)
								.setColor(options.embed.color)
								.setDescription(result)
								.addFields(
									{
										name: options.message.author.username,
										value: challengerChoice,
										inline: true,
									},
									{
										name: options.opponent.username,
										value: opponentChoice,
										inline: true,
									},
								)
								.setFooter(options.embed.footer);
							if (options.embed.timestamp) {
								_embed.setTimestamp();
							}
							collector.stop();
							return question.edit({
								embeds: [_embed],
								components: [row],
							});
						}
					} else if (button.customId === id3) {
						opponentChoice = '✋';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✋'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
								);
							} else {
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
								);
							}
							rockbtn.setDisabled();
							paperbtn.setDisabled();
							scissorsbtn.setDisabled();
							row = new Discord.MessageActionRow()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new Discord.MessageEmbed()
								.setTitle(options.embed.title)
								.setColor(options.embed.color)
								.setDescription(result)
								.addFields(
									{
										name: options.message.author.username,
										value: challengerChoice,
										inline: true,
									},
									{
										name: options.opponent.username,
										value: opponentChoice,
										inline: true,
									},
								)
								.setFooter(options.embed.footer);
							if (options.embed.timestamp) {
								_embed.setTimestamp();
							}
							collector.stop();
							return question.edit({
								embeds: [_embed],
								components: [row],
							});
						}
					} else if (button.customId === id1) {
						opponentChoice = '✌️';
						button.reply({
							content: options.choseMessage.replace('{{emoji}}', '✌️'),
							ephemeral: true,
						});
						if (challengerChose && opponentChose === true) {
							let result;
							if (challengerChoice === opponentChoice) {
								result = options.drawMessage;
							} else if (
								(opponentChoice === '✌️' && challengerChoice === '✋') ||
								(opponentChoice === '✊' && challengerChoice === '✌️') ||
								(opponentChoice === '✋' && challengerChoice === '✊')
							) {
								result = options.winMessage.replace(
									'{{winner}}',
									options.opponent.id,
								);
							} else {
								result = options.winMessage.replace(
									'{{winner}}',
									options.message.author.id,
								);
							}
							rockbtn.setDisabled();
							paperbtn.setDisabled();
							scissorsbtn.setDisabled();
							row = new Discord.MessageActionRow()
								.addComponents(rockbtn)
								.addComponents(paperbtn)
								.addComponents(scissorsbtn);
							const _embed = new Discord.MessageEmbed()
								.setTitle(options.embed.title)
								.setColor(options.embed.color)
								.setDescription(result)
								.addFields(
									{
										name: options.message.author.username,
										value: challengerChoice,
										inline: true,
									},
									{
										name: options.opponent.username,
										value: opponentChoice,
										inline: true,
									},
								)
								.setFooter(options.embed.footer);
							if (options.embed.timestamp) {
								_embed.setTimestamp();
							}
							collector.stop();
							return question.edit({
								embeds: [_embed],
								components: [row],
							});
						}
					}
				}
			});
			collector.on('end', async (collected, reason) => {
				if (reason === 'time') {
					rockbtn.setDisabled();
					paperbtn.setDisabled();
					scissorsbtn.setDisabled();
					row = new Discord.MessageActionRow()
						.addComponents(rockbtn)
						.addComponents(paperbtn)
						.addComponents(scissorsbtn);
					const _embed = new Discord.MessageEmbed()
						.setTitle(options.embed.title)
						.setDescription(options.timeEndMessage)
						.setFooter(options.embed.footer)
						.setColor(options.embed.color);
					if (options.embed.timestamp) {
						_embed.setTimestamp();
					}
					return question.edit({
						embeds: [_embed],
						components: [row],
					});
				}
			});
		}
	});

	Collector.on('end', async (_msg, reason) => {
		if (reason === 'time') {
			denybutton.setDisabled();
			acceptbutton.setDisabled();
			const _embed = new Discord.MessageEmbed()
				.setTitle(options.embed.title)
				.setDescription(
					options.endMessage.replace('{{opponent}}', options.opponent.id),
				)
				.setFooter(options.embed.footer)
				.setColor(options.embed.color);
			if (options.embed.timestamp) {
				_embed.setTimestamp();
			}
			return question.edit({
				embeds: [_embed],
				components: [{ type: 1, components: [acceptbutton, denybutton] }],
			});
		}
	});
};
