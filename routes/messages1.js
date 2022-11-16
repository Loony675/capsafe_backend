var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const User = require("../models/users");
const Pusher = require("pusher");

const pusher = new Pusher({ // Création du serveur Pusher avec nos identifiants
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});


router.post("/displayMessages", (req, res) => {
  User.findOne({token: req.body.token}).then(userInDb => { //On vérifie que le token est bien enregistré en bdd
    if (userInDb){
      let possibleChannel1= req.body.token +req.body.token2; // les channels possibles sont la concaténation du token des 2 utilisateurs concernés
      let possibleChannel2 = req.body.token2 +req.body.token; // ex: channel = token1+token2 ou token2+token1
      Message.find({ // On va récupérer l'ensemble des messages du chanel possible 1 ou 2
        $or: [{chanel: possibleChannel1}, {chanel: possibleChannel2}]})
      .then(messageFoundInDb => {
        // console.log(messageFoundInDb);
        if(messageFoundInDb){ // Si des messages on été retrouvé alors...
          let retourBack = [] // On déclare un tableau vide qui va contenir les messages trouvés en bdd
          messageFoundInDb.map((data, i) =>{console.log(data.chanel)
          retourBack.push({message: data.messageContent, channel : data.chanel}) 
          })
          res.json({result: true, channel: messageFoundInDb.chanel, message: retourBack });

        }else{
          res.json({result: false, error: 'no message'})
        }
      })
    }else{
      res.json({result: false, error: 'user doesnt exist in db'})

    }
  })})
// Pusher permet de mettre en relation 2 utilisateurs via un tunnel(chanel) qui leur permet d'échanger en instantanné tant que ceux ci ne quittent pas le tunnel(channel)
// Si l'un des utilisateurs quitte le channel puis revient dessus les messages auront disparu mise à part si ceux ci sont sauvgardés en bdd. Pusher ne conserve pas les messages comme une bdd.
// On peut envoyer toute les informations que l'on souhaite en Params à Pusher afin de les récupérer dans la console Pusher.
// Mise à jour (route PUT) du channel (chat) existant en ajoutant (join) un utilisateur (: username)

router.put("/users", (req, res) => {
  // connection au channel via le params token demandé par Pusher
  // console.log(req.body);
  pusher.trigger(req.body.chanel, "join", { token: req.body.token }); //'chat' Nom du chanel, 'join' Evenement, 'username' condition demandé par Pusher
  res.json({ result: true });
});

// Suppression (route DELETE) de l'utilisateur (: username) du channel (chat) lorsqu'il le quitte (leave)
router.delete("/users", (req, res) => {  //Déconnection du channel via le params token
  pusher.trigger(req.body.chanel, "leave", { token: req.body.token }); //'chat' Nom du chanel, 'leave' Evenement, 'token' / ceux sont des paramètres
  res.json({ result: true });
});

  // Send message
// router.post("/message", async (req, res) => {  // je reçois du contenu du front
//   const message = req.body; // contenu
//   let channel1 = message.token1 + message.token2;
//   let channel2 = message.token2 + message.token1;
//   // Message.find({$or: [{chanel: channel1}, {chanel: channel2}]})
//   // .then(chanelFound => {
//   //   let cha = chanelFound.chanel
//   //   if(chanelFound) {
//   //     Message.updateOne({chanel: cha}, {$push: {messageContent: {message:'test'
//   //       // message: message.message,
//   //       // username: message.username,
//   //       // timestamp: message.timestamp,
//   //       // sended: true, 
//   //     }}})
//   //     .then(res.json({ result: true }))
//   //   }else{
//       const newMessage = new Message({
//         token1: message.token1,
//         token2: message.token2,
//         chanel: channel1,
//         messageContent:[{
//           message: message.message,
//           timestamp: message.timestamp,
//           sended: true,
//         }]
//       })
//       newMessage.save().then((messageSend) => {
//         if (messageSend) {
//           res.json({ result: true });
//         } else {
//           res.json({ result: false });
//         }
//       });
//   if (message.type === "audio") {
//     // Si le type de contenu est un audio
//     const audioPath = `./tmp/${uniqid()}.m4a`; // Création d'une variable contenant le chemin du fichier
//     const resultMove = await req.files.audio.mv(audioPath); // On attend la réception du fichier audio afin de la stocker dans l'endroit prédéfini (audioPath)
//     // ressource_type vidéo est utilisé autant pour les audio que pour les vidéos
//     if (!resultMove) {
//       // Si fichier audio stocké dans audioPath alors resultMove = null
//       const resultCloudinary = await cloudinary.uploader.upload(audioPath, {
//         resource_type: "video",
//       }); // On attend le transfert du fichier stocké temporairement dans audioPath vers cloudinary.
//       message.url = resultCloudinary.secure_url; // une fois le traitement fini cloudinary fourni une URL en réponse qui est stocké dans message.url
//       fs.unlinkSync(audioPath); // on supprime le fichier audio de notre stockage temporaire (audioPath)
//     } else {
//       // res.json({ result: false, error: resultMove }); // le tranfert ne sais pas effectué correctement donc resultMove reste défini
//       return;
//     }
//   }
// // console.log(req.body);
//   pusher.trigger(channel1, "message", message); // On envoie à Pusher le nom du chanel (chat), l'évenement (message) et le contenu du message (fichier audio)

//   // res.json({ result: true });
// });



router.post("/message", async (req, res) => {  // je reçois du contenu du front
  const message = req.body; // contenu
let channel=''
  // console.log(message);
  let possibleChannel1= req.body.token +req.body.token2;
  let possibleChannel2 = req.body.token2 +req.body.token;
  // console.log(possibleChannel1);
  Message.findOne({$or: [{chanel: possibleChannel1}, {chanel: possibleChannel2}]}).then(
    channelExists => {
      // console.log(channelExists);
      if(channelExists !== null){
        pusher.trigger(channelExists.chanel, "message", message);
        //push message dans le channel existant
        Message.findOneAndUpdate({chanel: channelExists.chanel},
          {"$push" : { 
            "messageContent" : { message: message.message}}}).then(data =>{
              channel=data.chanel
              res.json({result: true, action: 'push dans le channel existant'})
            })
            // { 
               
            //   username: message.username, 
            //   timestamp: message.timestamp 
            // }} 

      }else{
        const newMessage = new Message({
          token1: message.token,
          token2: message.token2,
          chanel: possibleChannel1,
          messageContent:[{
            message: message.message,
            timestamp: message.timestamp,
            sended: true,
          }]
        })
        pusher.trigger(possibleChannel1, "message", message);        
        newMessage.save().then((messageSent) => {
          if (messageSent) {
            res.json({ result: true, action: 'création dans nouveau channel' });
          } else {
            res.json({ result: false });
          }
        });
      }
    }
  )




  // Message.find({$or: [{chanel: channel1}, {chanel: channel2}]})
  // .then(chanelFound => {
  //   let cha = chanelFound.chanel
  //   if(chanelFound) {
  //     Message.updateOne({chanel: cha}, {$push: {messageContent: {message:'test'
  //       // message: message.message,
  //       // username: message.username,
  //       // timestamp: message.timestamp,
  //       // sended: true, 
  //     }}})
  //     .then(res.json({ result: true }))
  //   }else{
      

// console.log(req.body);

  // res.json({ result: true });
});




module.exports = router;