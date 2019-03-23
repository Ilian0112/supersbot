// MODULE
const Discord = require(`discord.js`);
const YTDL = require(`ytdl-core`);
//

// NEW CLIENT ( les deux pour pas ce prendre la tête )
const client = new Discord.Client();
const bot = new Discord.Client();
//

// BOT INFO
var version = `V.2.0.0 EN DEV`;
const PREFIX = `s.`;
const botname = `SupersBot`;
//

// EMOJI
const emoji_instaID = `457965848301404162`
    , emoji_twitterID = `457957941883043871`
    , emoji_facebookID = `457965866051698688`
    , emoji_snapID = `457975117818101791`
    , emoji_youtubeID = `475071414932865065`

const emoji_insta = `<:emoji_insta: ${emoji_instaID} >`
    , emoji_twitter = `<:emoji_twitter: ${emoji_twitterID} >`
    , emoji_facebook = `<:emoji_facebook: ${emoji_facebookID} >`
    , emoji_snap = `<:emoji_snap: ${emoji_snapID} >`
    , emoji_youtube = `<:emoji_youtube: ${emoji_youtubeID} >`
//

// MUSIQUE 
const servers = {};
const queue = new Map();

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], { filter: `audioonly` }));

    server.queue.shift();

    server.dispatcher.on(`end`, function () {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}
//

// Quand le bot est start
bot.on("ready", function () {
    bot.user.setActivity(`${botname} - ${PREFIX}help`, {
        'type': 'STREAMING',
        'url': "https://www.twitch.tv/supers_fanne"
    }),
        bot.user.setUsername(`${botname}`)
    bot.user.setStatus(`dnd`)
    console.log(`${botname} - Connecté`);

    var connection_embed = new Discord.RichEmbed()
        .setTitle(`${botname} connecté`)
        .setTimestamp()
        .setColor(`#36393E`)
        .setFooter(`${botname} - ${version}`)
    bot.channels.find(r => r.name == `commandes-logs`)
});
//

// Auto-Rôle & Bienvenue/Départ Message
/* bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "🤖bot-logs🤖").send(member.toString() + " Bienvenue sur ``" + message.guild.name + "`` ! :white_check_mark:");
    member.addRole(member.guild.roles.find("name", "Abonné ?"));
});

bot.on("guildMemberRemove", function(member) {
     member.guild.channels.find("name", "🤖bot-logs🤖").send(member.toString() + " Bye bye!" + member.toString() + " :x:");
}); */
//

// Les commandes
bot.on(`message`, async function (message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(` `);

    var args2 = message.content.split(` `).slice(1);

    var suffix = args2.join(` `);

    var reason = args2.slice(1).join(` `);

    var reasontimed = args2.slice(2).join(` `)

    var user = message.mentions.users.first();

    var guild = message.guild;

    var member = message.member;

    var roleban = member.guild.roles.find(r => r.name === `Banni(e)`)

    var roleMute = member.guild.roles.find(r => r.name === `Mute`)

    var foother = `Demande de ${message.author.toString()} ! | ${botname} -  + ${version}`

    var modlog = member.guild.channels.find(r => r.name === `bot-logs`)

    var user = message.mentions.users.first();

    var noperm_embed = new Discord.RichEmbed()
        .setTitle(`⚠Erreur⚠`)
        .setDescription(`Vous n'êtes pas autoriser à effectuer cette commande !`)
        .setFooter(foother)
        .setColor(`#FF0000`)
        .setTimestamp()

    switch (args[0].toLowerCase()) {
        case `p`:
        case `play`:
            message.delete()

            if (!args[1]) {
                var nolink_embed = new Discord.RichEmbed()
                    .setAuthor(`${botname} Musique - Erreur `, message.author.avatarURL)
                    .setDescription(`Vous n'avez pas entrez de lien !`)
                    .setColor(`#FF0000`)
                    .setFooter(`${foother}`)
                    .setTimestamp()
                message.channel.send(nolink_embed);
            }

            if (!message.member.voiceChannel) {
                var noinchannel_embed = new Discord.RichEmbed()
                    .setAuthor(`${botname} Musique - Erreur `, message.author.avatarURL)
                    .setDescription(`Vous n'êtes pas dans un salon vocal !`)
                    .setColor(`#FF0000`)
                    .setFooter(foother)
                    .setTimestamp()
                message.channel.send(noinchannel_embed);
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var noytblink_embed = new Discord.RichEmbed()
                .setAuthor(`${botname} Musique - Erreur `, message.author.avatarURL)
                .setDescription(`Vous devez mettre un lien YouTube !`)
                .setColor(`#FF0000`)
                .setFooter(foother)
                .setTimestamp()

            var validate = YTDL.validateURL(args[1]);
            if (!validate) return message.channel.send(noytblink_embed)

            // Récupération des informations
            let musicinfo = await YTDL.getInfo(args[1])

            message.channel.send(`**Vous avez bien ajouté** __**${musicinfo.title}**__ **à la file d'attente !**✅`)

            var server = servers[message.guild.id];

            var play_embed = new Discord.RichEmbed()
                .setAuthor(`Musique ajoutée :`, message.author.avatarURL)
                .addField(`Titre`, `[**${musicinfo.title}**](${musicinfo.video_url})`)
                .addField(`Uploader par`, `**EN DEV**`, true)
                .addField(`Ajoutée par`, message.author.toString(), true)
                .addField(`Durée: **EN DEV**`, "```css\n▶ 🔘──────────────────────────── 00:00:00\n```")
                .setColor(`#6495ED`)
                .setFooter(foother)
                .setThumbnail(`${musicinfo.thumbnail_url}`)
                .setTimestamp()
            message.channel.send(play_embed);

            server.queue.push(args[1]);
            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                play(connection, message)
            });
            break;

        case `s`:
        case `skip`:
            message.delete()

            if (!message.member.voiceChannel) {
                var noinchannel_embed = new Discord.RichEmbed()
                    .setAuthor(`${botname} Musique - Erreur `, message.author.avatarURL)
                    .setDescription(`Vous n'êtes pas dans un salon vocal !`)
                    .setColor(`#FF0000`)
                    .setFooter(foother)
                    .setTimestamp()
                message.channel.send(noinchannel_embed);
            }

            var server = servers[message.guild.id];

            var skip_embed = new Discord.RichEmbed()
                .setAuthor(`${botname} Musique`, message.author.avatarURL)
                .setDescription(`Passage à la musique suivante !`)
                .setColor(`#ffd11a`)
                .setFooter(foother)
                .setTimestamp()
            message.channel.send(skip_embed);

            if (server.dispatcher) server.dispatcher.end();
            break;

        case `stop`:
            message.delete()

            if (!message.member.voiceChannel) {
                var noinchannel_embed = new Discord.RichEmbed()
                    .setAuthor(`${botname} Musique - Erreur `, message.author.avatarURL)
                    .setDescription(`Vous n'êtes pas dans un salon vocal !`)
                    .setColor(`#FF0000`)
                    .setFooter(foother)
                    .setTimestamp()
                message.channel.send(noinchannel_embed);
            }

            message.member.voiceChannel.leave();

            var stop_embed = new Discord.RichEmbed()
                .setAuthor(`${botname} Musique - Erreur `, message.author.avatarURL)
                .setDescription(`Fin de la sessions de musique !`)
                .setColor(`#006633`)
                .setFooter(foother)
                .setTimestamp()
            message.channel.send(stop_embed);
            break;

        case `mute`:
            message.delete()

            let tomute2 = message.guild.member(message.mentions.users.first())

            var noreason_embed = new Discord.RichEmbed()
                .setTitle(`${botname} - Erreur`)
                .setDescription(`Vous avez oublié la raison de la sanction.`)
                .setFooter(foother)
                .setColor(`#FF0000`)
                .setTimestamp()

            var nomention_embed = new Discord.RichEmbed()
                .setTitle(`${botname} - Erreur`)
                .setDescription(`Vous devez mentionner une personne afin de la réduire au silence !`)
                .setFooter(foother)
                .setColor(`#FF0000`)
                .setTimestamp()

            if (!message.member.roles.find(r => r.name == "Helpeur" || r.name == "Modérateur Test" || r.name == "Modérateur" || r.name == "Administrateur" || r.name == "Gérant Staff" || r.name == "Supers Fanne" )) return message.channel.send(noperm_embed);
            if (!tomute2) return message.channel.send(nomention_embed)
            //if(tomute2.hasPermission(`MUTE_MEMBERS`)) return message.channel.send(`**Vous ne pouvez pas réduire au silence un membre du Staff !** `)
            if (!reason) return message.channel.send(noreason_embed)

            let muterole = message.guild.roles.find(r => r.name == `Mute`)
            if (!muterole) {
                try {
                    muterole = await message.guild.createRole({
                        name: `Mute`,
                        color: `#339999`,
                        permissions: [`READ_MESSAGES`],
                    })
                    message.guild.channels.forEach(async (channel, id) => {
                        await channel.overwritePermissions(muterole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    });
                } catch (e) {
                    console.log(e.stack);
                }
            }
            (tomute2.addRole(muterole));

            message.channel.send(`${tomute2.toString()} a bien été réduit au silence !`)


            var mute_embed = new Discord.RichEmbed()
                .setAuthor(`Sanction : Mute`)
                .addField(`Modérateur :`, `${message.author.username}#${message.author.discriminator}`)
                .addField(`Utilisateur :`, `${user.toString()}`, true)
                .addField(`ID Utilisateur :`, `${user.id}`)
                .addField(`Raison :`, `${reason}`)
                .setFooter(foother)
                .setTimestamp()
                .setColor(`#FF0000`)

            modlog.send(mute_embed)
            break;

        case "unmute":
            message.delete()

            if (!message.member.roles.find(r => r.name == "Modérateur" || r.name == "Administrateur" || r.name == "Gérant Staff" || r.name == "Supers_Fanne" )) return message.channel.send(noperm_embed);
            if (!modlog) return message.reply("Je ne trouve pas de channel log.");
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je retire la sanction: MUTE ?")
            member.removeRole(roleMute)
            message.channel.send(user.toString() + " a bien été unmute ✅")
            console.log("Tu a unmute quelqu'un toi " + message.author.username + " !")

            var unmute_embed = new Discord.RichEmbed()
                .addField("Commande :", "UnMute")
                .addField("Utilisateur :", user.username)
                .addField("Modérateur :", message.author.username)
                .addField("Heure:", message.channel.createdAt)
                .setColor("#3333cc")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
                .setFooter("SupersBOT - " + version)
            member.guild.channels.find(r => r.name == "🤖bot-logs🤖").send(unmute_embed);
            break;

        case `tempmute`:
            message.delete()
            let tomute = message.guild.member(message.mentions.users.first())
            let mutetime = message.content.split(` `).slice(2).join(` `);

            var nomention_embed = new Discord.RichEmbed()
                .setTitle(`${botname} - Erreur`)
                .setDescription(`Vous devez mentionner une personne afin de la réduire au silence !`)
                .setFooter(foother)
                .setColor(`#FF0000`)
                .setTimestamp()

            if (!tomute) return message.channel.send(nomention_embed)

            var notime_embed = new Discord.RichEmbed()
                .setTitle(`${botname} - Erreur`)
                .setDescription(`Vous devez indiquer le temps voulu afin de réduire la personne au silence !`)
                .setFooter(foother)
                .setColor(`#FF0000`)
                .setTimestamp()

            var nohastimedmute_embed = new Discord.RichEmbed()
                .setAuthor(`Sanction : TempMute`)
                .addField(`Modérateur :`, `<@${message.author.id}>`)
                .addField(`Utilisateur :`, `<@${tomute.id}>`, true)
                .addField(`ID Utilisateur :`, `${tomute.id}`)
                .addField(`Temps :`, `${mutetime}`)
                .setFooter(foother)
                .setTimestamp()
                .setColor(`#FF0000`)

            var nohastunmuted_embed = new Discord.RichEmbed()
                .setAuthor(`Sanction révoquer : TempMute`)
                .addField(`Modérateur :`, `<@${message.author.id}>`)
                .addField(`Utilisateur :`, `<@${tomute.id}>`, true)
                .addField(`ID Utilisateur :`, `${tomute.id}`)
                .addField(`Temps du mute`, `${mutetime}`)
                .setFooter(foother)
                .setTimestamp()
                .setColor(`#34C924`)

            if (!tomute) return message.channel.send(nomention_embed)

            if (!message.member.roles.find(r => r.name == "Helpeur" || r.name == "Modérateur Test" || r.name == "Modérateur" || r.name == "Administrateur" || r.name == "Gérant Staff" || r.name == "Supers Fanne" )) return message.channel.send(noperm_embed);
            if (tomute.hasPermission(`MUTE_MEMBERS`)) return message.channel.send(`**Vous ne pouvez pas réduire au silence un membre du Staff !** `)


            if (!mutetime) return message.channel.send(notime_embed)
            if (!modlog) return message.channel.send(nologschannel_embed);
            let muteroletemp = message.guild.roles.find(r => r.name == `Mute`)
            if (!muteroletemp) {
                try {
                    muteroletemp = await message.guild.createRole({
                        name: `Mute`,
                        color: `#339999`,
                        permissions: [`READ_MESSAGES`],
                    })
                    message.guild.channels.forEach(async (channel, id) => {
                        await channel.overwritePermissions(muteroletemp, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    });
                } catch (e) {
                    console.log(e.stack);
                }
            }
            (tomute.addRole(muteroletemp));

            modlog.send(nohastimedmute_embed)

            setTimeout(function () {
                tomute.removeRole(muteroletemp.id);
                modlog.send(nohastunmuted_embed)
            }, ms(mutetime));
            break;

        case `warn`:
            break;

        case "shelp":
            if (!message.member.roles.find(r => r.name == "Helpeur" || r.name == "Modérateur Test" || r.name == "Modérateur" || r.name == "Administrateur" || r.name == "Gérant Staff" || r.name == "Supers Fanne" )) return message.channel.send(noperm_embed);
            var shelp1_embed = new Discord.RichEmbed()
                .setTitle("Commande qui demande au moins le modo ( sauf pour le kick )")
                .setColor("#cc0000")
                .addField(PREFIX + "purge", "Cette commande permet de supprimé des messages beaucoup plus rapidement ! Pour l'utiliser, faites " + PREFIX + "purge (nombredemessages)")
                .addField(PREFIX + "mute", "Cette commande permet de muté un utilisateur pendant un certain temps. Pour l'utiliser, faites " + PREFIX + "mute @(utilisateur) + (raison)")
                .addField(PREFIX + "unmute", "Cette commande permet d'unmute un utilisateur. Pour l'utiliser, faites " + PREFIX + "unmute @(utilisateur)")
                .setFooter("Page 1/2 | Merci à @ZENFIX#8575 qui à bien aider pour cette commande. | " + foother)
            var helptwo_embed = new Discord.RichEmbed()
                .setTitle("Commande qui demande au moins l'admin ( sauf pour le kick )")
                .setColor("#cc0000")
                .addField(PREFIX + "kick", "Cette commande permet de kick un utilisateur ! Pour l'utiliser, faites " + PREFIX + "kick @(utilisateur) + (raison)")
                .addField(PREFIX + "ban", "Cette commande permet de bannir un utilisateur ! Pour l'utiliser, faites " + PREFIX + "ban @(utilisateur) + (raison)")
                .addField(PREFIX + "unkick", "Cette commande permet de unkick un utilisateur ! Pour l'utiliser, faites " + PREFIX + "unkick @(utilisateur)")
                .addField(PREFIX + "unban", "Cette commande permet de unban un utilisateur ! Pour l'utiliser, faites " + PREFIX + "unban @(utilisateur)")
                .addField(PREFIX + "warn", "Cette commande permet de warn un utilisateur ! Pour l'utiliser, faites " + PREFIX + "warn @(utilisateur) + (raison)")
                .setFooter("Page 2/2 | Merci à @ZENFIX#8575 qui à bien aider pour cette commande. | " + foother)
            const shelpmessage = await message.channel.send(shelp1_embed);
            await shelpmessage.react("1⃣");
            await shelpmessage.react("2⃣");
            const panierr = shelpmessage.createReactionCollector((reaction, user) => user.id === message.author.id);
            panierr.on('collect', async (reaction) => {
                if (reaction.emoji.name === "1⃣") {
                    shelpmessage.edit(shelp1_embed);
                }
                if (reaction.emoji.name === "2⃣") {
                    shelpmessage.edit(helptwo_embed);
                }
                await reaction.remove(message.author.id);
            })
            console.log("AIDE STAFF " + message.author.username + " !")
            break;

        case "help":
            var start_embed = new Discord.RichEmbed()
                .setTitle("🛠Menu d'aide🛠 !")
                .setDescription("**Pour naviguer dans le menu d'aide, utilisez les réactions si-dessous.**")
                .setColor("#36393E")
                .setFooter(foother + " | Merci à @ZENFIX#8575 qui à bien aider pour cette commande.")
            var help1_embed = new Discord.RichEmbed()
                .setTitle("🎵Musique🎵")
                .setColor("#0000ff")
                .addField(PREFIX + "play", "Jouer une musique !  Pour l'utiliser, faites " + PREFIX + "play (lien) !")
                .addField(PREFIX + "skip", "Sauter une musique  Pour l'utiliser, faite " + PREFIX + "skip !")
                .addField(PREFIX + "stop", "Arreter la musique  Pour l'utiliser, faites " + PREFIX + "stop !")
                .setFooter("Page 1/3 | Merci à @ZENFIX#8575 qui à bien aider pour cette commande. | " + foother)
            var help2_embed = new Discord.RichEmbed()
                .setTitle("💩Autre💩")
                .setColor("#0000ff")
                .addField(PREFIX + "botinfo", "Grâce à cette commande, tu pourras savoir mes infos !")
                .addField(PREFIX + "reseau", "Vous donne mes réseaux sociaux !")
                .addField(PREFIX + "roles", "Pour affichier la liste des rôles disponible !")
                .setFooter("Page 2/3 | Merci à @ZENFIX#8575 qui à bien aider pour cette commande. | " + foother)
            var help3_embed = new Discord.RichEmbed()
                .setTitle("⚙Administration🛠")
                .setColor("#cc0000")
                .addField(PREFIX + "shelp", "❌Afficher les commandes du staff. Mais seule ceux qui ont la perm de kick pourrons y accèder. ❌")
                .setFooter("Page 3/3 | Merci à @ZENFIX#8575 qui à bien aider pour cette commande. | " + foother)
            const helpmessage = await message.channel.send(start_embed);
            await helpmessage.react("1⃣");
            await helpmessage.react("2⃣");
            await helpmessage.react("3⃣");
            const ranier = helpmessage.createReactionCollector((reaction, user) => user.id === message.author.id);
            ranier.on('collect', async (reaction) => {
                if (reaction.emoji.name === "1⃣") {
                    helpmessage.edit(help1_embed);
                }
                if (reaction.emoji.name === "2⃣") {
                    helpmessage.edit(help2_embed);
                }
                if (reaction.emoji.name === "3⃣") {
                    helpmessage.edit(help3_embed)
                }
                await reaction.remove(message.author.id);
            })
            break;

        case "kick":
            if (!message.member.roles.find(r => r.name == "Modérateur" || r.name == "Administrateur" || r.name == "Gérant Staff" || r.name == "Supers Fanne" )) return message.channel.send(noperm_embed);
            if (!modlog) return message.reply("Je ne trouve pas de channel log.");
            if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: kick")
            message.channel.send(member.toString() + " a bien été kick. ✅")
            member.roles.forEach(role => {
                member.removeRole(role)
            })
            member.addRole(rolekick)
            console.log("Tu a kick quelqu'un toi " + message.author.username + " !")

            var kick_embed = new Discord.RichEmbed()
                .addField("Action :", "Kick")
                .addField("Utilisateur :", user.toString())
                .addField("Modérateur :", message.author.toString())
                .addField("Raison :", reasontimed)
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
                .setFooter("SupersBOT - " + version)
            member.guild.channels.find("name", "🤖bot-logs🤖").send(kick_embed);
            member.guild.channels.find("name", "kick").send(kick_embed);
        break;

        case "ban":
            if (!message.member.roles.find(r => r.name == "Modérateur" || r.name == "Administrateur" || r.name == "Gérant Staff" || r.name == "Supers Fanne" )) return message.channel.send(noperm_embed);
            if (!modlog) return message.reply("Je ne trouve pas de channel log.");
            if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: Ban")
            message.channel.send(member.toString() + " a bien été ban. ✅")
            member.roles.forEach(role => {
                member.removeRole(role)
            })
            member.addRole(roleban)
            console.log("Tu a b n quelqu'un toi " + message.author.username + " !")

            var ban_embed = new Discord.RichEmbed()
                .addField("Action :", "Bannissement")
                .addField("Utilisateur :", user.toString())
                .addField("Modérateur :", message.author.toString())
                .addField("Raison :", reasontimed)
                .setFooter("SupersBOT - " + version)
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(ban_embed);
            member.guild.channels.find("name", "ban").send(ban_embed);
            break;

        case "unban":
            if (!message.member.roles.find(r => r.name == "Administrateur" || r.name == "Gérant Staff" || r.name == "Supers Fanne" )) return message.channel.send(noperm_embed);
            if (!modlog) return message.reply("Je ne trouve pas de channel log.");
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je enlevé mettre la sanction: Ban")
            message.channel.send(member.toString() + " a bien été ban. ✅")
            member.removeRole(roleban)
            console.log("Tu a unban quelqu'un toi " + message.author.username + " !")

            var unban_embed = new Discord.RichEmbed()
                .addField("Action :", "UnBan")
                .addField("Utilisateur :", user.toString())
                .addField("Modérateur :", message.author.toString())
                .setFooter("SupersBOT - " + version)
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(unban_embed);
            break;

        case "purge":
            if (!message.member.roles.find(r => r.name == "Modérateur" || r.name == "Administrateur" || r.name == "Gérant Staff" || r.name == "Supers Fanne" )) return message.channel.send(noperm_embed);
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
            message.delete()
            console.log(PREFIX + "purge par " + message.author.username + " !\nProvenance du message : " + message.guild.name)
            member.guild.channels.find("name", "staff-logs").send("**" + message.author.toString() + "** a utilisé ``" + PREFIX + "purge " + messagecount + " `` dans le salon " + message.channel + " !\nProvenance du message : ``" + message.guild.name + "``");
        break;

        case "reseau":
            var reseau_embed = new Discord.RichEmbed()
                .addField(emoji_insta + "Instagram", "[@supersfanne](https://www.instagram.com/supersfanne/)", true)
                .addField(emoji_twitter + "Twitter", "[@SupersFanne](https://twitter.com/supersfanne)", true)
                .addField(emoji_facebook + "Facebook", "[@Supers-Fanne](https://www.facebook.com/profile.php?id=100012028577867)", true)
                .addField(emoji_snap + "Snapchat", "[@supers_fanne](https://app.snapchat.com/web/deeplink/snapcode?username=supers_fanne&type=SVG&size=240)")
                .setFooter(foother + "| Grands merci à @ZENFIX#8575 pour les logos !")
                .setAuthor("Réseaux Sociaux De Supers Fanne")
                .setDescription("Pour l'actualité !")
                .setColor('#0000ff')
                .setTimestamp()
            message.delete()
            message.channel.send(reseau_embed)
            console.log("Mes reseau " + message.author.username + " !")
            break;

        case "new@":
            if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
            message.delete()
            let staffs = message.content.split(" ");
            staffs.shift();
            var newm_embed = new Discord.RichEmbed()
                .setColor("#FF0000")
                .addField("Annonce!", " " + staffs.join(" "))
                .setFooter("Annonce de : @" + message.author.username + "#" + message.author.discriminator + " ! | SupersBOT - " + version)
            message.delete();
            message.guild.channels.find('name', "annonce").send(":arrow_down: <@&454375100326608897> :arrow_down: ")
            member.guild.channels.find("name", "annonce").send(newm_embed);
        break;

        case "new":
            if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
            message.delete()
            let staff = message.content.split(" ");
            staff.shift();
            var new_embed = new Discord.RichEmbed()
                .setColor("#FF0000")
                .addField("Annonce!", " " + staff.join(" "))
                .setFooter("Annonce de : @" + message.author.username + "#" + message.author.discriminator + " ! | SupersBOT - " + version)
            message.delete();
            member.guild.channels.find("name", "annonce").send(new_embed);
        break;

        case "botinfo":
            var load1_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours.', "Merci de patienter quelques instants !")
            message.channel.send(load1_embed).then(message => message.edit(load2_embed)).then(message => message.edit(load3_embed)).then(message => message.edit(load4_embed)).then(message => message.edit(botinfo_embed));
            var load2_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours..', "Merci de patienter quelques instants !")
            var load3_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours...', "Merci de patienter quelques instants !")
            var load4_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours.', "Merci de patienter quelques instants !")
            let startTime = Date.now();
            var botinfo_embed = new Discord.RichEmbed()
                .setColor('#04B404')
                .setTitle('Mes informations :')
                .addField("Serveurs :", "Je suis sur " + bot.guilds.array().length + " serveurs")
                .addField("Membres :", "Je voit ``" + bot.users.size + " membres`` au total.")
                .addField("Version :", "La version de mon système est : ``" + version + "`` !")
                .addBlankField()
                .addField('Mon Ping :', ':ping_pong: Pong !')
                .addField(":clock2: Temps :", `${Date.now() - startTime} millisecondes`, true)
                .addField(":heartpulse: API Discord :", `${bot.ping} millisecondes`, true)
                .setTimestamp()
                .setFooter(foother)
            break;
        /*
                case "majinfo":
                   if (message.author.id === "193092758267887616") {
                        var maj_embed = new Discord.RichEmbed()
                        .setTitle("Update " + version)
                            .addField("Suppression de commande,", "**Plusieurs commande on été supprimer car elle ne servais pas vraiment pour ce bot.**")
                        .setColor("#04B404")
                        .setFooter(version)
                    bot.channels.findAll('name', 'bot-update').map(channel => channel.send(maj_embed));
                    message.delete()
                    }
                break;*/

    }
});
//

// Connection du bot
bot.login(process.env.TOKEN);
//
