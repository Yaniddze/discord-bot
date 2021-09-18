import 'dotenv/config.js';
import { Client, Intents } from 'discord.js';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS],
});

client.config = {
	id: process.env.BOTID,
	token: process.env.BOTTOKEN,
};

client.login(client.config.token);
