const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l0lz8w0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const toyCollection = client.db("ToyEmporium").collection("Toys");

    const addedToyCollection = client.db("ToyEmporium").collection("addedToys");

    app.get("/toys", async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    app.post("/addedToys", async (req, res) => {
      const toy = req.body;
      const result = await addedToyCollection.insertOne(toy);
      res.send(result);
    });

    app.get("/addedToys", async (req, res) => {
      const limit = parseInt(req.query.limit);
      const result = await addedToyCollection.find().limit(limit).toArray();
      res.send(result);
    });

    app.get("/addedToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addedToyCollection.findOne(query);
      res.send(result);
    });

    app.patch("/addedToys/:id", async (req, res) => {
      const id = req.params.id;
      const toyInfo = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          price: toyInfo.price,
          quantity: toyInfo.quantity,
          description: toyInfo.description,
        },
      };
      const result = await addedToyCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/addedToys/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await addedToyCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
