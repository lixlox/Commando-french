const { oneLine } = require("common-tags");
const Command = require("../base");

module.exports = class DisableCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: "desactiver",
      aliases: ["disable", "desactiver-commande", "cmd-off", "command-off"],
      group: "commands",
      memberName: "desactiver",
      description: "Désactiver une commande ou un groupe de commandes.",
      details: oneLine`
				L'argument doit être le nom/identifiant (partiel ou complet) d'une commande ou d'un groupe de commandes.
				Seul les administrateurs peuvent utiliser cette commande.
			`,
      examples: ["desactiver util", "desactiver Utilité", "desactiver prefixe"],
      guarded: true,

      args: [
        {
          key: "cmdOrGrp",
          label: "command/group",
          prompt: "Quelle commande ou groupe voulez-vous désactiver ?",
          type: "group|command",
        },
      ],
    });
  }

  hasPermission(msg) {
    if (!msg.guild) return this.client.isOwner(msg.author);
    return (
      msg.member.permissions.has("ADMINISTRATOR") ||
      this.client.isOwner(msg.author)
    );
  }

  run(msg, args) {
    if (!args.cmdOrGrp.isEnabledIn(msg.guild, true)) {
      return msg.reply(
        `${args.cmdOrGrp.group ? "La commande" : "Le groupe"} \`${
          args.cmdOrGrp.name
        }\` est déjà désactivé.`
      );
    }
    if (args.cmdOrGrp.guarded) {
      return msg.reply(
        `Vous ne pouvez pas désactiver ${
          args.cmdOrGrp.group ? "la commande" : "le groupe"
        } \`${args.cmdOrGrp.name}\`.`
      );
    }
    args.cmdOrGrp.setEnabledIn(msg.guild, false);
    return msg.reply(
      `${args.cmdOrGrp.group ? "La commande" : "Le groupe"} \`${
        args.cmdOrGrp.name
      }\` a été désactivé.`
    );
  }
};
