const express = require('express');
const app = express();
const parser = require('body-parser');
const cors = require('cors')
// not using entire mongodb package, only need MongoClient
const MongoClient = require('mongodb').MongoClient;
// doesn't need .js when creating this because it is done in js
const createRouter = require('./helpers/create_router.js')


app.use(parser.json());
app.use(cors());

// sets up connection between client and db - this returns a promise
MongoClient.connect('mongodb://localhost:27017')
  // what to do when the promise is a success, I can interact with this client object, not the same as the client folder
  .then((client) => {
    const db = client.db('games_hub');
    // collection is table within the db
    const gamesCollection = db.collection('games');
    
    const gamesRouter = createRouter(gamesCollection)
    // this is a restful route
    app.use('/api/games', gamesRouter)
    // now for the routes

  })
  // in case there is an error, catch it and tell me what it is
  .catch(console.error);

app.listen(3000, function () {
  console.log(`Listening on port ${ this.address().port }`);
});
