const { oneLine } = require("common-tags");
const Command = require("../base");

module.exports = class EnableCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: "enable",
      aliases: ["enable-command", "cmd-on", "command-on"],
      group: "commands",
      memberName: "enable",
      description: "Active une commande ou un groupe de commandes.",
      details: oneLine`
				Cet argument doit être le nom/identifiant (partiel ou complet) d'une commande ou d'un groupe de commandes.
				Seul les administrateurs peuvent utiliser cette commande.
			`,
      examples: ["enable util", "enable Utility", "enable prefix"],
      guarded: true,

      args: [
        {
          key: "cmdOrGrp",
          label: "command/group",
          prompt: "Quelle commande ou groupe voulez-vous activer ?",
          type: "group|command",
        },
      ],
    });
  }

  hasPermission(msg) {
    if (!msg.guild) return this.client.isOwner(msg.author);
    return (
      msg.member.hasPermission("ADMINISTRATOR") ||
      this.client.isOwner(msg.author)
    );
  }

  run(msg, args) {
    const group = args.cmdOrGrp.group;
    if (args.cmdOrGrp.isEnabledIn(msg.guild, true)) {
      return msg.reply(
        `${args.cmdOrGrp.group ? "La commande" : "Le groupe"} \`${
          args.cmdOrGrp.name
        }\` est déjà activé${
          group && !group.isEnabledIn(msg.guild)
            ? `, mais le groupe \`${group.name}\` est désactivé, la commande ne peut donc pas être utilisé.`
            : ""
        }.`
      );
    }
    args.cmdOrGrp.setEnabledIn(msg.guild, true);
    return msg.reply(
      `${group ? "La commande" : "Le groupe"} \`${
        args.cmdOrGrp.name
      }\` a été activé${
        group && !group.isEnabledIn(msg.guild)
          ? `, mais le groupe \`${group.name}\` est désactivé, la commande ne peut donc pas être utilisé.`
          : ""
      }.`
    );
  }
};
