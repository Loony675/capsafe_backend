const mongoose = require("mongoose");
<<<<<<< HEAD
=======

>>>>>>> 89a4a1fb38cb581b56cf0cc78bbaf6f1974ebd2b
const messageSchema = mongoose.Schema([
  {
    token1: String,
    token2: String,
    chanel: String,
<<<<<<< HEAD
    messageContent: [{
      message: String,
      username: String,
      timestamp: String,
      sended: Boolean
     }],
=======
    messageContent: [
      { message: String,
        name: String,
        timestamp: String,
        received: Boolean
      },
    ],
>>>>>>> 89a4a1fb38cb581b56cf0cc78bbaf6f1974ebd2b
  },
]);

const Message = mongoose.model("messagecontent", messageSchema);

module.exports = Message;
