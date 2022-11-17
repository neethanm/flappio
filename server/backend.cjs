const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

const db_url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

MongoClient.connect(db_url, (err, db) => {
    if (err) {console.error("Could not connect to database:", err); return;}

    var dbo = db.db('flappio')

    var leaderboard = dbo.collection("leaderboard")
    
    scores_get = async function ()  {
        console.log("Retrieving Leaderboard")
        return await (await leaderboard.find(
            {},
            {sort: {score: -1}, projection: {_id: 0, IP: 1, score: 1}} // retireves only scores
        )).toArray()
    } 
    
    scores_getOne = async function (IP) {
        console.log("Retrieving Leaderboard")
        return await leaderboard.find(
            {IP: IP},
            {} // dd
        )
    }
    
    scores_update = async function (IP, score) {
        console.log("Changing score")
        await leaderboard.updateOne(
            {IP: IP},
            {$set: {
                score: score
            }},
            {upsert: true}
        )
    }

    console.log("Database is connected!")
    
})

app.get('/leaderboard', (req, res) => {
    console.log("Got request to leaderboard")
    console.log(req.headers['origin'], req.headers)
    let ip = req.headers['origin']

    scores_get(ip, (new Date()).toString()).then((val) => {
        console.log(val)
        res.status(200).send(JSON.stringify(val))
    })
})

app.post('/leaderboard', (req, res) => {
    console.log("Got request to leaderboard")
    console.log(req.headers['origin'], req.headers)
    let ip = req.headers['origin']

    scores_update(ip, (new Date()).toString()).then(() =>
        res.status(200).send(`Did request for ${ip}`)
    )
})

app.get('/', (req, res) => {
    console.log("Got request to ROOT:", req)
    res.send("Reciever reuiest")
})

app.listen(3001, '0.0.0.0', () => {
    console.log("The Server is Up!")
})
