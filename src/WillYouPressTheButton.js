const axios = require('axios');
const Discord = require('discord.js');
const functions = require('../functions/function');

module.exports = async (options) => {
	functions.checkForUpdates();
	if (!options.message) throw new Error('Sudo Error: message argument was not specified.');
	if (typeof options.message !== 'object') throw new TypeError('Sudo Error: Invalid Discord Message was provided.');

	if (!options.embed) options.embed = {};
	if (typeof options.embed !== 'object') throw new TypeError('Sudo Error: embed must be an object.');

	if (!options.embed.title) options.embed.title = 'Will you press the button? | Sudo Development';
	if (typeof options.embed.title !== 'string') throw new TypeError('Sudo Error: embed title must be a string.');

	if (!options.embed.description) options.embed.description = '```{{statement1}}```\n**but**\n\n```{{statement2}}```';
	if (typeof options.embed.description !== 'string') throw new TypeError('Sudo Error: embed description must be a string.');

	if (!options.embed.color) options.embed.color = functions.randomHexColor();
	if (typeof options.embed.color !== 'string') throw new TypeError('Sudo Error: embed color must be a string.');

	if (!options.embed.footer) options.embed.footer = '©️ Sudo Development';
	if (typeof options.embed.footer !== 'string') throw new TypeError('Sudo Error: embed footer must be a string.');

	if (!options.embed.timestamp) options.embed.timestamp = true;
	if (typeof options.embed.timestamp !== 'boolean') throw new TypeError('Sudo Error: timestamp must be a boolean.');

	if (!options.button) options.button = {};
	if (typeof options.embed !== 'object') throw new TypeError('Sudo Error: buttons must be an object.');

	if (!options.button.yes) options.button.yes = 'Yes';
	if (typeof options.button.yes !== 'string') throw new TypeError('Sudo Error: yesLabel must be a string.');

	if (!options.button.no) options.button.no = 'No';
	if (typeof options.button.no !== 'string') throw new TypeError('Sudo Error: noLabel must be a string.');

	if (!options.thinkMessage) options.thinkMessage = 'I am thinking';
	if (typeof options.thinkMessage !== 'string') throw new TypeError('Sudo Error: thinkMessage must be a boolean.');

	if (!options.othersMessage) options.othersMessage = 'Only <@{{author}}> can use the buttons!';
	if (typeof options.othersMessage !== 'string') throw new TypeError('Sudo Error: othersMessage must be a string.');

	if (!options.apiKey) throw new Error('Sudo Error: apiKey must be specified. \nVisit https://api.sujalgoel.engineer/ to get yourself one.',);
	if (typeof options.apiKey !== 'string') throw new TypeError('Sudo Error: apiKey must be a string.');

	const id1 = functions.getRandomID();
	const id2 = functions.getRandomID();

	const think = await options.message.reply({
		embeds: [
			new Discord.MessageEmbed()
				.setTitle(`${options.thinkMessage}.`)
				.setColor(options.embed.color),
		],
	});

	await think.edit({
		embeds: [
			new Discord.MessageEmbed()
				.setTitle(`${options.thinkMessage}..`)
				.setColor(options.embed.color),
		],
	});

	const { data } = await axios({
		url: 'https://api.sujalgoel.engineer/fun/wyptb',
		headers: {
			Authorization: `Sujal ${options.apiKey}`,
		},
		responseType: 'json',
	});

	await think.edit({
		embeds: [
			new Discord.MessageEmbed()
				.setTitle(`${options.thinkMessage}...`)
				.setColor(options.embed.color),
		],
	});

	const res = {
		questions: [data.data.txt1, data.data.txt2],
		percentage: {
			1: data.data.yes,
			2: data.data.no,
		},
	};

	await think.edit({
		embeds: [
			new Discord.MessageEmbed()
				.setTitle(`${options.thinkMessage}..`)
				.setColor(options.embed.color),
		],
	});

	const btn1 = new Discord.MessageButton()
		.setStyle('SUCCESS')
		.setLabel(options.button.yes)
		.setCustomId(id1);
	const btn2 = new Discord.MessageButton()
		.setStyle('DANGER')
		.setLabel(options.button.no)
		.setCustomId(id2);

	await think.edit({
		embeds: [
			new Discord.MessageEmbed()
				.setTitle(`${options.thinkMessage}.`)
				.setColor(options.embed.color),
		],
	});

	const embed = new Discord.MessageEmbed()
		.setTitle(options.embed.title)
		.setDescription(
			`${options.embed.description
				.replace(
					'{{statement1}}',
					res.questions[0].charAt(0).toUpperCase() + res.questions[0].slice(1),
				)
				.replace(
					'{{statement2}}',
					res.questions[1].charAt(0).toUpperCase() + res.questions[1].slice(1),
				)}`,
		)
		.setColor(options.embed.color)
		.setFooter(options.embed.footer);
	if (options.embed.timestamp) {
		embed.setTimestamp();
	}

	await think.edit({
		embeds: [embed],
		components: [{ type: 1, components: [btn1, btn2] }],
	});

	const gameCollector = think.createMessageComponentCollector({
		filter: (fn) => fn,
	});

	gameCollector.on('collect', async (wyptb) => {
		if (wyptb.user.id !== options.message.author.id) {
			return wyptb.reply({
				content: options.othersMessage.replace(
					'{{author}}',
					options.message.member.id,
				),
				ephemeral: true,
			});
		}

		await wyptb.deferUpdate();

		if (wyptb.customId === id1) {
			btn1.setDisabled();
			btn2.setDisabled();
			gameCollector.stop();
			await wyptb.editReply({
				embed: embed,
				components: [{ type: 1, components: [btn1, btn2] }],
			});
		} else if (wyptb.customId === id2) {
			btn1.setDisabled();
			btn2.setDisabled();
			gameCollector.stop();
			await wyptb.editReply({
				embed: embed,
				components: [{ type: 1, components: [btn1, btn2] }],
			});
		}
	});
};
