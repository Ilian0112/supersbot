const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const PREFIX = ".";
const queue = new Map();
const EVERYONE = "@";

var client = new Discord.Client();

var bot = new Discord.Client();

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
    bot.user.setGame("SupersBOT V1 - .help |", "https://www.twitch.tv/supers_fanne")
    bot.user.setUsername("SupersBOT - V1")
    console.log("SupersBOT V1 - Connecté");
});

bot.on('message', function(message) {

        if(message.content === 'Salut') {
            message.reply('Bonjour')
        }

        if(message.content === 'salut') {
            message.reply('Bonjour')
        }

        if(message.content === 'Ilian') {
            message.channel.sendMessage("On ne juge mon **développeur **! :o")
        }

        if(message.content === 'ilian') {
            message.channel.sendMessage("On ne juge mon **développeur** ! :o")
        }

        if(message.content === 'ça va') {
            message.channel.sendMessage("Je vais toujours bien, je suis un robot!")
        }
            
        if(message.content === 'Ça va') {
            message.channel.sendMessage("Je vais toujours bien, je suis un robot!")
        }

        if(message.content === 'Qui est la') {
            message.channel.sendMessage("MOIII")
        
        }
        if(message.content === 'Bye') {
            message.channel.sendMessage('À Bientôt ! ^^')
        
        }
        if(message.content === 'bye') {
            message.channel.sendMessage('À Bientôt ! ^^')
        }

        if(message.content === 'wsh') {
            message.channel.sendMessage('wshh frr')
        }
    
        if(message.content === 'Wsh') {
            message.channel.sendMessage('wshh frr')
        }
    
    
    });

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "📄logs📄").sendMessage(member.toString() + " Bienvenue sur le discord de **Supers Fanne** ! :white_check_mark:");
    member.addRole(member.guild.roles.find("name", "Abonné ?"));
});

