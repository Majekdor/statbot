const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'valrank',
    data: new SlashCommandBuilder()
        .setName('valrank')
        .setDescription('Get a player\'s Valorant rank.')
        .addStringOption(option =>
            option.setName("username")
                .setDescription("Your in-game username with tag. Format: Username#Tag")
                .setRequired(true)
        ).addStringOption(option =>
                option.setName('region')
                    .setDescription('The region you play Valorant in.')
                    .setRequired(true)
                    .addChoice('North America', 'na')
                    .addChoice('Europe', 'eu')
                    .addChoice('Asia', 'ap')
                    .addChoice('Korea', 'kr')
        ),
    async execute(interaction, json, username) {
        const embed = new MessageEmbed()
            .setTitle(username + '\'s current rank is ' + getRank(json))
            .setColor(14433611)
            .setAuthor('Valorant', 'https://images.hdqwalls.com/download/valorant-game-logo-4k-wi-2048x2048.jpg');

        await interaction.reply({embeds: [embed]});
    }
}

function getRank(json) {
    return json['data']['current_data']['currenttierpatched'];
}
