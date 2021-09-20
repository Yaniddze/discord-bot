import 'dotenv/config.js';
import { Client, Intents, Collection } from 'discord.js';

import { connectingCommands, connectingEvents } from './handler/index.js';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.config = {
	id: process.env.BOTID,
	token: process.env.BOTTOKEN,
};

client.commands = new Collection();

connectingCommands(client);
connectingEvents(client);

client.login(client.config.token);
