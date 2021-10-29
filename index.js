const { Client, Intents, ApplicationCommand, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const fs = require('fs');
const {default: axios} = require("axios");
const client = new Client({ intents: [Intents.FLAGS.GUILD_MEMBERS] });

const commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandArray = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
    commandArray.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commandArray },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    client.user.setActivity('for stat updates.', { type: 'WATCHING' });
});

client.login(config.token).then(() => {
    console.log('StatBot successfully connected!');
}).catch(() => {
    console.log('StatBot failed to connect!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    interaction = Object.assign(interaction, ApplicationCommand);
    if (interaction.commandName === 'rlstats' || interaction.commandName === 'rlranks') {
        const platform = interaction.options.getString('platform');
        const username = interaction.options.getString('username');

        let notFound = false;
        let json;
        await axios.get('https://api.tracker.gg/api/v2/rocket-league/standard/profile/' + platform + '/' + username + '/', {
            headers: {
                'TRN-Api-Key': config.trnApiKey
            }
        }).then(function (response) {
            json = response.data;
        }).catch(function () {
            notFound = true;
        });

        if (notFound) {
            await interaction.reply('Unable to find player: `' + username + '`');
            return;
        }

        await commands.get(interaction.commandName).execute(interaction, json, username);
    }

    if (interaction.commandName === 'valrank') {
        const region = interaction.options.getString('region');
        const username = interaction.options.getString('username').split("#")[0];
        const tag = interaction.options.getString('username').split("#")[1];

        let notFound = false;
        let json;
        await axios.get('https://api.henrikdev.xyz/valorant/v2/mmr/' + region + '/' + username + '/' + tag)
            .then(function (response) {
                json = response.data;
            })
            .catch(function () {
                notFound = true;
            });

        if (notFound) {
            await interaction.reply('Unable to find player: `' + username + '`');
            return;
        }

        await commands.get(interaction.commandName).execute(interaction, json, username);
    }
});
