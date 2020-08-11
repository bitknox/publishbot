const fetch = require('node-fetch');

async function crosspost(message){
    return await fetch(
        `https://discord.com/api/v6/channels/${message.channel.id}/messages/${message.id}/crosspost`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bot ${process.env.TOKEN}`,
          },
        }
      )
}

module.exports = crosspost