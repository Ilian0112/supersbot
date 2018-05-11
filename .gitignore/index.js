const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const PREFIX = "s.";
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
    bot.user.setGame("SupersBOT V2 - s.help |", "https://www.twitch.tv/supers_fanne")
    bot.user.setUsername("SupersBOT - V2")
    console.log("SupersBOT V2 - Connecté");
});

bot.on('message', function(message) {

        if(message.content === 'Salut') {
            message.reply('Bonjour')
         console.log("Bonjour " + message.author.username + " !")
        }

        if(message.content === 'salut') {
            message.reply('Bonjour')
         console.log("Bonjour " + message.author.username + " !")
        }
 
        if(message.content === 'Ilian') {
            message.channel.sendMessage("On ne juge mon **développeur **! :o")
         console.log("On ne juge mon dev " + message.author.username + " !")
        }

        if(message.content === 'ilian') {
            message.channel.sendMessage("On ne juge mon **développeur** ! :o")
         console.log("On ne juge mon dev " + message.author.username + " !")
        }
   

        if(message.content === 'ça va') {
            message.channel.sendMessage("Je vais toujours bien, je suis un robot!")
         console.log("Comment va tu " + message.author.username + " ?")
        }
            
        if(message.content === 'Ça va') {
            message.channel.sendMessage("Je vais toujours bien, je suis un robot!")
         console.log("Comment va tu " + message.author.username + " ?")
        }

        if(message.content === 'Qui est la') {
            message.channel.sendMessage("MOIII")
          console.log("Je suis la " + message.author.username + " !")
        }
        if(message.content === 'Bye') {
            message.channel.sendMessage('À Bientôt ! ^^')
         console.log("Bye " + message.author.username + " !")
        
        }
        if(message.content === 'bye') {
            message.channel.sendMessage('À Bientôt ! ^^')
         console.log("Bye " + message.author.username + " !")
        }

        if(message.content === 'wsh') {
            message.channel.sendMessage('wshh frr')
          console.log("Wshh " + message.author.username + " !")
        }
    
        if(message.content === 'Wsh') {
            message.channel.sendMessage('wshh frr')
         console.log("Wshh " + message.author.username + " !")
        }
    
        if(message.content === 'Ta mère la grosse pute') {
            message.reply('Surveille ton language jeune insolents !')
            message.delete()
           console.log("C'est quoi ce language " + message.author.username + " !")
        }

    });

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "🤖bot-logs🤖").sendMessage(member.toString() + " Bienvenue sur ``" + message.guild.name + "`` ! :white_check_mark:");
    member.addRole(member.guild.roles.find("name", "Abonné ?"));
});

