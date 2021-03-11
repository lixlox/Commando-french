const { oneLine } = require("common-tags");
const Command = require("../base");

module.exports = class UnloadCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: "decharger",
      aliases: ["decharger-commande", "unload"],
      group: "commands",
      memberName: "decharger",
      description: "décharge une commande.",
      details: oneLine`
				L'argument doit être le nom/identifiant (partiel ou complet) d'une commande.
				Seul les propriétaires du bot peuvent utiliser cette commande.
			`,
      examples: ["decharger une-commande"],
      ownerOnly: true,
      guarded: true,

      args: [
        {
          key: "command",
          prompt: "Quelle commande voulez-vous décharger ?",
          type: "command",
        },
      ],
    });
  }

  async run(msg, args) {
    args.command.unload();

    if (this.client.shard) {
      try {
        await this.client.shard.broadcastEval(`
					const ids = [${this.client.shard.ids.join(",")}];
					if(!this.shard.ids.some(id => ids.includes(id))) {
						this.registry.commands.get('${args.command.name}').unload();
					}
				`);
      } catch (err) {
        this.client.emit(
          "warn",
          `Erreur lors de l'émission de la commande unload vers les autres shards`
        );
        this.client.emit("error", err);
        await msg.reply(
          `La commande \`${args.command.name}\` a été déchargée, mais elle n'a pas réussi à être déchargée dans les autres shards.`
        );
        return null;
      }
    }

    await msg.reply(
      `La commande \`${args.command.name}\` a été déchargée${
        this.client.shard ? " dans tous les shards" : ""
      }.`
    );
    return null;
  }
};
