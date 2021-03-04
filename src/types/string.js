const ArgumentType = require("./base");

class StringArgumentType extends ArgumentType {
  constructor(client) {
    super(client, "string");
  }

  validate(val, msg, arg) {
    if (arg.oneOf && !arg.oneOf.includes(val.toLowerCase())) {
      return `S'il vous plait entrez une des options suivantes: ${arg.oneOf
        .map((opt) => `\`${opt}\``)
        .join(", ")}`;
    }
    if (
      arg.min !== null &&
      typeof arg.min !== "undefined" &&
      val.length < arg.min
    ) {
      return `S'il vous plait garder le/la ${arg.label} au dessus ou à exactement ${arg.min} caractères.`;
    }
    if (
      arg.max !== null &&
      typeof arg.max !== "undefined" &&
      val.length > arg.max
    ) {
      return `S'il vous plait garder le/la ${arg.label} en dessous ou à exactement ${arg.min} caractères.`;
    }
    return true;
  }

  parse(val) {
    return val;
  }
}

module.exports = StringArgumentType;
