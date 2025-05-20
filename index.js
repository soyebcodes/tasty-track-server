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
      if (!recipeData.likeCount || typeof recipeData.likeCount !== "number") {
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

    // get top recipe by likes
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

    // get recipe by user email
    app.get("/my-recipes", async (req, res) => {
      const userEmail = req.query.email;

      if (!userEmail) {
        return res.status(400).send({ error: "User email is required" });
      }

      try {
        const userRecipes = await recipesCollection
          .find({ authorEmail: userEmail })
          .toArray();

        res.send(userRecipes);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch user's recipes" });
      }
    });

    // delete a recipe
    app.delete("/my-recipes/:id", async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid Id format" });
      }

      try {
        const result = await recipesCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({ error: "Recipe not found" });
        }

        res.send({ message: "Recipe deleted successfully!" });
      } catch (err) {
        res.status(500).send({ error: "Failed to delete recipe" });
      }
    });

    // update a recipe
    app.put("/my-recipes/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ID format" });
      }

      try {
        const result = await recipesCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              image: updatedData.image,
              title: updatedData.title,
              ingredients: updatedData.ingredients,
              instructions: updatedData.instructions,
              cuisineType: updatedData.cuisineType,
              preparationTime: updatedData.preparationTime,
              categories: updatedData.categories,
            },
          }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ error: "Recipe not found" });
        }

        res.send({ message: "Recipe updated successfully" });
      } catch (err) {
        res.status(500).send({ error: "failed to update recipe" });
      }
    });

    // handle like count
    app.patch("/recipes/like/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ID format" });
      }

      const result = await recipesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { likeCount: 1 } }
      );
      res.send(result);
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
