const FriendlyError = require("./friendly");

/**
 * Has a descriptive message for a command not having proper format
 * @extends {FriendlyError}
 */
class CommandFormatError extends FriendlyError {
  /**
   * @param {CommandoMessage} msg - The command message the error is for
   */
  constructor(msg) {
    super(
      `Utilisation invalide de la commande. Le format accepté de la commande \`${
        msg.command.name
      }\` est: ${msg.usage(
        msg.command.format,
        msg.guild ? undefined : null,
        msg.guild ? undefined : null
      )}. Utilisez ${msg.anyUsage(
        `aide ${msg.command.name}`,
        msg.guild ? undefined : null,
        msg.guild ? undefined : null
      )} pour plus d'informations.`
    );
    this.name = "CommandFormatError";
  }
}

module.exports = CommandFormatError;
