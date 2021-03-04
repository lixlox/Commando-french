const { oneLine } = require("common-tags");
const Command = require("../base");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      group: "util",
      memberName: "ping",
      description: "Vérifie le ping du bot vers le serveur Discord.",
      throttling: {
        usages: 5,
        duration: 10,
      },
    });
  }

  async run(msg) {
    const pingMsg = await msg.reply("En train de ping...");
    return pingMsg.edit(oneLine`
			${msg.channel.type !== "dm" ? `${msg.author},` : ""}
			Pong! L'aller retour de message a pris ${
        (pingMsg.editedTimestamp || pingMsg.createdTimestamp) -
        (msg.editedTimestamp || msg.createdTimestamp)
      }ms.
			${
        this.client.ws.ping
          ? `Le battement de coeur est de ${Math.round(this.client.ws.ping)}ms.`
          : ""
      }
		`);
  }
};
