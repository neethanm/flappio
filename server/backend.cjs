const express = require('express')
const app = express()

app.post('/leaderboard', (req, res) => {
    console.log("Got request to leaderboard")
    res.send([1, 2, 3].toString())
})

app.listen(3000, () => {
    console.log("The Server is Up!")
})
