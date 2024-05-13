const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
//Must remove "/" from your production URL
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.xmzz6oj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// middlewares 
const logger = (req, res, next) => {
  console.log('log: info', req.method, req.url);
  next();
}

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  // console.log('token in the middleware', token);
  // no token available 
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded;
    next();
  })
}


async function run() {
  try {
    // await client.connect();

    const serviceCollection = client.db('RoyalDB').collection('service');
    const cardCollection = client.db('RoyalDB').collection('card');

    //creating Token
    app.post('/jwt', logger, async (req, res) => {
      const user = req.body;
      console.log('user for token', user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '9h' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })
        .send({ success: true });
    })

    app.post('/logout', async (req, res) => {
      const user = req.body;
      console.log('logging out', user);
      res.clearCookie('token', { maxAge: 0 }).send({ success: true })
    })


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

    app.get('/cards', async (req, res) => {
      let query = {}
      if (req.query?.status) {
        query = { status: req.query.status }
      }
      const result = await cardCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/card', logger, async (req, res) => {
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