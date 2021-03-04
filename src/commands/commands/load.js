const fs = require("fs");
const { oneLine } = require("common-tags");
const Command = require("../base");

module.exports = class LoadCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: "load",
      aliases: ["load-command"],
      group: "commands",
      memberName: "load",
      description: "Charge une nouvelle commande.",
      details: oneLine`
				L'argument doit être le nom complet de la commande dans le format \`group:memberName\`.
				Seul les propriétaires du bot peuvent utiliser cette commande.
			`,
      examples: ["load some-command"],
      ownerOnly: true,
      guarded: true,

      args: [
        {
          key: "command",
          prompt: "Quelle commande voulez-vous charger ?",
          validate: (val) =>
            new Promise((resolve) => {
              if (!val) return resolve(false);
              const split = val.split(":");
              if (split.length !== 2) return resolve(false);
              if (this.client.registry.findCommands(val).length > 0) {
                return resolve("Cette commande a déjà été enregistrée.");
              }
              const cmdPath = this.client.registry.resolveCommandPath(
                split[0],
                split[1]
              );
              fs.access(cmdPath, fs.constants.R_OK, (err) =>
                err ? resolve(false) : resolve(true)
              );
              return null;
            }),
          parse: (val) => {
            const split = val.split(":");
            const cmdPath = this.client.registry.resolveCommandPath(
              split[0],
              split[1]
            );
            delete require.cache[cmdPath];
            return require(cmdPath);
          },
        },
      ],
    });
  }

  async run(msg, args) {
    this.client.registry.registerCommand(args.command);
    const command = this.client.registry.commands.last();

    if (this.client.shard) {
      try {
        await this.client.shard.broadcastEval(`
					const ids = [${this.client.shard.ids.join(",")}];
					if(!this.shard.ids.some(id => ids.includes(id))) {
						const cmdPath = this.registry.resolveCommandPath('${command.groupID}', '${
          command.name
        }');
						delete require.cache[cmdPath];
						this.registry.registerCommand(require(cmdPath));
					}
				`);
      } catch (err) {
        this.client.emit(
          "warn",
          `Erreur lors de l'émission de la commande load vers les autres shards`
        );
        this.client.emit("error", err);
        await msg.reply(
          `La commande \`${command.name}\` a été chargée, mais elle n'a pas réussi à être chargée dans les autres shards.`
        );
        return null;
      }
    }

    await msg.reply(
      `La commande \`${command.name}\` a été chargée${
        this.client.shard ? " dans tous les shards" : ""
      }.`
    );
    return null;
  }
};
