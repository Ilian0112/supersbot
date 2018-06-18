const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const PREFIX = "s.";
const queue = new Map();
const EVERYONE = "@";

var client = new Discord.Client();

var bot = new Discord.Client();

var emoji_instaID = "457965848301404162"
, emoji_twitterID = "457957941883043871"
, emoji_facebookID = "457965866051698688"
, emoji_snapID = "457975117818101791"

var emoji_insta = "<:emoji_insta:" + emoji_instaID + ">"
, emoji_twitter = "<:emoji_twitter:" + emoji_twitterID + ">"
, emoji_facebook = "<:emoji_facebook:" + emoji_facebookID + ">"
, emoji_snap = "<:emoji_snap:" + emoji_snapID + ">"

var servers = {};

function play(connection, message) {
 var server = servers[message.guild.id];
    
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    
    server.queue.shift();
    
    server.dispatcher.on("end", function() {
     if (server.queue[0]) play(connection, message);
     else connection.disconnect();
    });
}

bot.on("ready", function () {
    bot.user.setActivity("SupersBOT - " + PREFIX + "help", {
        'type': 'STREAMING',
        'url': "https://www.twitch.tv/supers_fanne"
}),
    bot.user.setUsername("SupersBOT")
    console.log("SupersBOT - Connecté");
});

bot.on('message', function(message) {
    
       if(message.content === 'ntm') { // # cencure
            message.reply('Surveille ton language jeune insolents !')
            message.delete()
        }

    });

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "🤖bot-logs🤖").send(member.toString() + " Bienvenue sur ``" + message.guild.name + "`` ! :white_check_mark:");
    member.addRole(member.guild.roles.find("name", "Abonné ?"));
});

bot.on("guildMemberRemove", function(member) {
     member.guild.channels.find("name", "🤖bot-logs🤖").send(member.toString() + " Bye bye!" + member.toString() + " :x:");
});

bot.on("message", async function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split (" ");

    var args2 = message.content.split(" ").slice(1);

    var suffix = args2.join(" ");

    var reason = args2.slice(1).join(" ");
    
    var reasontimed = args2.slice(2).join(' ')

    var user = message.mentions.users.first();
    
    var guild = message.guild;
    
    var member = message.member;

    var roleban = member.guild.roles.find("name", "Banni(e)")

    var rolekick = member.guild.roles.find("name", "Kick")

    var roleAbonné = member.guild.roles.find("name", "Abonné")

    var roleNonAbonné = member.guild.roles.find("name", "Non Abonné")
    
    var roleAbonnéQuest = member.guild.roles.find("name", "Abonné ?")
    
    var roleWinner = member.guild.roles.find("name", "🏆Winner🏆")
    
    var roleVIP = member.guild.roles.find("name", "⭐️VIP⭐️")
    
    var roleNotifAnnonce = member.guild.roles.find("name", "🔔Notification Annonce")
    
    var roleNotifGiveaway = member.guild.roles.find("name", "🔔Notification Giveaway")    
    
    var roleNotifAnimation = member.guild.roles.find("name", "🔔Notification Animation")       
    
    var roleMute = member.guild.roles.find("name", "Mute")
    
    var modlog = member.guild.channels.find("name", "🤖bot-logs🤖")
    
    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
                message.channel.send("[```SupersBOT Musique```] - **Vous devez mettre un lien**.");   
                return;
            }
            if(!message.member.voiceChannel) {
                message.channel.send("[```SupersBOT Musique```] - **Vous devez être dans un salon vocal**.");   
                return;
            }
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            
            var server = servers[message.guild.id];
            message.channel.send("[```SupersBOT Musique```] - **Musique jouer ** :``EN DEV``");
            server.queue.push(args[1]);
         
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message) 
            });
            console.log("Ouais de la musique " + message.author.username + " !")
        break;    
      
        case "stop":
            if(!message.member.voiceChannel) {
                message.channel.send("[```SupersBOT Musique```] - **Vous devez être dans un salon vocal**.");   
                return;
            }
            var server = servers[message.guild.id];
            message.channel.send("[```SupersBOT Musique```] - **Fin de la session**");
            if(server.dispatcher) server.dispatcher.end();
            console.log("Oh plus de musique " + message.author.username + " !")
        break;    
      
        case "membres":
            message.reply("Nous sommes``" + message.guild.memberCount + " membres`` sur le discord !");
            console.log("Tu sais qu'on combien on est maintenant " + message.author.username + " !( " + message.guild.memberCount + " )")
        break;
        
        case "unmute":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");
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
            member.guild.channels.find("name", "🤖bot-logs🤖").send(unmute_embed);
        break;

