var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const Pusher = require("pusher");
const mongoose = require("mongoose");
const { token } = require("morgan");
const db = mongoose.connection;

db.once("open", () => {
  const changeStream = Message.watch();
  changeStream.on("change", (change) => {
    // console.log("a change occured", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      // console.log('console log',messageDetails)
      pusher.trigger("messagechannel", "inserted", {
        name: messageDetails.name, //Ali envoi un message
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        id: messageDetails.id,
        // token: token,
        //benoit est destinataire du message
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

router.post("/sync", (req, res) => {
  Message.find((err, data) => {
    
    if (err) {
      res.status(500).send(err);
      // log('sync============>', data)
    } else {
      let myMessages=[]
      
      data.map((data, i) => {
        if(data.tokenReceiver === req.body.token || data.tokenSender === req.body.token){
          // console.log(`=============turn${i}===================`);
          // console.log(data);
          myMessages.push(data)
          // console.log(myMessages.flat());
        // console.log(`============${data.name}====================`);
        }
      })

      // console.log('================================HERE====================================', data);
      // let sendedMessages = data.filter(el=> el.token === req.body.token )
      // let receivedMessages = data.filter(el=> el.tokenSender === req.body.token )
      // let allMessages = {sendedMessages, receivedMessages}
      // allMessages.sort((a,b)=> (a.timestamp > b.timestamp ? 1 : -1))

      res.status(200).send(myMessages.flat());
    }
  });
});
//update
router.post("/new", (req, res) => {
  const dbMessage = req.body;

  Message.create(dbMessage, (err, data) => {

    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
      // console.log('new ===============>',data)

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