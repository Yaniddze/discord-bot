import 'dotenv/config.js';
import { Client, Intents, Collection } from 'discord.js';

import { connectingInteraction, connectingEvents } from './handler/index.js';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.config = {
	token: process.env.BOTTOKEN,
	guildId: process.env.GUILDID,
	mainRoleId: process.env.MAINROLEID,
	mainColor: '',
};

client.emoji = {
	statusError: '⚠️',
	usageSuccessful: '✅',
	usageError: '⛔',
	usageQuestion: '❓',
};

client.guildChannels = new Collection();
client.guildUserChannels = new Collection();

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenu = new Collection();

connectingInteraction(client, 'commands', 'name');
connectingInteraction(client, 'buttons');
connectingInteraction(client, 'selectMenu');
connectingEvents(client);

client.login(client.config.token);
