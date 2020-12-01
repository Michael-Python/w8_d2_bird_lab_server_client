const express = require('express');
const ObjectID = require('mongodb').ObjectID;

const createRouter = function (collection) {

  const router = express.Router();

  // this is where the endpoints come
  // the 7 restful routes
  // INDEX
  // this uses /api/games
  router.get('/', (request, response)=> {
    // this is from const createRouter, finding all the elements, it returns a cursor object - where do you point?
    // wherever the cursor was poining, return a promise
    collection
      .find()
      // remember ()
      .toArray()
      // fulfill the promise - send back docs
      .then((docs) => response.send(docs))
      // npm run seeds on terminal to see it run
      // error handling, match catch((err) with value from error value
      .catch((err) => {
        console.log(error);
        response.status(500);
        // this is the message if status is 500, if it isn't, tell the front end people and they will build a message
        response.json({status: 500, error: err});
      })
  })

  // SHOW route
    router.get('/:id', (req, res) => {
      // the id from below comes from above, params is not something we do
      const id = req.params.id;
      collection
        // this generates an ObjectID from the id seeds.js assigns each item in the db an id, and ObjectID converts it to the long non-string
        // find turns it into an array, findOne does not need that
        .findOne({ _id: ObjectID(id)})
        .then((doc) => {
          res.json(doc)
        })
        .catch((err) => {
          console.log(error);
          response.status(500);
          // this is the message if status is 500, if it isn't, tell the front end people and they will build a message
          response.json({status: 500, error: err});
        })
    });
  // CREATE - post to -> /api/games
    router.post('/', (req, res) => {
      // I think my error is this only returns one thing, not an array
      // data.push(req.body);
      // res.json(data);
      // ** I don't know what this is
      // collection
      //   .insertOne(newData)
      //   .then(() => {
      //     collection  
      //       .find()
      //       .toArray()
      //       .then((docs) => {
      //         res.jsoc(docs)
      //       })

      //   })
      const newData = req.body;
    collection
      .insertOne(newData)
      .then((result) => {
        res.json(result.ops[0])
      })
      .catch((error) => {
        console.log(error);
        res.status(500);
        res.json({status: 500, error: error})
      });
  });
    
  // DESTROY ROUTE 
  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    collection
      .deleteOne({ _id: ObjectID(id) })
      .then ((result) => {
        res.json(result)
      })
      .catch((error) => {
        console.log(error);
        res.status(500);
        res.json({status: 500, error: error})
      });
  });
  // UPDATE
  router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    collection
      .findOneAndUpdate(
        // need to use $set
        // filter
        { _id: ObjectID(id) },
        // action
        { $set: updatedData },
        // options
        { returnOriginal: false }
    )
    .then((result) => {
      res.json(result.value)
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
      res.json({status: 500, error: error})
    });

  })
  return router;

};

module.exports = createRouter;
