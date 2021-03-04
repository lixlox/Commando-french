const { stripIndents, oneLine } = require("common-tags");
const Command = require("../base");
const { disambiguation } = require("../../util");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      group: "util",
      memberName: "help",
      aliases: ["commands"],
      description:
        "Affiche une liste des commandes disponibles, ou des informations détaillées sur une commande spécifique.",
      details: oneLine`
				L'argument peut être un bout du nom de la commande ou le nom de la commande complet.
				Si le nom de la commande n'est pas indiqué, toutes les commandes disponibles vont être listées.
			`,
      examples: ["help", "help prefix"],
      guarded: true,

      args: [
        {
          key: "command",
          prompt: "Vous souhaitez consulter l'aide de quelle commande ?",
          type: "string",
          default: "",
        },
      ],
    });
  }

  async run(msg, args) {
    // eslint-disable-line complexity
    const groups = this.client.registry.groups;
    const commands = this.client.registry.findCommands(
      args.command,
      false,
      msg
    );
    const showAll = args.command && args.command.toLowerCase() === "all";
    if (args.command && !showAll) {
      if (commands.length === 1) {
        let help = stripIndents`
					${oneLine`
						__Commande **${commands[0].name}**:__ ${commands[0].description}
						${commands[0].guildOnly ? " (Utilisable uniquement dans les serveurs)" : ""}
						${commands[0].nsfw ? " (NSFW)" : ""}
					`}

					**Format:** ${msg.anyUsage(
            `${commands[0].name}${
              commands[0].format ? ` ${commands[0].format}` : ""
            }`
          )}
				`;
        if (commands[0].aliases.length > 0)
          help += `\n**Alias:** ${commands[0].aliases.join(", ")}`;
        help += `\n${oneLine`
					**Groupe:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
        if (commands[0].details)
          help += `\n**Details:** ${commands[0].details}`;
        if (commands[0].examples)
          help += `\n**Examples:**\n${commands[0].examples.join("\n")}`;

        const messages = [];
        try {
          messages.push(await msg.direct(help));
          if (msg.channel.type !== "dm")
            messages.push(
              await msg.reply(
                "Un message privé à été envoyé avec les informations."
              )
            );
        } catch (err) {
          messages.push(
            await msg.reply(
              "Je n'ai pas pu vous envoyer un message privé contenant l'aide. Vous avez probablement désactivé vos messages privés."
            )
          );
        }
        return messages;
      } else if (commands.length > 15) {
        return msg.reply(
          "Plusieurs commandes ont été trouvées. S'il vous plait, soyez plus spécifique."
        );
      } else if (commands.length > 1) {
        return msg.reply(disambiguation(commands, "commands"));
      } else {
        return msg.reply(
          `Je n'ai pas pu identifier la commande. Utilisez ${msg.usage(
            null,
            msg.channel.type === "dm" ? null : undefined,
            msg.channel.type === "dm" ? null : undefined
          )} pour voir la liste de toutes les commandes.`
        );
      }
    } else {
      const messages = [];
      try {
        messages.push(
          await msg.direct(
            stripIndents`
					${oneLine`
						Pour executer une commande dans ${
              msg.guild ? msg.guild.name : "n'importe quel serveur"
            },
						utilisez ${Command.usage(
              "command",
              msg.guild ? msg.guild.commandPrefix : null,
              this.client.user
            )}.
						Par exemple, ${Command.usage(
              "prefix",
              msg.guild ? msg.guild.commandPrefix : null,
              this.client.user
            )}.
					`}
					Pour executer une commande dans ces messages privés, utilisez simplement ${Command.usage(
            "command",
            null,
            null
          )} sans aucun préfixe.

					Utilisez ${this.usage(
            "<command>",
            null,
            null
          )} pour voir les informations détaillées sur une commande spécifique.
					Utilisez ${this.usage(
            "all",
            null,
            null
          )} pour voir la liste de *toutes* les commandes, pas seulement celles qui sont disponibles.

					__**${
            showAll
              ? "Toutes les commandes"
              : `Commandes disponibles dans ${
                  msg.guild || "ces messages privés"
                }`
          }**__

					${groups
            .filter((grp) =>
              grp.commands.some(
                (cmd) => !cmd.hidden && (showAll || cmd.isUsable(msg))
              )
            )
            .map(
              (grp) => stripIndents`
							__${grp.name}__
							${grp.commands
                .filter((cmd) => !cmd.hidden && (showAll || cmd.isUsable(msg)))
                .map(
                  (cmd) =>
                    `**${cmd.name}:** ${cmd.description}${
                      cmd.nsfw ? " (NSFW)" : ""
                    }`
                )
                .join("\n")}
						`
            )
            .join("\n\n")}
				`,
            { split: true }
          )
        );
        if (msg.channel.type !== "dm")
          messages.push(
            await msg.reply(
              "Un message privé à été envoyé avec les informations."
            )
          );
      } catch (err) {
        messages.push(
          await msg.reply(
            "Je n'ai pas pu vous envoyer un message privé contenant l'aide. Vous avez probablement désactivé vos messages privés."
          )
        );
      }
      return messages;
    }
  }
};
