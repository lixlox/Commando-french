// This returns Object.prototype in order to return a valid object
// without creating a new one each time this is called just to discard it the moment after.
const isConstructorProxyHandler = {
  construct() {
    return Object.prototype;
  },
};

function escapeRegex(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

function disambiguation(items, label, property = "name") {
  const itemList = items
    .map(
      (item) => `"${(property ? item[property] : item).replace(/ /g, "\xa0")}"`
    )
    .join(",   ");
  return `Plusieurs ${label} ont été trouvés, s'il vous plait soyez plus spécifiques: ${itemList}`;
}

function isConstructor(func, _class) {
  try {
    // eslint-disable-next-line no-new
    new new Proxy(func, isConstructorProxyHandler)();
    if (!_class) return true;
    return func.prototype instanceof _class;
  } catch (err) {
    return false;
  }
}

function paginate(items, page = 1, pageLength = 10) {
  const maxPage = Math.ceil(items.length / pageLength);
  if (page < 1) page = 1;
  if (page > maxPage) page = maxPage;
  const startIndex = (page - 1) * pageLength;
  return {
    items:
      items.length > pageLength
        ? items.slice(startIndex, startIndex + pageLength)
        : items,
    page,
    maxPage,
    pageLength,
  };
}

const permissions = {
  ADMINISTRATOR: "Administrateur",
  VIEW_AUDIT_LOG: "Voir les logs du serveur",
  MANAGE_GUILD: "Gérer le serveur",
  MANAGE_ROLES: "Gérer les rôles",
  MANAGE_CHANNELS: "Gérer les salons",
  KICK_MEMBERS: "Expulser des membres",
  BAN_MEMBERS: "Bannir des membres",
  CREATE_INSTANT_INVITE: "Créer une invitation",
  CHANGE_NICKNAME: "Changer le pseudo",
  MANAGE_NICKNAMES: "Gérer les pseudos",
  MANAGE_EMOJIS: "Gérer les emojis",
  MANAGE_WEBHOOKS: "Gérer les webhooks",
  VIEW_CHANNEL: "Voir les salons",
  SEND_MESSAGES: "Envoyer des messages",
  SEND_TTS_MESSAGES: "Envoyer des messages TTS",
  MANAGE_MESSAGES: "Gérer les messages",
  EMBED_LINKS: "Intégrer des liens",
  ATTACH_FILES: "Joindre des fichiers",
  READ_MESSAGE_HISTORY: "Voir les anciens messages",
  MENTION_EVERYONE: "Mentionner everyone",
  USE_EXTERNAL_EMOJIS: "Utiliser des émojis externes",
  ADD_REACTIONS: "Ajouter des réactions",
  CONNECT: "Se connecter",
  SPEAK: "Parler",
  MUTE_MEMBERS: "Couper le micro de membres",
  DEAFEN_MEMBERS: "Mettre en sourdine des membres",
  MOVE_MEMBERS: "Déplacer des membres",
  USE_VAD: "Utiliser la détection de la voix",
};

module.exports = {
  escapeRegex,
  disambiguation,
  paginate,
  permissions,
  isConstructor,
};
