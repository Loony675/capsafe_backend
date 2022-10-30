const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  tokenReceiver: String,
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
  tokenSender: String,
});

const Message = mongoose.model("messagecontent", messageSchema);

module.exports = Message;