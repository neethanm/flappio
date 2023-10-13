const MongoClient = require('mongodb');

var scores_update = async function() {
    return null;
};

var scores_get = async function() {
    return null;
};

var scores_getOne = async function() {
    return null;
};

MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    var dbo = db.db('flappio')

    var leaderboard = dbo.collection("leaderboard")
    
    scores_get = async function () {
        console.log("Retrieving Leaderboard")
        return await leaderboard.find(
            {},
            {sort: {scores: -1}, projection: {_id: 0, IP: 0, score: 1}} // retireves only scores
        )
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
    
})
