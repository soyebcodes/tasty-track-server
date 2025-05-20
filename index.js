const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

async function run() {
  try {
    await client.connect();

    const db = client.db("savorBookDB");
    const recipesCollection = db.collection("recipes");

    // get all recipes
    app.get("/recipes", async (req, res) => {
      const result = await recipesCollection.find().toArray();
      res.send(result);
    });

      // add a new recipe
    app.post("/add-recipe", async (req, res) => {
      const recipeData = req.body;
      if(!recipeData.likeCount || typeof recipeData.likeCount !== "number") {
        recipeData.likeCount = 0;
      }
      const result = await recipesCollection.insertOne(recipeData);
      res.send(result);
    });

    // get a single recipe
    app.get("/recipes/:id", async (req, res) => {
      const id = req.params.id;
       if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ID format" });
  }
      const recipe = await recipesCollection.findOne({ _id: new ObjectId(id) });
      res.send(recipe);
    });

    // get recipe byt top by likes
   app.get("/top-recipes", async (req, res) => {
  try {
    const topRecipes = await recipesCollection
      .find()
      .sort({ likeCount: -1 })
      .limit(6)
      .toArray();

    res.send(topRecipes);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch top recipes" });
  }
});

  

    // send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Savor Book server");
});

app.listen(port, () => {
  console.log(`Savor Book server is running on port ${port}`);
});
