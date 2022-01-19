//TO DO LIST//
/*
-add mob system
*/

//libraries
const Discord = require("discord.js");
const { MessageAttachement, MessageEmbed } = require('discord.js');
const Database = require("@replit/database");

//bot consts
const client = new Discord.Client({intents: [
  "GUILDS",
  "GUILD_MESSAGES",
  "GUILD_MEMBERS",
  "GUILD_MESSAGE_REACTIONS",
]});
const token = process.env['token_hashed_or_smt_idk_???'];

//database consts
const db = new Database();
const catagoryId = '929944416351846461'

//class
class User {
  constructor(id) {
    this.id = id;
    this.coins = 0;
    this.repExp = 0;
    this.gear = [];
    this.armor = [];
    this.items = [];
    this.quests = [];
    this.status = "none";
  }

  giveGear(name) {
    db.get("gear").then(gearList => {
      for (let i = 0; i < gearList.length; i++) {
        if (gearList[i].name == name) {
          this.gear.push(gearList[i]);

          db.get("users").then(users => {
            let buffer = users
            for (let j = 0; j < users.length; j++) {
              if (this.id == users[j].id) {
                buffer[j] = this
                db.set("users", buffer)
                return 0;
              }
            }
          })
        }
      }
    })
  }

  giveArmor(name) {
    db.get("armor").then(gearList => {
      for (let i = 0; i < gearList.length; i++) {
        if (gearList[i].name == name) {
          this.armor.push(gearList[i]);
          
          db.get("users").then(users => {
            let buffer = users
            for (let j = 0; j < users.length; j++) {
              if (this.id == users[j].id) {
                buffer[j] = this
                db.set("users", buffer)
                return 0;
              }
            }
          })
        }
      }
    })
  }

  giveItem(name, num) {
    db.get("items").then(gearList => {
      for (let i = 0; i < gearList.length; i++) {
        if (gearList[i].name == name) {
          for (let n = 0; n < num; n++) {
            this.items.push(gearList[i]);
          }  

          db.get("users").then(users => {
            let buffer = users
            for (let j = 0; j < users.length; j++) {
              if (this.id == users[j].id) {
                buffer[j] = this
                db.set("users", buffer)
                return 0;
              }
            }
          })
        }
      }
    })
  }
}

class Room {
  constructor(channel, pictureUrl) {
    this.mobs = []
    this.loot = []
    this.channel = channel;
    this.picture = pictureUrl;
  }

  replace(arg1, arg2) {
    this.mobs = arg1.slice(0);
    this.loot = arg2.slice(0);
  }
}

class Mob {
  constructor(name, hp, def, atk, roll, special) {
    this.roll = roll;
    this.name = name;
    this.hp = hp;
    this.def = def;
    this.atk = atk;
    this.roll = roll;
    this.special = special;
  }
}

class Gear {
  constructor(name, atk, critRate, critDmg, special) {
    this.name = name;
    this.atk = atk;
    this.critRate = critRate;
    this.critDmg = critDmg;
    this.special = special;
  }
}

class Armor {
  constructor(name, hp, def, critRate, critDmg, atk, special) {
    this.name = name;
    this.hp = hp;
    this.def = def;
    this.critRate = critRate;
    this.critDmg = critDmg;
    this.atk = atk;
    this.special = special;
  }
}

class Item {
  constructor(name) {
    this.name = name
  }
}

class Defining {
  constructor() {
    this.constructionId;
    this.sender;
    this.originalArgs = []
    this.args = [];
    this.altArgs = [];
  }

  nullify() {
    this.constructionId = null;
    this.sender = null;
    this.originalArgs = [];
    this.args = [];
    this.altArgs = [];
  }
}

//random
let defining = new Defining();
let hound = new Mob("Hound", 10, 0.2, 10, "x2", "none");
let woodSword = new Gear("Rod", 5, 0.1, 1.2, "none");
let raggyCloth = new Armor("Raggy Piece of Cloth", 20, 0.1, 0, 0.1, 0, "trash")
let almondWater = new Item("Alomnd Water")

