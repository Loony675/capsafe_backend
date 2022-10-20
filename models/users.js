const mongoose = require('mongoose');

//Utilisation d'un sous document pour ajouter plusieurs adresses à une personne (Lieux de travail, domicile etc)
const addressesSchema = mongoose.Schema({
  addressName: String,
  adresse:String,
  latitude: Number,
  longitude: Number,
 });

//Utilisation d'un sous document pour ajouter plusieurs numéros à une personne
 const phoneNumbersSchema = mongoose.Schema({
    phoneNumberName: String,
    phoneNumber:String,
   });

   
 const usersSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    email:String,
    password:String,
    token: String,
    phoneNumber:[phoneNumbersSchema],
    birthdayDate:Date,
    addresses: [addressesSchema],
    sexe: String,
    favoriteTransportLine: String,
    profilPhoto:String,
    travelingWithSameSex: {type: Boolean, default: false},
    showProfilPhoto: {type: Boolean, default: false},
    showSexOnProfil: {type: Boolean, default: false},
    registerDate: Date,
    emergencyTime: Number,
    score: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    });


const User = mongoose.model('users', usersSchema);

module.exports = User;


