const mongoose = require("mongoose");
const messageSchema = mongoose.Schema([
  {
    token1: String,
    token2: String,
    chanel: String,
    messageContent: [
      { message: String,
        name: String,
        timestamp: String,
        received: Boolean
      },
    ],
  },
]);

const Message = mongoose.model("messagecontent", messageSchema);

module.exports = Message;
