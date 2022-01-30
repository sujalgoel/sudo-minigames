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

	if (!options.member) options.member = options.message.member;
	if (typeof options.member !== 'object') {
		throw new TypeError(
			'Sudo Error: Invalid Discord GuildMember was provided.',
		);
	}

	if (!options.text) {
		throw new Error('Sudo Error: text argument was not specified.');
	}
	if (typeof options.text !== 'string') {
		throw new TypeError('Sudo Error: text must be a string.');
	}

	if (options.message instanceof Discord.CommandInteraction) {
		if (!options.message.deferred) {
			await options.message.deferReply();
		}
		options.deleteMessage = true;
	}

	if (!options.deleteMessage) options.deleteMessage = false;
	if (typeof options.deleteMessage !== 'boolean') {
		throw new TypeError('Sudo Error: deleteMessage must be a boolean.');
	}

	const webhooks = await options.message.channel.fetchWebhooks();
	const webhook = webhooks.first();
	if (!webhook) {
		options.message.channel
			.createWebhook(options.member.user.username, {
				avatar: options.member.user.displayAvatarURL(),
			})
			.then(async (_webhook) => {
				await _webhook.send(Discord.Util.removeMentions(options.text));
				if (options.deleteMessage) {
					options.message instanceof Discord.Interaction
						? options.message.deleteReply()
						: options.message.delete();
				}
			});
	} else {
		await webhook.send({
			content: Discord.Util.removeMentions(options.text),
			username: options.member.user.username,
			avatarURL: options.member.user.displayAvatarURL(),
		});
		if (options.deleteMessage) {
			options.message instanceof Discord.Interaction
				? options.message.deleteReply()
				: options.message.delete();
		}
	}
};
