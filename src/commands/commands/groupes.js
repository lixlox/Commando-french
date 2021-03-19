const { stripIndents } = require("common-tags");
const Command = require("../base");

module.exports = class ListGroupsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "groupes",
      aliases: ["groups", "lister-groupes", "show-groups"],
      group: "commands",
      memberName: "groupes",
      description: "Liste tous les groupes de commandes.",
      details: "Seul les administrateurs peuvent utiliser cette commande.",
      guarded: true,
    });
  }

  hasPermission(msg) {
    if (!msg.guild) return this.client.isOwner(msg.author);
    return (
      msg.member.permissions.has("ADMINISTRATOR") ||
      this.client.isOwner(msg.author)
    );
  }

  run(msg) {
    return msg.reply(stripIndents`
			__**Groupes**__
			${this.client.registry.groups
        .map(
          (grp) =>
            `**${grp.name}:** ${
              grp.isEnabledIn(msg.guild) ? "Activé" : "Désactivé"
            }`
        )
        .join("\n")}
		`);
  }
};