bot.on("guildMemberRemove", function(member) {
     member.guild.channels.find("name", "📄logs📄").sendMessage(member.toString() + " Bye bye!" + member.toString() + " :x:");
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

    var roleJoueur= member.guild.roles.find("name", "Abonné")
    
    var roleMute = member.guild.roles.find("name", "Mute")
    
    var modlog = member.guild.channels.find("name", "📄logs📄")
    
    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
             message.channel.sendMessage("[SupersBOT Musique] - Vous devez mettre un lien.");   
             return;
            }
            if(!message.member.voiceChannel) {
             message.channel.sendMessage("[SupersBOT Musique] - Vous devez être dans un salon vocal.");   
             return;
            }
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            
            var server = servers[message.guild.id];
      
            server.queue.push(args[1]);
            
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
               play(connection, message) 
            });
        break;    
      
        case "skip":
             if(!message.member.voiceChannel) {
             message.channel.sendMessage("[SupersBOT Musique] - Vous devez être dans un salon vocal.");   
             return;
            }
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
        break;    
      
        case "stop":
             if(!message.member.voiceChannel) {
             message.channel.sendMessage("[SupersBOT Musique] - Vous devez être dans un salon vocal.");   
             return;
            }
             const serverQueue = queue.get(message.guild.id);
             var server = servers[message.guild.id];
             if (!serverQueue) return message.channel.send("[SupersBOT Musique] - Aucune musique est joué, je ne peux donc pas exécuter cette commande. ❌")
            if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
     
        break;    
        case "membres":
            message.reply("Nous sommes " + bot.users.size + " membres sur le discord !");
        break
        case "unmute":
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
        if(!modlog) return message.reply("Je ne trouve pas de channel log.");
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je retire la sanction: MUTE ?")
        member.removeRole(roleMute)
        message.channel.sendMessage(user.toString() + " a bien été unmute ✅")
        
        var embed = new Discord.RichEmbed()
        .addField("Commande :", "UNMUTE")
        .addField("Utilisateur :", user.username)
        .addField("Modérateur :", message.author.username)
        .addField("Heure:", message.channel.createdAt)
        .setColor("#3333cc")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
        break;
        case "mute":
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
        if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
        if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: MUTE")
        message.channel.sendMessage(member.toString() + " a bien été mute. ✅")
        member.addRole(roleMute)

        var embed = new Discord.RichEmbed()
        .addField("Action :", "Mute")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reasontimed)
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
        break;
        case "shelp":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
        var embed = new Discord.RichEmbed()
            .addField(".ban", "Cette commande permet de bannir un utilisateur ! Pour l'utiliser, faites .ban @(utilisateur) + (raison)")
            .addField(".kick", "Cette commande permet de kick un utilisateur ! Pour l'utiliser, faites .kick @(utilisateur) + (raison)")
             .addField(".purge", "Cette commande permet de supprimé des messages beaucoup plus rapidement ! Pour l'utiliser, faites .purge (nombredemessages)")
             .addField(".mute", "Cette commande permet de muté un utilisateur pendant un certain temps. Pour l'utiliser, faites .mute @(utilisateur) + (raison)")
             .addField(".unmute", "Cette commande permet d'unmute un utilisateur. Pour l'utiliser, faites .unmute @(utilisateur)")
            .setColor("#cc0000")
            .setFooter("Aide du staff.")
            .setAuthor("Pannel d'aide du staff")
            .setDescription("Voici les commandes du staff !")
            .setTimestamp()
            message.delete()
            message.channel.sendEmbed(embed)
        break;    
        
        case "help":
            var embed = new Discord.RichEmbed()
                 .addField(".ping", "Grâce à cette commande, tu pourras savoir ton ping !") 
                 .addField(".reseau", "Vous donne mes réseaux sociaux !")
                 .addField(".play", "Jouer une musique !  Pour l'utiliser, faites .play (lien) !")
                 .addField(".skip", "Sauter une musique  Pour l'utiliser, faites .skip !")
                 .addField(".stop", "Arreter la musique  Pour l'utiliser, faites .stop !")
                 .addField(".google", "Commande pas trop utile mais tu peut faire des recherche google. Pour l'utiliser, faites .google (recherche) !")
                 .addField(".shelp", "❌Afficher les commandes du staff. Mais seule ceux qui ont la perm de kick pourrons y accèder. ❌")
                .setColor("#0000ff")
                .setFooter("Idée de commande ? Proposer en MP!")
                .setAuthor("Pannel d'aide")
                .setDescription("Voici les commandes du bot !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
            break;
        case "kick":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");
            if (reason.length < 1) return message.reply("Tu as oublié la raison ! :D");
            if (message.mentions.users.size < 1) return message.reply("Tu n'as pas mis son pseudo au complet ! :o")
            message.guild.member(user).kick();
            message.channel.send(user.toString() + " a bien été kick ✅")

            var embed = new Discord.RichEmbed()
            .addField("Commande :", "KICK")
            .addField("Utilisateur :", user.username)
            .addField("Modérateur :", message.author.username)
            .addField("Raison : ", reason)
            .addField("Heure:", message.channel.createdAt)
            .setColor("#99ff33")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTimestamp()
            member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
            bot.channels.get('429665350922141716').sendMessage(":white_check_mark: Le joueur " + user.username + " à bien été kick pour: " + reason);
       
            message.delete();
            break;
        case "ban":
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande.");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");
            if (reason.length < 1) return message.reply("Tu as oublié la raison.");
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser qui je dois bannir..")
            
            message.guild.ban(user, 2);
            message.channel.send(user.toString() + " a bien été banni ✅")

            var embed = new Discord.RichEmbed()
            .addField("Commande :", "BAN")
            .addField("Utilisateur :", user.username)
            .addField("Modérateur :", message.author.username)
            .addField("Raison : ", reason)
            .addField("Heure:", message.channel.createdAt)
            .setColor("#ff9933")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTimestamp()
            member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
            
            bot.channels.get('429665350922141716').sendMessage(":white_check_mark: Le joueur " + user.username + " à bien été kick pour: " + reason);
            
            message.delete();
            break;
        case "purge":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
            var embed = new Discord.RichEmbed()
            .addField("Commande :", "PURGE")
            .addField("Modérateur :", message.author.username)
            .addField("Message supprimé", messagecount)
            .addField("Heure:", message.channel.createdAt)
            .setColor("#009999")
            .setFooter("Ouf ! Sa as fait un bon ménage dans le serveur ! ^^")
            message.delete()
            member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
            break;


       case "reseau":
       message.reply('❌**DESACTIVER**❌');
       message.delete();
       break;

       case "ping":
        message.channel.sendMessage("Pong! Tu as actuellement `" + bot.ping + " ms !` :D");
        message.delete();
        break; 
            
       case "google":
        let args = message.content.split(' ');
        args.shift();
        console.log("J'ai rechercher!");
        message.reply('https://www.google.fr/#q=' + args.join('%20'));
        break;

       case "web":
           if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
         let annonce = message.content.split(" ");
         annonce.shift();
       var embed = new Discord.RichEmbed()
       .addField("Annonce !", " "+ annonce.join(" "))
       .setColor("#336699")
       .setFooter("By Ilian ! ^^")
       message.delete();
       message.channel.send("@everyone Nouvelle annonce")
       member.guild.channels.find("name", "🔔annonce").sendEmbed(embed);
       break;

     case "newstaff":
         if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
     let staff = message.content.split(" ");
     staff.shift();
   var embed = new Discord.RichEmbed()
   .addField("Annonce!", " "+ staff.join(" "))
   .setColor("#FF0000")
   .setFooter("By Ilian ! ^^")
   message.delete();
   message.channel.send("@everyone Nouvelle annonce")
   member.guild.channels.find("name", "📍staff📍").sendEmbed(embed);
   break;


        default:
            message.channel.sendMessage("Commande invalide ^^ Fait .help pour voir toutes les commandes disponibles !")
            message.delete();
    }
});

bot.login('NDM2Mjc0MTIzNzIzODk4ODgx.Db4POQ.cHfs_qL8dGYTDykFpgvHIvCO6tA');