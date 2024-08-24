const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchSchema = new Schema({
    id:{
       type: String 
    },
    history:{
        type: Array
    },
    date:{
        type: String
    },
    search:{
        type: Array
    },
    content:{
        type: Array
    }
}, {timestamps: true});

const Search = mongoose.model("Schema", searchSchema);
module.exports =  Search;