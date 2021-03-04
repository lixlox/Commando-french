const { stripIndents, oneLine } = require("common-tags");
const Command = require("../base");

module.exports = class PrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: "prefix",
      group: "util",
      memberName: "prefix",
      description: "Affiche ou modifie le préfixe de commandes.",
      format: '[prefix/"default"/"none"]',
      details: oneLine`
				Si aucun préfixe n'est fournis, le préfixe actuel va être affiché.
				Si le préfixe est "default", le préfixe va être réinitialisé au préfixe par défaut du bot.
				Si le préfixe est "none", le préfixe va être entièrement être supprimé, autorisant seulement les mentions d'executer les commandes.
				Seul les administrateurs peuvent changer le préfixe.
			`,
      examples: [
        "prefix",
        "prefix -",
        "prefix omg!",
        "prefix default",
        "prefix none",
      ],

      args: [
        {
          key: "prefix",
          prompt: "Quel préfixe voulez vous attribuer au bot ?",
          type: "string",
          max: 15,
          default: "",
        },
      ],
    });
  }

  async run(msg, args) {
    // Just output the prefix
    if (!args.prefix) {
      const prefix = msg.guild
        ? msg.guild.commandPrefix
        : this.client.commandPrefix;
      return msg.reply(stripIndents`
				${
          prefix
            ? `Le préfixe de commandes est \`${prefix}\`.`
            : "Il n'y a pas de préfixe de commande."
        }
				Pour executer des commandes, utilisez ${msg.anyUsage("command")}.
			`);
    }

    // Check the user's permission before changing anything
    if (msg.guild) {
      if (
        !msg.member.hasPermission("ADMINISTRATOR") &&
        !this.client.isOwner(msg.author)
      ) {
        return msg.reply(
          "Seul les administrateurs peuvent modifier le préfixe de commandes."
        );
      }
    } else if (!this.client.isOwner(msg.author)) {
      return msg.reply(
        "Seul les propriétaires du bot peuvent changer le préfixe de commandes global."
      );
    }

    // Save the prefix
    const lowercase = args.prefix.toLowerCase();
    const prefix = lowercase === "none" ? "" : args.prefix;
    let response;
    if (lowercase === "default") {
      if (msg.guild) msg.guild.commandPrefix = null;
      else this.client.commandPrefix = null;
      const current = this.client.commandPrefix
        ? `\`${this.client.commandPrefix}\``
        : "pas de préfixe";
      response = `Le préfixe de commandes a été réinitialisé à la valeur par défaut (actuellement ${current}).`;
    } else {
      if (msg.guild) msg.guild.commandPrefix = prefix;
      else this.client.commandPrefix = prefix;
      response = prefix
        ? `Le préfixe de commandes est maintenant \`${args.prefix}\`.`
        : "Le préfixe de commande à été complètement supprimé.";
    }

    await msg.reply(
      `${response} Pour executer des commandes, utilisez ${msg.anyUsage(
        "command"
      )}.`
    );
    return null;
  }
};