//commands
function join(sender, channel) {
  db.get("users").then(function(users) {
    if (users != null) {
      for (let i = 0; i < users.length; i++) {
        if (users[i].id == sender.id) {
          channel.send(sender.user.tag + ", ur alr registed lmao")
          return 0;
        }
      }
    }
    
    let buffer = users;
    let newUser = new User(sender.id)

    new Promise((resolve, no) => {
      newUser.giveArmor("Raggy Piece of Cloth")
      newUser.giveArmor("Raggy Piece of Cloth")
      newUser.giveGear("Rod")
      newUser.giveItem("Alomnd Water", 3)
      resolve(0)
    }).then(() => {
      buffer.push(newUser);
      console.log("added")
      channel.send("welcome " + sender.user.tag + " to wtv this is");
      db.set("users", buffer);
    })
  })
} 

function help(msg) {
  new Promise((resolve, reject) => {
    const embeds = new MessageEmbed()
      .setColor('#421fc2')
      .setTitle('The Dice Rolling "Board Game"')
      .setDescription("Basic commands for this board game ig")
      .setThumbnail('https://i.imgur.com/dNDE2Oc.jpg')
      .addFields(
        { name: ';help', value: 'displays help menu'},
        { name: ';join', value: 'join the game'},
        { name: ';roomInfo', value: 'displays current room'},
        { name: ';plrInfo', value: 'displays your user profile'},
        { name: ';createRoom', value: 'creates new room (roles w/ perms only)'},
        { name: ';deleteRoom', value: 'deletes room (roles w/ perms only)'}
      )
    resolve(embeds);
  }).then(embeds => {
    msg.reply({ embeds: [embeds] });
  })
}

function createRoom1(roomName, sender, channel, arg1, arg2) {
  if(sender.permissions.has('MANAGE_CHANNELS') && roomName != null) {
    defining.constructionId = "room1";
    defining.sender = sender;
    defining.originalArgs.push(arg1);
    defining.originalArgs.push(arg2);
    channel.send('**What mobs would you like to add?**\n(send "end" to move on)')
  }
}

function createRoom2(roomName, sender, channel, guild) {
  if (sender.permissions.has('MANAGE_CHANNELS') && roomName != null) {
    defining.constructionId = "room2";
    defining.sender = sender;
    channel.send('**What loot would you like to add?**\n(send "end" to move on)')
  }
}

function createRoom3(roomName, sender, oldchannel, guild) {
  let buffer;
  new Promise(function(resolve, reject) {
    guild.channels.create(defining.originalArgs[0]).then(channel => {          
      channel.setParent(catagoryId)
      db.get("rooms").then((rooms) => {
        buffer = rooms
        buffer.push(new Room(channel, defining.originalArgs[1]))

        buffer[buffer.length - 1].replace(defining.args.slice(0), defining.altArgs.slice(0))
        db.set("rooms", buffer)
        resolve(channel);
      }) 
    })
  }).then(channel => {
    defining.nullify()
    channel.send("**Room Created!**")
    channel.send(";roomInfo")
  })
}

function deleteRoom(sender, roomName, guild) {
  if (sender.permissions.has('MANAGE_CHANNELS') && roomName != null) {
    db.get("rooms").then(rooms => {
      for (let i = 0; i < rooms.length; i++) {
        if(rooms[i].channel.name == roomName) {
          let buffer = rooms;
          const fetchedChannel = guild.channels.cache.get(rooms[i].channel.id);
          buffer.splice(i, 1)
          fetchedChannel.delete();  
          db.set("rooms", buffer)
        }
      }
    })
  }
}

