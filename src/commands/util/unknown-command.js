const Command = require("../base");

module.exports = class UnknownCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unknown-command",
      group: "util",
      memberName: "unknown-command",
      description:
        "Affiche une information d'aide lorsqu'une commande inconnue est utilisée.",
      examples: ["unknown-command kickeverybodyever"],
      unknown: true,
      hidden: true,
    });
  }

  run(msg) {
    return msg.reply(
      `Commande inconnue. Utilisez ${msg.anyUsage(
        "help",
        msg.guild ? undefined : null,
        msg.guild ? undefined : null
      )} pour voir la liste des commandes.`
    );
  }
};
