const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const ranks = require("../rlranks.json")

module.exports = {
    name: 'rlranks',
    data: new SlashCommandBuilder()
        .setName('rlranks')
        .setDescription('Get a player\'s Rocket League ranks.')
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
            .setTitle(username + '\'s current ranks:')
            .setColor(3766509)
            .setAuthor('Rocket League', 'https://github.com/Majekdor/statbot/blob/master/img/rocketleague.png?raw=true');

        let noRanks = true;
        if (getRank(json, 10, false) != null) {
            embed.addField('Ranked Duel 1v1', getEmoji(json, 10) + " "
                + getRank(json, 10, true), false);
            noRanks = false;
        }
        if (getRank(json, 11, false) != null) {
            embed.addField('Ranked Doubles 2v2', getEmoji(json, 11) + " "
                + getRank(json, 11, true), false);
            noRanks = false;
        }
        if (getRank(json, 13, false) != null) {
            embed.addField('Ranked Standard 3v3', getEmoji(json, 13) + " "
                + getRank(json, 13, true), false);
            noRanks = false;
        }
        if (getRank(json, 34, false) != null) {
            embed.addField('Tournament Matches', getEmoji(json, 34) + " "
                + getRank(json, 34, true), false);
            noRanks = false;
        }

        if (noRanks) {
            embed.setDescription("No ranks available! This player has not participated in Ranked Duel 1v1, " +
                "Ranked Doubles 2v2, Ranked Standard 3v3, or Tournament Matches.");
        } else {
            embed.setThumbnail(getHighestRank(json));
        }

        await interaction.reply({embeds: [embed]});
    }
}

function getRank(json, playlistId, showDiv) {
    const segmentArray = json['data']['segments'];
    for (let i = 0; i < segmentArray.length; i++) {
        const segment = segmentArray[i];
        const type = segment['type'];
        if (type === 'overview') continue;
        if (playlistId === segment['attributes']['playlistId']) {
            const rank = segment['stats']['tier']['metadata']['name'];
            const div = segment['stats']['division']['metadata']['name'];
            return showDiv ? rank + " " + div : rank;
        }
    }
}

function getEmoji(json, playlistId) {
    return ranks[getRank(json, playlistId, false)].emoji;
}

function getHighestRank(json) {
    const allRanks = [getRank(json, 10, false), getRank(json, 11, false),
        getRank(json, 13, false), getRank(json, 34, false)];
    let rank = ranks[allRanks[0]];
    for (let i = 0; i < 3; i++) {
        if (ranks[allRanks[i]].id > rank.id) {
            rank = ranks[allRanks[i]];
        }
    }
    return rank.image;
}