bot.on("guildMemberRemove", function(member) {
     member.guild.channels.find("name", "🤖bot-logs🤖").sendMessage(member.toString() + " Bye bye!" + member.toString() + " :x:");
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

    var roleAbo = member.guild.roles.find("name", "Abonné ?")

    var roleJoueur= member.guild.roles.find("name", "Abonné ?")
    
    var roleMute = member.guild.roles.find("name", "Mute")
    
    var modlog = member.guild.channels.find("name", "🤖bot-logs🤖")
    
    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
             message.channel.sendMessage("[```SupersBOT Musique```] - **Vous devez mettre un lien**.");   
             return;
            }
            if(!message.member.voiceChannel) {
             message.channel.sendMessage("[```SupersBOT Musique```] - **Vous devez être dans un salon vocal**.");   
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
          console.log("Ouais de la musique " + message.author.username + " !")
        break;    
      
        case "stop":
             if(!message.member.voiceChannel) {
             message.channel.sendMessage("[```SupersBOT Musique```] - **Vous devez être dans un salon vocal**.");   
             return;
            }
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
          console.log("Oh plus de musique " + message.author.username + " !")
        break;    
      
        case "membres":
            message.reply("Nous sommes``" + message.guild.memberCount + " membres`` sur le discord !");
        console.log("Tu sais qu'on combien on est maintenant " + message.author.username + " !( " + message.guild.memberCount + " )")
        break
        
        case "unmute":
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
        if(!modlog) return message.reply("Je ne trouve pas de channel log.");
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je retire la sanction: MUTE ?")
        member.removeRole(roleMute)
        message.channel.sendMessage(user.toString() + " a bien été unmute ✅")
       console.log("Tu a unmute quelqu'un toi " + message.author.username + " !")  
      
        var embed = new Discord.RichEmbed()
        .addField("Commande :", "unmute")
        .addField("Utilisateur :", user.username)
        .addField("Modérateur :", message.author.username)
        .addField("Heure:", message.channel.createdAt)
        .setColor("#3333cc")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "🤖bot-logs🤖").sendEmbed(embed);
        break;
       
    case "removeabo?":
    member.removeRole(roleAbo)
    message.reply("à bien enlever son role Abonné ? ✅")
    break;

      case "mute":
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
        if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
        if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: MUTE")
        message.channel.sendMessage(member.toString() + " a bien été mute. ✅")
        member.addRole(roleMute)
       console.log("Tu a mute quelqu'un toi " + message.author.username + " !")
             
        var embed = new Discord.RichEmbed()
        .addField("Action :", "Mute")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reasontimed)
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "🤖bot-logs🤖").sendEmbed(embed);
        break;

        case "shelp":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
        var embed = new Discord.RichEmbed()
            .addField("s.ban", "Cette commande permet de bannir un utilisateur ! Pour l'utiliser, faites .ban @(utilisateur) + (raison)")
            .addField("s.kick", "Cette commande permet de kick un utilisateur ! Pour l'utiliser, faites .kick @(utilisateur) + (raison)")
            .addField("s.unban", "Cette commande permet de unban un utilisateur ! Pour l'utiliser, faites .unban @(utilisateur)")
            .addField("s.unkick", "Cette commande permet de unkick un utilisateur ! Pour l'utiliser, faites .unkick @(utilisateur)")
             .addField("s.purge", "Cette commande permet de supprimé des messages beaucoup plus rapidement ! Pour l'utiliser, faites .purge (nombredemessages)")
             .addField("s.mute", "Cette commande permet de muté un utilisateur pendant un certain temps. Pour l'utiliser, faites .mute @(utilisateur) + (raison)")
             .addField("s.unmute", "Cette commande permet d'unmute un utilisateur. Pour l'utiliser, faites .unmute @(utilisateur)")
            .setColor("#cc0000")
            .setFooter("Aide du staff.")
            .setAuthor("Pannel d'aide du staff")
            .setDescription("Voici les commandes du staff !")
            .setTimestamp()
            message.delete()
            message.channel.sendEmbed(embed)
             console.log("AIDE STAFF " + message.author.username + " !")
        break;    
        
        case "help":
            var embed = new Discord.RichEmbed()
                 .addField("s.ping", "Grâce à cette commande, tu pourras savoir mon ping !") 
                 .addField("s.reseau", "Vous donne mes réseaux sociaux !")
                 .addField("s.play", "Jouer une musique !  Pour l'utiliser, faites .play (lien) !")
                 .addField("s.skip", "Sauter une musique  Pour l'utiliser, faites .skip !")
                 .addField("s.stop", "Arreter la musique  Pour l'utiliser, faites .stop !")
                 .addField("s.traductionhelp", "Pour affichier l'aide des traductions !")
                 .addField("s.google", "Commande pas trop utile mais tu peut faire des recherche google. Pour l'utiliser, faites .google (recherche) !")
                 .addField("s.shelp", "❌Afficher les commandes du staff. Mais seule ceux qui ont la perm de kick pourrons y accèder. ❌")
                .setColor("#0000ff")
                .setFooter("Idée de commande ? Proposer en MP!")
                .setAuthor("Pannel d'aide")
                .setDescription("Voici les commandes du bot !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
             console.log("Ta eu besoin d'aide toi " + message.author.username + " !")
            break;
       
      case "kick":
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
        if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
        if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: kick")
        message.channel.sendMessage(member.toString() + " a bien été kick. ✅")
        member.addRole(rolekick)
       console.log("Tu a kick quelqu'un toi " + message.author.username + " !")
             
        var embed = new Discord.RichEmbed()
        .addField("Action :", "Kick")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reasontimed)
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "🤖bot-logs🤖").sendEmbed(embed);
      
         var embed = new Discord.RichEmbed()
        .addField("Action :", "Kick")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reasontimed)
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "kick").sendEmbed(embed);
        break;

      case "unkick":
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
        if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
        if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je dois enlevé la sanction: kick")
        message.channel.sendMessage(member.toString() + " a bien été unkick. ✅")
        member.removeRole(rolekick)
       console.log("Tu a unkick quelqu'un toi " + message.author.username + " !")
             
        var embed = new Discord.RichEmbed()
        .addField("Action :", "unKick")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reasontimed)
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "🤖bot-logs🤖").sendEmbed(embed);
        break;


      case "ban":
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
        if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
        if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: Ban")
        message.channel.sendMessage(member.toString() + " a bien été ban. ✅")
        member.addRole(roleban)
       console.log("Tu a b n quelqu'un toi " + message.author.username + " !")
             
        var embed = new Discord.RichEmbed()
        .addField("Action :", "Bannissement")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reasontimed)
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "🤖bot-logs🤖").sendEmbed(embed);
      
         var embed = new Discord.RichEmbed()
        .addField("Action :", "Bannissement")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reasontimed)
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "ban").sendEmbed(embed);
        break;
       
      case "ban":
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
        if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
        if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je enlevé mettre la sanction: Ban")
        message.channel.sendMessage(member.toString() + " a bien été ban. ✅")
        member.removeRole(roleban)
       console.log("Tu a unban quelqu'un toi " + message.author.username + " !")
             
        var embed = new Discord.RichEmbed()
        .addField("Action :", "UnBan")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reasontimed)
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "🤖bot-logs🤖").sendEmbed(embed);
        break;       

     case "purge":
            if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
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
            member.guild.channels.find("name", "🤖bot-logs🤖").sendEmbed(embed);
             console.log("Tu a purge un salon toi " + message.author.username + " !")
            break;


       case "reseau":
            var embed = new Discord.RichEmbed()
                 .addField("Instagram", "A VENIR. ") 
                 .addField("Twitter", "A VENIR.")
                 .addField("Facebook", "A VENIR.")
                .setFooter("By Ilian")
                .setAuthor("Réseaux Sociaux De Supers Fanne")
                .setDescription("Pour l'actualité !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
    console.log("Mes reseau " + message.author.username + " !")
       break;

       case "ping":
            var ping_embed = new Discord.RichEmbed()
                .addField(':clock2: Calcul en cours...', "Merci de patienter quelques instants !")
            let startTime = Date.now();
            message.channel.send(ping_embed).then(message => message.edit(pong_embed));
            const fs = require("fs");
            var pong_embed = new Discord.RichEmbed()
                .setColor('#FFFFFF')
                .setTitle(':ping_pong: Pong !')
                .addField(":clock2: Temps :", `${Date.now() - startTime} millisecondes`, true)
                .addField(":heartpulse: API Discord :", `${bot.ping} millisecondes`, true)
        break; 
    
       case "google":
        let glg = message.content.split(' ');
        glg.shift();
        console.log("J'ai rechercher!" + message.author.username + " !!");
        message.reply('https://www.google.fr/#q=' + glg.join('%20'));
        break;

        case "traductionhelp":
            var embed = new Discord.RichEmbed()
                 .addField("s.tradenfr", "Traduction Anglais ==> Français !") 
                 .addField("s.tradfren", "Traduction Français ==> Anglais !")
                 .addField("s.tradesfr", "Traduction Espagnol ==> Français !")
                 .addField("s.tradfres", "Taduction Français ==> Espagnol !")
                 .addField("s.tradesen", "Traduction Espagnol ==> Anglais !")
                 .addField("s.tradenes", "Taduction Anglais ==> Espagnol !")            
                .setColor("#00ffcc")
                .setFooter("Amuse toi a traduire petit enfant !")
                .setAuthor("Pannel des Traduction")
                .setDescription("Petit rappelle le, je vais seulement envoyé un liens google traduction !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
             console.log("Il veut traduire " + message.author.username + " !")
            break;      
      
       case "tradenfr":
        let tradenfr = message.content.split(' ');
        tradenfr.shift();
        console.log("Traduction Anglais ==> Français");
        message.reply('https://translate.google.fr/#en/fr/' + tradenfr.join('%20'));
        break;
      
        case "tradfren":
         let tradfren = message.content.split(' ');
         tradfren.shift();
         console.log("Traduction Français ==> Anglais");
         message.reply('https://translate.google.fr/#fr/en/' + tradfren.join('%20'));
         break;
      
        case "tradesfr":
         let tradesfr = message.content.split(' ');
         tradesfr.shift();
         console.log("Traduction Espagnol ==> Français");
         message.reply('https://translate.google.fr/#es/fr/' + tradesfr.join('%20'));
         break;
      
        case "tradfres":
         let tradfres = message.content.split(' ');
         tradfres.shift();
         console.log("Traduction Français ==> Espagnol");
         message.reply('https://translate.google.fr/#fr/es/' + tradfres.join('%20'));
         break;      
      
        case "tradenes":
         let tradenes = message.content.split(' ');
         tradenes.shift();
         console.log("Traduction Anglais ==> Espagnol");
         message.reply('https://translate.google.fr/#en/es/' + tradesen.join('%20'))
         break;     
   
     case "new@":
         if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
     let staffs = message.content.split(" ");
     staffs.shift();
   var embed = new Discord.RichEmbed()
   .addField("Annonce!", " "+ staffs.join(" "))
   .setColor("#FF0000")
   .setFooter("By Ilian ! ^^")
   message.delete();
   message.channel.send("@everyone Nouvelle annonce")
   member.guild.channels.find("name", "annonce").sendEmbed(embed);
   break;
      
           case "new":
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
   member.guild.channels.find("name", "annonce").sendEmbed(embed);
   break;
      
        default:
            message.channel.sendMessage("Commande invalide ^^ Fait .help pour voir toutes les commandes disponibles !")
            message.delete();
    }
});

bot.login('NDM2Mjc0MTIzNzIzODk4ODgx.Db4aDg.FR8Wq-smMOWTiOQrr21mM0vsCAQ');
