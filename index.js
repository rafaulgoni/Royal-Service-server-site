const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.xmzz6oj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const serviceCollection = client.db('RoyalDB').collection('service');
    const cardCollection = client.db('RoyalDB').collection('card');


    app.get('/service', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    //--------cards-->

    app.get('/card', async (req, res) => {
      let query = {}
      if (req.query?.providerEmail) {
        query = { providerEmail: req.query.providerEmail }
      }
      const result = await cardCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/card/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cardCollection.findOne(query);
      res.send(result);
    });

    app.get('/card', async (req, res) => {
      const cursor = cardCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/card', async (req, res) => {
      const newService = req.body;
      const result = await cardCollection.insertOne(newService);
      res.send(result);
    });


    app.put('/card/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCard = req.body;
      const Card = {
        $set: {
          ...updatedCard
        }
      }
      const result = await cardCollection.updateOne(filter, Card, options);
      res.send(result);
    });

    app.patch('/card/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedBooking = req.body;
      const updateDoc = {
          $set: {
              status: updatedBooking.status
          },
      };
      const result = await cardCollection.updateOne(filter, updateDoc);
      res.send(result);
  })

    app.delete('/card/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cardCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Assignment_category_0002')
});

app.listen(port, () => {
  console.log(`Assignment_category_0002 server is running on port: ${port}`);
})