// const db = require('./db/db');
// const mongoose = require('mongoose');
// let connect = mongoose.connect('mongodb://localhost:27017/internship');
// if(connect){
//     console.log('connected to db')
// }   
// else{
//     console.log('not connected to db')
// }   
// const mongoose = require('mongoose');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017')
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.error('not connected to db', err);
  });

module.exports = mongoose;

