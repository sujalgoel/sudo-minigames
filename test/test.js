const { Client, Intents } = require('discord.js');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});
const { ChaosWords } = require('sudo-minigames');

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
	if (message.content === '!t') {
		await ChaosWords({
			message: message,
			embed: {
				title: 'Calculator | Sudo Development',
				color: '#5865F2',
				footer: '©️ Sudo Development',
				timestamp: true,
			},
			disabledQuery: 'Calculator is disabled!',
			invalidQuery: 'The provided equation is invalid!',
			othersMessage: 'Only <@{{author}}> can use the buttons!',
		});
	}
});

client.login('NzY0ODIwNjE3NzI3MzExOTAz.X4L0tA.kQ8OqxtX48vleXX_Ib2-MzI77Wg');
