const ArgumentType = require("./base");

class FloatArgumentType extends ArgumentType {
  constructor(client) {
    super(client, "float");
  }

  validate(val, msg, arg) {
    const float = Number.parseFloat(val);
    if (Number.isNaN(float)) return false;
    if (arg.oneOf && !arg.oneOf.includes(float)) {
      return `S'il vous plait entrez une des options suivantes: ${arg.oneOf
        .map((opt) => `\`${opt}\``)
        .join(", ")}`;
    }
    if (arg.min !== null && typeof arg.min !== "undefined" && float < arg.min) {
      return `S'il vous plait entrez un nombre supérieur ou égal à ${arg.min}.`;
    }
    if (arg.max !== null && typeof arg.max !== "undefined" && float > arg.max) {
      return `S'il vous plait entrez un nombre inférieur ou égal à ${arg.max}.`;
    }
    return true;
  }

  parse(val) {
    return Number.parseFloat(val);
  }
}

module.exports = FloatArgumentType;
