const { oneLine } = require("common-tags");
const Command = require("../base");

module.exports = class ReloadCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: "recharger",
      aliases: ["recharger-commande", "reload"],
      group: "commands",
      memberName: "recharger",
      description: "Recharge une commande ou un groupe de commandes.",
      details: oneLine`
				L'argument doit être le nom/identifiant (partiel ou complet) d'une commande ou d'un groupe de commandes.
				Fournir un groupe de commandes va recharger l'ensemble des commandes dans ce groupe.
				Seul les propriétaires du bot peuvent utiliser cette commande.
			`,
      examples: ["recharger une-commande"],
      ownerOnly: true,
      guarded: true,

      args: [
        {
          key: "cmdOrGrp",
          label: "command/group",
          prompt: "Quelle commande ou groupe voulez-vous recharger?",
          type: "group|command",
        },
      ],
    });
  }

  async run(msg, args) {
    const { cmdOrGrp } = args;
    const isCmd = Boolean(cmdOrGrp.groupID);
    cmdOrGrp.reload();

    if (this.client.shard) {
      try {
        await this.client.shard.broadcastEval(`
					const ids = [${this.client.shard.ids.join(",")}];
					if(!this.shard.ids.some(id => ids.includes(id))) {
						this.registry.${isCmd ? "commands" : "groups"}.get('${
          isCmd ? cmdOrGrp.name : cmdOrGrp.id
        }').reload();
					}
				`);
      } catch (err) {
        this.client.emit(
          "warn",
          `Erreur lors de l'émission de la commande reload vers les autres shards`
        );
        this.client.emit("error", err);
        if (isCmd) {
          await msg.reply(
            `La commande \`${cmdOrGrp.name}\` a été rechargée, mais elle n'a pas réussi à recharger dans les autres shards.`
          );
        } else {
          await msg.reply(
            `Les commandes dans le groupe \`${cmdOrGrp.name}\` ont été rechargées, mais elles n'ont pas réussi à recharger dans les autres shards.`
          );
        }
        return null;
      }
    }

    if (isCmd) {
      await msg.reply(
        `La commande \`${cmdOrGrp.name}\` a été rechargée${
          this.client.shard ? " on all shards" : ""
        }.`
      );
    } else {
      await msg.reply(
        `Les commandes dans le groupe \`${cmdOrGrp.name}\` ont été rechargées${
          this.client.shard ? " dans tous les shards" : ""
        }.`
      );
    }
    return null;
  }
};
