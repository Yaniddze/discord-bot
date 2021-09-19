import 'dotenv/config.js';
import { Client, Intents } from 'discord.js';

import { connectingEvents } from './handler/index.js';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.config = {
	id: process.env.BOTID,
	token: process.env.BOTTOKEN,
};

connectingEvents(client);

client.login(client.config.token);
