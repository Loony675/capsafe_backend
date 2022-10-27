var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const Pusher = require("pusher");
const mongoose = require("mongoose");
const db = mongoose.connection;

db.once("open", () => {
  const changeStream = Message.watch();
  changeStream.on("change", (change) => {
    console.log("a change occured", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      console.log('console log',messageDetails)
      pusher.trigger("messagechannel", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        id: messageDetails.id,
      });
    } else {
        console.log('error triggering pusher')
    }
  });
});

const pusher = new Pusher({
  appId: "1497240",
  key: "9cf6d78d2a5981a0d45c",
  secret: "02c717af2067338f3949",
  cluster: "eu",
  useTLS: true,
});

router.get("/sync", (req, res) => {
  Message.find((err, data) => {
    if (err) {
      res.status(500).send(err);
      log('sync', data)
    } else {
      res.status(200).send(data);
      console.log('sync', data)
    }
  });
});

router.post("/new", (req, res) => {
  const dbMessage = req.body;

  Message.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
      console.log('new',data)

    }
  });
});

module.exports = router;


// var express = require("express");
// var router = express.Router();
// const Message = require("../models/message");
// const Pusher = require("pusher");
// const mongoose = require("mongoose");
// const db = mongoose.connection;

// //ouverture d'un cannal de Chat
// db.once("open", () => {
//   const changeStream = Message.watch();
//   changeStream.on("change", (change) => {
//      //console.log("a change occured", change);
//     if (change.operationType === "insert") {
//       const messageDetails = change.fullDocument;
//       console.log('console log',messageDetails)
//       pusher.trigger("messages", "inserted", {
//         name: messageDetails.name,
//         message: messageDetails.message,
//         timestamp: messageDetails.timestamp,
//       });
//     } else {
//         console.log('error triggering pusher')
//     }
//   });
// });

// //Adresse compte Pusher Benoit
// const pusher = new Pusher({
//     appId: "1497240",
//     key: "9cf6d78d2a5981a0d45c",
//     secret: "02c717af2067338f3949",
//     cluster: "eu",
//     useTLS: true
//   });
  
// //Récupérer tous les messages de MangoDb
// router.get("/sync", (req, res) => {
//   Message.find((err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(200).send(data);
//     }
//   });
// });

// //Poster un message vers MangoDB
// router.post("/new", (req, res) => {
//   const dbMessage = req.body;

//   Message.create(dbMessage, (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(201).send(data);
//     }
//   });
// });

// module.exports = router;