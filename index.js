require('dotenv').config()
const crosspost = require('./modules/crosspost')
const Discord = require('discord.js');
const client = new Discord.Client();
var config = require('./config.json')
const announcementChannels = new Discord.Collection()
const readJson = require("./modules/jsonReader")
const RateLimiter = require('./modules/200iqratelimit.js')
const PQLib = require('./datastructures/PQ.js')
const queue = PQLib.PriorityQueue
const queueNode = PQLib.Node
var prefix = config.prefix
const globalRateLimiter = new RateLimiter(config.rate_limit, config.rate_time)
const globalQueue = new queue()


client.once('ready', () => {
    config.channels.forEach((channel) => {
        channel.rateLimiter = new RateLimiter(channel.rate_limit, config.rate_time)
        announcementChannels.set(channel.channel_id,channel)
    })
    console.log(announcementChannels)
    console.log('Ready!');
});

/*
		{
			"channel_id": 12345,
		//	"auto_publish": true,
			"publish_delay": 300,
		//	"rate_limit": 5,
		//	"rate_time": 3600,
            "priority": 0,
          //  "minMessageLength": 50
		},
*/

/*

  guildOnly
  global cooldown
  personlig cooldown
  helpMessage
  aliases
  prefix
  blacklisted channels
  whitelisted channels

*/

client.on('message', async message => {

    if (await handleCommand(message)) return;
    // Check if the channel is an announcement chanel, and if the bot sends messages automatically
    if(!message.channel.type == "news") return
    if(!announcementChannels.has(message.channel.id)) return

    // Check if the channel is enabled and if the message is long enough
    const channelConfig = announcementChannels.get(message.channel.id)

    if (!channelConfig.auto_publish) return
    if(message.embeds.length == 0 && message.content.length < channelConfig.minMessageLength) return

    //check if we are rate limited and add to queue if we are
    if(isRateLimited(message)) return globalQueue.enqueue(new queueNode(message,channelConfig.priority))
    //check if message in queue has higher priority
    if(globalQueue.peek() != undefined && globalQueue.peek().priority>channelConfig.priority) return postQueuedMessage()
    //if not rate limited publish message and increase count
    setTimeout(() => {
        publishMessage(message)
    },channelConfig.publish_delay)
});

/**
 * Handles and executes commands
 * @param {Message} message - The Discord message sent
 * @return - Returns true if it is a command, false otherwise
 */
async function handleCommand(message) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        return false;
    }
    if (!message.content.startsWith(prefix)) {
        return false;
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    switch (commandName) {
        case "reload":
            config = await readJson("./config.json");
            prefix = config.prefix
            config.channels.forEach((channel) => {
                let limiter
                if(announcementChannels.has(channel.channel_id)){
                    limiter = announcementChannels.get(channel.channel_id).rateLimiter
                } else {
                    limiter = new RateLimiter(channel.rate_limit, config.rate_time)
                }
                
                channel.rateLimiter = limiter
                announcementChannels.set(channel.channel_id, channel)
            })
            message.channel.send("reloaded")
            return true;
    }

    return false;
}


function postQueuedMessage(){
    const msg = globalQueue.peek()
    console.log(msg)
    if(msg != undefined && !isRateLimited(msg.value)) {
       publishMessage(globalQueue.dequeue().value) 
    }
}


function isRateLimited(message) {
    console.log(announcementChannels.get(message.channel.id).rateLimiter.isLimited())
    if (globalRateLimiter.isLimited()) return true;
    if (announcementChannels.get(message.channel.id).rateLimiter.isLimited()) return true;
    return false;
}


//we should probably check if queue contains more important messages before publishing current
async function publishMessage(message) {
    if (message.deleted) return;
    try {
        //const resp = await crosspost(message)
        message.channel.send("published")
       
        //client.channels.cache.get(config.log_channel_id).send("```"+resp+"```");
        globalRateLimiter.addEvent();
        announcementChannels.get(message.channel.id).rateLimiter.addEvent()
    } catch(e) {
        console.log(e)
        client.channels.cache.get(config.log_channel_id).send('Could not publish message\nError:\n```'+ e +'```')
    }
}



client.on('error',(e) => {
    console.log(e)
})

setInterval(postQueuedMessage,60000)



client.login(process.env.TOKEN);


/*

dev-log:
  publish_delay": 300,
  rate_limit": 5,
  rate_time": 3600,
  priority": 50,


vagt-kills: 
  publish_delay": 300,
  rate_limit": 5,
  rate_time": 3600,
  priority": 10

  */