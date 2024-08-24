const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
const Search = require('./models/searches.js');
const topSites = require('top-sites')
var cors = require('cors');
const app = express();

app.use(cors())

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const port = process.env.PORT || 3000;
const dbURL = 'mongodb+srv://ptomas14:Sharkspawn15@usersearch.oto2n8e.mongodb.net/';


const array = ["1", "2", "3", "4", "5"];
const Programming = ["https://www.cloudflare.com", "https://www.geeksforgeeks.org", "https://developer.mozilla.org", "https://www.w3schools.com", "https://www.microsoft.com", "https://www.picasaweb.google.com", "https://www.support.google.com", "https://www.wordpress.org", "https://www.github.com", "https://www.w3.org", "https://medium.com", "https://www.instructables.com", "https://www.stackoverflow.com", "https://www.godaddy.com"];
const Shopping = ["https://www.amazon.com", "https://www.paypal.com", "https://www.ebay.com", ]
const SocialMedia = ["https://www.facebook.com", "https://www.instagram.com", "https://www.myspace.com", "https://www.googleblog.com", "https://www.whatsapp.com", "https://www.tiktok.com", "https://www.plus.google.com", "https://www.linkedin.com", "https://www.blogger.com", "https://www.twitter.com"]
const Entertainment = ["https://www.youtube.com", "https://www.imdb.com", "https://www.netvibes.com", "https://www.googleblog.com", "https://www.dailymotion.com", "https://www.picasaweb.google.com", "https://www.istockphoto.com"]
const News = ["https://www.theguardian.com", "https://www.cnn.com", "https://www.news.google.com", "https://www.nytimes.com",]
var set1 = [];
var set2 = [];
let id


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

let recommended = [];
let origin = [];
let history = [];
let content = [];

app.post('/', async function (req, res) {
    id = req.body.ID
    console.log(id)
    
    const newUser = {
        id: id
    }

    let user = await Search.findOne({ id: id })
    if(!user){
        user = await Search.create(newUser);
    }

    // if(Array.isArray(origin) && origin.length) {
    //     await Search.updateOne({ id: id}, {$set:{content: origin}},{ upsert: true })
    // }
    // if(Array.isArray(history) && history.length) {
    //     await Search.updateOne({ id: id}, {$set:{history: history}},{ upsert: true })
    // }
    // if(Array.isArray(recommended) && recommended.length) {
    //     await Search.updateOne({ id: id}, {$set:{search: recommended}},{ upsert: true })
    // }

   
})

let results = []

app.post(`/searches/:${id}`, async function (req, res) {
    let user = req.body.ID
    let site = req.body.site
    console.log(user)
    // let query = req.body.query

    if(site && !set1.includes(site)){
        set1.push(site);
        console.log(site);
        await Search.updateOne({ id: user}, {$set:{ history: set1}},{ upsert: true })
        await Search.updateOne({ id: user}, {$set:{ date: new Date()}},{ upsert: true })
    }

    console.log(set1.length)
    for(let i = 0; i < 10; i++) {

        if(recommended.length < 10){
            if(Programming.includes(site)) {
                var len = Math.floor((Math.random() * Programming.length));
                console.log(Programming[len]);
                if(!recommended.includes(Programming[len])){
                    recommended.push(Programming[len])
                }
                if(!origin.includes("programming")){
                    origin.push("programming");
                }
            }
        }        
        if(recommended.length < 10){
            if(Shopping.includes(site)) {
                var len = Math.floor((Math.random() * Shopping.length));
                console.log(Shopping[len]);
                if(!recommended.includes(Shopping[len])){
                    recommended.push(Shopping[len]);
                }
                if(!origin.includes("shopping")){
                    origin.push("shopping");
                }
            }
        }
        if(recommended.length < 10){
            if(SocialMedia.includes(site)) {
                var len = Math.floor((Math.random() * SocialMedia.length));
                console.log(SocialMedia[len]);
                if(!recommended.includes(SocialMedia[len])){
                    recommended.push(SocialMedia[len])
                }
                if(!origin.includes("social media")){
                    origin.push("social media");
                }
            }
        }
        if(recommended.length < 10){
            if(Entertainment.includes(site)) {
                var len = Math.floor((Math.random() * Entertainment.length));
                console.log(Entertainment[len]);
                if(!recommended.includes(Entertainment[len])){
                    recommended.push(Entertainment[len])
                }
                if(!origin.includes("entertainment")){
                    origin.push("entertainment");
                }
            }
        }
        if(recommended.length < 10){
            if(News.includes(site)) {
                var len = Math.floor((Math.random() * News.length));
                if(!recommended.includes(News[len])){
                    recommended.push(News[len])
                }
                if(!origin.includes("news")){
                    origin.push("news");
                }
            }
        }
        console.log(recommended)
    }
    if(Array.isArray(recommended) && recommended.length) {
        await Search.updateOne({ id: id}, {$set:{search: recommended}},{ upsert: true })
    }
    if(Array.isArray(origin) && origin.length) {
        await Search.updateOne({ id: id}, {$set:{content: origin}},{ upsert: true })
    }
})

app.get(`/array/:${id}`, async function (req, res) {
    let suggested = await Search.findOne({ id: id })
    // console.log(recommend)
    recommended = suggested.search.toString()

    let last = await Search.findOne({ id: id })
    history = last.history.toString()
    
    let type = await Search.findOne({ id: id })
    content = type.content.toString();


    res.json({suggested: recommended, past: history, types: origin, array: array})
});

mongoose.connect(dbURL)
  .then((result) =>app.listen(port, async function () {
    console.log('Server started at http://localhost:' + port);
}))
.catch((err) => console.log(err))