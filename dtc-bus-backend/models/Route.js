const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    busName:{type:String,required:true},
    busNumber:{type:String,required:true,unique:true},
});

module.exports = mongoose.model('Route', routeSchema);