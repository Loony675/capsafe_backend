const mongoose = require("mongoose");
const messageSchema = mongoose.Schema([
  {
    dateTrajet: Date,
    depart: String,
    arrivee: String,
    dateTrajet: Date,
    depart: String,
    arrivee: String,
  },
]);

const Message = mongoose.model("messagecontent", messageSchema);

module.exports = Message;