// Role Winner {CREATEUR ONLY}  
        
        case "addwinner":
        if(message.author.id === "193092758267887616") {
            var member = message.mentions.members.first();
                member.addRole(roleWinner)
            message.channel.send(user.toString() + " est VIP ✅") 
            
            var winner_add_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "Winner")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Prit")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(winner_add_embed);
        }
            message.delete()
        break;			    

        case "removewinner":
        if(message.author.id === "193092758267887616") {
            var member = message.mentions.members.first();
                member.removeRole(roleWinner)
            message.channel.send(user.toString() + " est VIP ✅") 
            
            var rm_vip_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "Winner")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Enlever")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(rm_vip_embed);
        }
            message.delete()
        break;				    

// Role VIP {CREATEUR ONLY}        

        case "addvip":
        if(message.author.id === "193092758267887616") {
            var member = message.mentions.members.first();
                member.addRole(roleVIP)
            message.channel.send(user.toString() + " est VIP ✅") 
            
            var vip_add_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "VIP")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Prit")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(vip_add_embed);
        }
            message.delete()
        break;			    
	    
	    case "removevip":
        if(message.author.id === "193092758267887616") {
            var member = message.mentions.members.first();
                member.removeRole(roleVIP)
            message.channel.send(user.toString() + " est VIP ✅") 
            
            var rm_vip_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "VIP")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Enlever")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(rm_vip_embed);
        }
            message.delete()
        break;	
		    			    
// Role Abonné
        case "addabo":
                member.addRole(roleAbonné)
                member.removeRole(roleAbonnéQuest)	
            var abo_add_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "Abonné")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Prit")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(abo_add_embed);		    
            message.reply("à bien prit son role Abonné ✅")
        break;	

        case "removeabo":
                member.removeRole(roleAbonné)
                member.addRole(roleAbonnéQuest)
            var rm_abo_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "Abonné")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Enlever")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(rm_abo_embed);		    
            message.reply("à bien enlever son role Abonné ✅")
        break;

// Role Non Abonné 

        case "addnonabo":
                member.addRole(roleNonAbonné)
                member.removeRole(roleAbonnéQuest)
            var nabo_add_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "Non Abonné")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Prit")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(nabo_add_embed);		    
            message.reply("à bien prit son role Non Abonné ✅")
        break;
		    
        case "removenabo":
                member.removeRole(roleNonAbonné)
                member.addRole(roleAbonnéQuest)
            var rm_nabo_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "Non Abonné")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Enlever")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(rm_nabo_embed);		    	    
            message.reply("à bien enlever son role Non Abonné ✅")
        break;		 

// Role 🔔Notification Annonce

        case "addnotifannonce":
                member.addRole(roleNotifAnnonce)
            var notifannonce_add_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "🔔Notification Annonce")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Enlever")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(notifannonce_add_embed);		    
            message.reply("à bien enlever son role 🔔Notification Annonce ✅")		    
        break;		 

        case "removenotifannonce":
        member.removeRole(roleNotifAnnonce)
        var rm_notifannonce_embed = new Discord.RichEmbed()
        .addField("Utilisateur :", message.author.toString())
        .addField("Rôle :", "🔔Notification Annonce")
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setDescription("Rôle Enlever")
        .setTimestamp()
        member.guild.channels.find("name", "🤖bot-logs🤖").send(rm_notifannonce_embed);		    	    
        message.reply("à bien enlever son role 🔔Notification Annonce ✅")   
        break;	

