const mongoose = require("mongoose");
const messageSchema = mongoose.Schema([
  {
    token1: String, // Token de l'utilisateur qui est connecté
    token2: String, // Token de la personne que l'on souhaite contacté par chat
    chanel: String, // Chanel unique aux 2 utilisateurs
    messageContent: [{ // Contenu d'un message
      message: String,
      username: String,
      timestamp: String,
      sended: Boolean
     }],
  },
]);

const Message = mongoose.model("messagecontent", messageSchema);

module.exports = Message;