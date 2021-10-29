const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'rlstats',
    data: new SlashCommandBuilder()
        .setName('rlstats')
        .setDescription('Get a player\'s Rocket League stats.')
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform you play Rocket League on.')
                .setRequired(true)
                .addChoice('Epic Games', 'epic')
                .addChoice('Steam', 'steam')
                .addChoice('Xbox', 'xbl')
                .addChoice('PlayStation', 'psn')
        ).addStringOption(option =>
            option.setName("username")
                .setDescription("Your in-game username.")
                .setRequired(true)
        ),
    async execute(interaction, json, username) {
        const embed = new MessageEmbed()
            .setTitle(username + '\'s stats:')
            .setColor(3766509)
            .setAuthor('Rocket League', 'https://github.com/Majekdor/statbot/blob/master/img/rocketleague.png?raw=true')
            .addField('Wins', getStat(json, 'wins'), true)
            .addField('Goals', getStat(json, 'goals'), true)
            .addField('MVPs', getStat(json, 'mVPs'), true)
            .addField('Saves', getStat(json, 'saves'), true)
            .addField('Assists', getStat(json, 'assists'), true)
            .addField('Shots', getStat(json, 'shots'), true);

        await interaction.reply({embeds: [embed]});
    }
}

function getStat(json, statName) {
    return json['data']['segments'][0]['stats'][statName]['displayValue'];
}