// Role 🔔Notification Giveaway

        case "addnotifgiveaway":
                member.addRole(roleNotifGiveaway)
            var notifgiveaway_add_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "🔔Notification Giveaway")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Prit")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(notifgiveaway_add_embed);		    
            message.reply("à bien prit son role 🔔Notification Giveaway ✅")		    
        break;		

        case "removenotifgiveaway":
                member.removeRole(roleNotifGiveaway)
            var rm_notifgiveaway_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "🔔Notification Giveaway")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Enlever")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(rm_notifgiveaway_embed);		    	    
            message.reply("à bien enlever son role 🔔Notification Giveaway ✅")   
        break;	

// Role 🔔Notification Animation

        case "addnotifanimation":
                member.addRole(roleNotifAnimation)
            var notifanimation_add_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "🔔Notification Animation")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Prit")
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(notifanimation_add_embed);		    
            message.reply("à bien prit son role 🔔Notification Animation ✅")		    
        break;		    
                        
        case "removenotifanimation":
                member.removeRole(roleNotifAnimation)
            var rm_notifanimation_embed = new Discord.RichEmbed()
                    .addField("Utilisateur :", message.author.toString())
                    .addField("Rôle :", "🔔Notification Animation")
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Rôle Enlever")
            .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(rm_notifanimation_embed);		    
            message.reply("à bien enlever son role 🔔Notification Animation ✅")		    
        break;			    
        
        case "roles":
            var role_embed = new Discord.RichEmbed()
                    .addField(PREFIX + "addabo", "Grâce à cette commande, tu pourras prendre le rôle " + roleAbonné + " !") 
                    .addField(PREFIX + "removeabo", "Grâce à cette commande, tu pourras enlever le rôle " + roleAbonné + " !")
                    .addBlankField()                
                    .addField(PREFIX + "addnonabo", "Grâce à cette commande, tu pourras prendre le rôle " + roleNonAbonné + " !")
                    .addField(PREFIX + "removenabo", "Grâce à cette commande, tu pourras enlever le rôle " + roleNonAbonné + " !")
                    .addBlankField() 
                    .addField(PREFIX + "addnotifannonce", "Grâce à cette commande, tu pourras prendre le rôle " + roleNotifAnnonce + " !")
                    .addField(PREFIX + "removenotifannonce", "Grâce à cette commande, tu pourras enlever le rôle " + roleNotifAnnonce + " !")
                    .addBlankField()
                    .addField(PREFIX + "addnotifgiveaway", "Grâce à cette commande, tu pourras prendre le rôle " + roleNotifGiveaway + " !")
                    .addField(PREFIX + "removenotifgiveaway", "Grâce à cette commande, tu pourras enlever le rôle " + roleNotifGiveaway + " !")
                    .addBlankField()
                    .addField(PREFIX + "addnotifanimation", "Grâce à cette commande, tu pourras prendre le rôle " + roleNotifAnimation + " !")
                    .addField(PREFIX + "removenotifanimation", "Grâce à cette commande, tu pourras enlever le rôle " + roleNotifAnimation + " !")                  
                .setColor("#36393E")
                .setFooter("By Ilian!")
                .setTitle("Panel des rôles")
                .setDescription("Ici, tu voit tous les rôles que tu peut prendre ou enlever.")
                .setTimestamp()
            message.delete()
            message.channel.send(role_embed)
            console.log("Ta eu besoin d'aide toi " + message.author.username + " !")
        break;		    
		    
        case "mute":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
            if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: MUTE")
            message.channel.send(member.toString() + " a bien été mute. ✅")
                member.addRole(roleMute)
            console.log("Tu a mute quelqu'un toi " + message.author.username + " !")
                
            var mute_embed = new Discord.RichEmbed()
                    .addField("Action :", "Mute")
                    .addField("Utilisateur :", user.toString())
                    .addField("Modérateur :", message.author.toString())
                    .addField("Raison :", reasontimed)
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(mute_embed);
        break;

        case "shelp":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            var shelp_embed = new Discord.RichEmbed()
                    .addField(PREFIX + "ban", "Cette commande permet de bannir un utilisateur ! Pour l'utiliser, faites " + PREFIX + "ban @(utilisateur) + (raison)")
                    .addField(PREFIX + "kick", "Cette commande permet de kick un utilisateur ! Pour l'utiliser, faites " + PREFIX + "kick @(utilisateur) + (raison)")
                    .addField(PREFIX + "unban", "Cette commande permet de unban un utilisateur ! Pour l'utiliser, faites " + PREFIX + "unban @(utilisateur)")
                    .addField(PREFIX + "unkick", "Cette commande permet de unkick un utilisateur ! Pour l'utiliser, faites " + PREFIX + "unkick @(utilisateur)")
                    .addField(PREFIX + "purge", "Cette commande permet de supprimé des messages beaucoup plus rapidement ! Pour l'utiliser, faites " + PREFIX + "purge (nombredemessages)")
                    .addField(PREFIX + "mute", "Cette commande permet de muté un utilisateur pendant un certain temps. Pour l'utiliser, faites " + PREFIX + "mute @(utilisateur) + (raison)")
                    .addField(PREFIX + "unmute", "Cette commande permet d'unmute un utilisateur. Pour l'utiliser, faites " + PREFIX + "unmute @(utilisateur)")
                .setColor("#cc0000")
                .setFooter("Aide du staff.")
                .setAuthor("Pannel d'aide du staff")
                .setDescription("Voici les commandes du staff !")
                .setTimestamp()
            message.delete()
            message.channel.send(shelp_embed)
            console.log("AIDE STAFF " + message.author.username + " !")
        break;    
        
        case "help":
            var help_embed = new Discord.RichEmbed()
                    .addField(PREFIX + "botinfo", "Grâce à cette commande, tu pourras savoir mes info !") 
                    .addField(PREFIX + "reseau", "Vous donne mes réseaux sociaux !")
                    .addField(PREFIX + "play", "Jouer une musique !  Pour l'utiliser, faites " + PREFIX + "play (lien) !")
                    .addField(PREFIX + "skip", "Sauter une musique  Pour l'utiliser, faite " + PREFIX + "skip !")
                    .addField(PREFIX + "stop", "Arreter la musique  Pour l'utiliser, faites " + PREFIX + "stop !")
                    .addField(PREFIX + "tradhelp", "Pour affichier l'aide des traductions !")
	            .addField(PREFIX + "roles", "Pour affichier la liste des rôles disponible !")
                    .addField(PREFIX + "google", "Commande pas trop utile mais tu peut faire des recherche google. Pour l'utiliser, faites " + PREFIX + "google (recherche) !")
                    .addField(PREFIX + "shelp", "❌Afficher les commandes du staff. Mais seule ceux qui ont la perm de kick pourrons y accèder. ❌")
                .setColor("#0000ff")
                .setFooter("Idée de commande ? Proposer en MP!")
                .setAuthor("Pannel d'aide")
                .setDescription("Voici les commandes du bot !")
                .setTimestamp()
            message.delete()
            message.channel.send(help_embed)
            console.log("Ta eu besoin d'aide toi " + message.author.username + " !")
        break;
       
        case "kick":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
            if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: kick")
            message.channel.send(member.toString() + " a bien été kick. ✅")
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
            member.guild.channels.find("name", "🤖bot-logs🤖").send(kick_embed);
            member.guild.channels.find("name", "kick").send(kick_embed);
        break;

        case "unkick":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je dois enlevé la sanction: kick")
            message.channel.send(member.toString() + " a bien été unkick. ✅")
                member.removeRole(rolekick)
            console.log("Tu a unkick quelqu'un toi " + message.author.username + " !")
                
            var unkick_embed = new Discord.RichEmbed()
                    .addField("Action :", "unKick")
                    .addField("Utilisateur :", user.toString())
                    .addField("Modérateur :", message.author.toString())
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(unkick_embed);
        break;

        case "ban":
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
            if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: Ban")
            message.channel.send(member.toString() + " a bien été ban. ✅")
                member.addRole(roleban)
            console.log("Tu a b n quelqu'un toi " + message.author.username + " !")
        
            var ban_embed = new Discord.RichEmbed()
                    .addField("Action :", "Bannissement")
                    .addField("Utilisateur :", user.toString())
                    .addField("Modérateur :", message.author.toString())
                    .addField("Raison :", reasontimed)
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(ban_embed);
            member.guild.channels.find("name", "ban").send(ban_embed);
        break;
       
        case "unban":
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je enlevé mettre la sanction: Ban")
            message.channel.send(member.toString() + " a bien été ban. ✅")
                member.removeRole(roleban)
            console.log("Tu a unban quelqu'un toi " + message.author.username + " !")
                
            var unban_embed = new Discord.RichEmbed()
                    .addField("Action :", "UnBan")
                    .addField("Utilisateur :", user.toString())
                    .addField("Modérateur :", message.author.toString())
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
            member.guild.channels.find("name", "🤖bot-logs🤖").send(unban_embed);
        break;       

        case "purge":
            if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
            message.delete()
            console.log(PREFIX +"purge par " + message.author.username + " !\nProvenance du message : " + message.guild.name)
            member.guild.channels.find("name", "staff-logs").send("**" + message.author.toString() + "** a utilisé ``" + PREFIX + "purge " + messagecount + " `` dans le salon " + message.channel +" !\nProvenance du message : ``" + message.guild.name + "``");
        break;

        case "reseau":
            var reseau_embed = new Discord.RichEmbed()
                    .addField(emoji_insta + "Instagram", "[@supersfanne](https://www.instagram.com/supersfanne/)", true) 
                    .addField(emoji_twitter + "Twitter", "[@SupersFanne](https://twitter.com/supersfanne)", true)
                    .addField(emoji_facebook + "Facebook", "[@Supers-Fanne](https://www.facebook.com/profile.php?id=100012028577867)", true)
                    .addField(emoji_snap + "Snapchat", "[@supers_fanne](https://app.snapchat.com/web/deeplink/snapcode?username=supers_fanne&type=SVG&size=240)")
                .setFooter("Demande de @" + message.author.username + "#" + message.author.discriminator + " ! | Grands merci à @ZENFIX#8575 pour les logos !")
                .setAuthor("Réseaux Sociaux De Supers Fanne")
                .setDescription("Pour l'actualité !")
                .setColor('#0000ff')
                .setTimestamp()
            message.delete()
            message.channel.send(reseau_embed)
            console.log("Mes reseau " + message.author.username + " !")
        break;
      
        case "google":
            let google = message.content.split(" ").slice(1);
            let suffix_google = google.join('%20')
            if(!suffix_google) return message.reply("Vous devez marquez quoi cherchez.")
            var google_embed = new Discord.RichEmbed()
                .setTitle("Recherche Google")
                .setDescription('[Résultat de là recherche](https://www.google.fr/#q=' + suffix_google + ")")
                .setColor('#36393E')
                .setFooter("By Ilian ! ^^")
            message.channel.send(google_embed)
            console.log("J'ai rechercher!" + message.author.username + " !!");
        break;

        case "tradhelp":
            var tradhelp_embed = new Discord.RichEmbed()
                    .addBlankField()        
                    .addField(PREFIX + "tradenfr", "Traduction Anglais ==> Français !") 
                    .addField(PREFIX + "tradfren", "Traduction Français ==> Anglais !")
                    .addBlankField()
                    .addField(PREFIX + "tradesfr", "Traduction Espagnol ==> Français !")
                    .addField(PREFIX + "tradfres", "Taduction Français ==> Espagnol !")
                    .addBlankField()
                    .addField(PREFIX + "tradesen", "Traduction Espagnol ==> Anglais !")
                    .addField(PREFIX + "tradenes", "Taduction Anglais ==> Espagnol !")            
                .setColor("#00ffcc")
                .setFooter("Amuse toi a traduire petit enfant !")
                .setAuthor("Pannel des Traduction")
                .setDescription("Petit rappelle le, je vais seulement envoyé un liens google traduction !")
                .setTimestamp()
            message.delete()
            message.channel.send(tradhelp_embed)
            console.log("Il veut traduire " + message.author.username + " !")
        break;      
      
        case "tradenfr":
            let tradenfr = message.content.split(" ").slice(1);
            let suffix_tradenfr = tradenfr.join('%20')
            if(!suffix_tradenfr) return message.reply("Vous devez marquez un texte à traduire")
            var tradenfr_embed = new Discord.RichEmbed()
                .setTitle("Traduction Anglais -> Français")
                .setDescription('[Voir la Traduction](https://translate.google.fr/#en/fr/' + suffix_tradenfr + ')')
                .setColor("#36393E")
                .setFooter("By Ilian ! ^^")
            message.channel.send(tradenfr_embed)
            console.log("Traduction Anglais -> Français");
        break;
      
        case "tradfren":
            let tradfren = message.content.split(" ").slice(1);
            let suffix_tradfren = tradfren.join('%20')
            if(!suffix_tradfren) return message.reply("Vous devez marquez un texte à traduire")
            var tradfren_embed = new Discord.RichEmbed()
                .setTitle("Traduction Français -> Anglais")
                .setDescription('[Voir la Traduction](https://translate.google.fr/#fr/en/' + suffix_tradfren + ')')
                .setColor("#36393E")
                .setFooter("By Ilian ! ^^")
            message.channel.send(tradfren_embed)
            console.log("Traduction Français -> Anglais");
        break;
      
        case "tradesfr":
            let tradesfr = message.content.split(" ").slice(1);
            let suffix_tradesfr = tradesfr.join('%20')
            if(!suffix_tradesfr) return message.reply("Vous devez marquez un texte à traduire")
            var tradesfr_embed = new Discord.RichEmbed()
                .setTitle("Traduction Espagnol -> Français")
                .setDescription('[Voir la Traduction](https://translate.google.fr/#es/fr/' + suffix_tradesfr + ')')
                .setColor("#36393E")
                .setFooter("By Ilian ! ^^")
            message.channel.send(tradesfr_embed)
            console.log("Traduction Espagnol -> Français");
        break;
      
        case "tradfres":
            let tradfres = message.content.split(" ").slice(1);
            let suffix_tradfres = tradfres.join('%20')
            if(!suffix_tradfres) return message.reply("Vous devez marquez un texte à traduire")
            var tradfres_embed = new Discord.RichEmbed()
                .setTitle("Traduction Français -> Espagnol")
                .setDescription('[Voir la Traduction](https://translate.google.fr/#fr/es/' + suffix_tradfres + ')')
                .setColor("#36393E")
                .setFooter("By Ilian ! ^^")
            message.channel.send(tradfres_embed)
            console.log("Traduction Français -> Espagnol");
        break;      
      
        case "tradenes":
            let tradenes = message.content.split(" ").slice(1);
            let suffix_tradenes = tradenes.join('%20')
            if(!suffix_tradenes) return message.reply("Vous devez marquez un texte à traduire")
            var tradenes_embed = new Discord.RichEmbed()
                .setTitle("Traduction Anglais -> Espagnol")
                .setDescription('[Voir la Traduction](https://translate.google.fr/#en/es/' + suffix_tradenes + ')')
                .setColor("#36393E")
                .setFooter("By Ilian ! ^^")
            message.channel.send(tradenes_embed)
            console.log("Traduction Anglais -> Espagnol");      
        break;     

	    case "tradesen":
            let tradesen = message.content.split(" ").slice(1);
            let suffix_tradesen = tradesen.join('%20')
            if(!suffix_tradesen) return message.reply("Vous devez marquez un texte à traduire")
            var tradesen_embed = new Discord.RichEmbed()
                .setTitle("Traduction Espagnol -> Anglais")
                .setDescription('[Voir la Traduction](https://translate.google.fr/#es/en/' + suffix_tradesen + ')')
                .setColor("#36393E")
                .setFooter("By Ilian ! ^^")
            message.channel.send(tradesen_embed)
            console.log("Traduction Espagnol -> Anglais");
	    break;        

        case "new@":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
            message.delete()
            let staffs = message.content.split(" ");
            staffs.shift();
            var newm_embed = new Discord.RichEmbed()
                .setColor("#FF0000")
                    .addField("Annonce!", " "+ staffs.join(" "))
                .setFooter("By Ilian ! ^^")
            message.delete();
            message.guild.channels.find('name', "annonce").send(":arrow_down: <@&454375100326608897> :arrow_down: ")
            member.guild.channels.find("name", "annonce").send(newm_embed);
        break;
      
        case "new":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
            message.delete()
            let staff = message.content.split(" ");
            staff.shift();
            var new_embed = new Discord.RichEmbed()
                .setColor("#FF0000")
                    .addField("Annonce!", " "+ staff.join(" "))
                .setFooter("By Ilian ! ^^")
            message.delete();
            member.guild.channels.find("name", "annonce").send(new_embed);
        break;

        case "botinfo":
            var ping_embed = new Discord.RichEmbed()
                .addField(':clock2: Calcul en cours...', "Merci de patienter quelques instants !")
            let startTime = Date.now();
            message.channel.send(ping_embed).then(message => message.edit(botinfo_embed));
            var botinfo_embed = new Discord.RichEmbed()
                .setColor('#04B404')
                .setTitle('Mes informations :')
                    .addField("Serveurs :", "Je suis sur " + bot.guilds.array().length + " serveurs")
                    .addField("Membres :", "Je voit ``" + bot.users.size + " membres`` au total.")
                    .addField('Mon Ping :', ':ping_pong: Pong !')
                    .addField(":clock2: Temps :", `${Date.now() - startTime} millisecondes`, true)
                    .addField(":heartpulse: API Discord :", `${bot.ping} millisecondes`, true)
                .setTimestamp()
                .setFooter("By Ilian^^ !")
        break;

        case "propo":
            let suggest = message.content.split(" ").slice(1);
            let sugesstfix = suggest.join(" ")
            if (message.channel.name !== "🤖commande-bot🤖") return message.reply("Les commandes sont à effectuer dans le salon dans ``#🤖commande-bot🤖`` !")
            if (!sugesstfix) return message.reply("Merci d'écrire votre suggestions.")
            var propo_embed = new Discord.RichEmbed()
                .setColor("#36393E")
                    .addField(message.author.username + " - Proposition pseudo de : ", "``" + sugesstfix + "``")
                    .addField("--------------------", "Provenance du message : " + message.guild.name, true)
                .setThumbnail(message.guild.iconURL)
                .setTimestamp();
            message.delete()
            message.channel.send("**Propositions de pseudo envoyée avec succès** :white_check_mark: " + message.author.toString())
        message.client.users.get("193092758267887616").send(propo_embed)
        break;
    }
});

bot.login(process.env.TOKEN);
