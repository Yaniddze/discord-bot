import 'dotenv/config.js';
import { Client, Intents } from 'discord.js';

import { connectingEvents } from './handler/index.js';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS],
});

client.config = {
	id: process.env.BOTID,
	token: process.env.BOTTOKEN,
};

connectingEvents(client);

client.login(client.config.token);
