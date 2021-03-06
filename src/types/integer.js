const ArgumentType = require("./base");

class IntegerArgumentType extends ArgumentType {
  constructor(client) {
    super(client, "integer");
  }

  validate(val, msg, arg) {
    const int = Number.parseInt(val);
    if (Number.isNaN(int)) return false;
    if (arg.oneOf && !arg.oneOf.includes(int)) {
      return `S'il vous plait entrez une des options suivantes: ${arg.oneOf
        .map((opt) => `\`${opt}\``)
        .join(", ")}`;
    }
    if (arg.min !== null && typeof arg.min !== "undefined" && int < arg.min) {
      return `S'il vous plait entrez un nombre supérieur ou égal à ${arg.min}.`;
    }
    if (arg.max !== null && typeof arg.max !== "undefined" && int > arg.max) {
      return `S'il vous plait entrez un nombre inférieur ou égal à ${arg.max}.`;
    }
    return true;
  }

  parse(val) {
    return Number.parseInt(val);
  }
}

module.exports = IntegerArgumentType;