function roomInfo(msg, channel) {
  db.get("rooms").then((rooms) => {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].channel.id == channel.id) {
        let mobBuffer = ''
        let lootBuffer = ''
        for (let j = 0; j < rooms[i].mobs.length; j++) {
          mobBuffer += (rooms[i].mobs[j] + "\n");
        }
        for (let j = 0; j < rooms[i].loot.length; j++) {
          lootBuffer += (rooms[i].loot[j] + "\n   ");
        }
        const embeds = new MessageEmbed()
          .setColor('#421fc2')
          .setTitle(rooms[i].channel.name)
          .setDescription("litterally a room in this board game")
          //.setThumbnail(rooms[i].picture)
          .addFields(
            { name: 'Mobs', value: mobBuffer, inline: true },
            { name: 'Loot', value: lootBuffer, inline: true },
          )
          .setImage(rooms[i].picture)
        
        msg.channel.send({ embeds: [embeds] });
        return;
      } 
    }
  })
}

function plrInfo(msg, sender) {
  db.get("users").then(users => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == sender.id) {
        let itemBuffer = '';
        for (let j = 1; j < users[i].gear.length; j++) {
          itemBuffer += users[i].gear[j].name + "\n"
        }
        for (let j = 2; j < users[i].armor.length; j++) {
          itemBuffer += users[i].armor[j].name + "\n"
        }
        for (let j = 0; j < users[i].items.length; j++) {
          itemBuffer += users[i].items[j].name + "\n"
        }
        const embeds = new MessageEmbed()
          .setColor('#421fc2')
          .setTitle(msg.author.username)
          .setDescription(msg.author.username + "'s profile. Every player must have one, as it shows what they own as well as the items they have managed to obtain throughout their deep ventures into the abyss.")
          .setThumbnail(msg.author.displayAvatarURL())
          .addFields(
            { name: 'Weapon', value: users[i].gear[0].name, inline: true },
            { name: 'Armor', value: users[i].armor[0].name, inline: true },
            { name: 'Armor', value: users[i].armor[1].name, inline: true },
            { name: 'Items', value: itemBuffer }
          )
          .setFooter(
            { text: 'Coins: ' + users[i].coins, 
              iconURL: 'https://static.wikia.nocookie.net/gensin-impact/images/8/84/Item_Mora.png/revision/latest?cb=20210106073715' }
          )
          
        msg.channel.send({ embeds: [embeds] });
      }
    }
  })
}

//events
client.on("ready", function() {
  //db.set("users", [new User('782784524991725571')])
  //db.set("rooms", [])
  //db.set("gear", [woodSword])
  //db.set("armor", [raggyCloth])
  //db.set("items", [almondWater])
  console.log(`${client.user.tag} is ready`);
})

client.on("messageCreate", function(msg) {
  if (msg.content.charAt(0) == ";") {
    splitArgs = msg.content.split(" ");
    sender = msg.member
    command = splitArgs[0];
    channel = msg.channel;
    guild = msg.guild;
    
    //normal commands
    command = command.toLowerCase();
    switch(command) {
      case ";join":
        join(sender, channel);
        break;

      case ";help":
        help(msg);
        break;

      case ";roominfo":
        roomInfo(msg, channel);
        break;

      case ";createroom":
        if (defining.constructionId == null) {
          createRoom1(splitArgs[1], sender, channel, splitArgs[1], splitArgs[2])
        } else {
          msg.reply("someone else is constructing, please don't overload me ;-; i run on \"REPLIT\" SERVERS")
        }
        break;

      case ";deleteroom":
        deleteRoom(sender, splitArgs[1], guild);
        break;

      case ";plrinfo":
        plrInfo(msg, sender);
        break;
      
      default:
        channel.send("not a command");
    }
  }

  //construction args
  else if (defining.sender == msg.member) {
    if (msg.content == "end") {
      switch(defining.constructionId) {
        case "room1":
          createRoom2(splitArgs[1], sender, channel, guild)
          break;

        case "room2":
          createRoom3(splitArgs[1], sender, channel, guild)
        break;

        default:
          console.error("idk what happened")
      }
    } 
    else {
      switch(defining.constructionId) {
        case "room1":
          defining.args.push(msg.content)
          break;

        case "room2":
          defining.altArgs.push(msg.content)
          break;

        default:
          console.error("idk what happened")
      }
    }
  }
})
//login bot
client.login(token);
