# Savor Book Server

This is a server for a recipe book web application. It is built using Node.js, Express.js, and MongoDB.

## API Endpoints

https://savor-book-server.onrender.com/

### GET /recipes

https://savor-book-server.onrender.com/recipes

Returns a list of all recipes in the database.

### POST /add-recipe

https://savor-book-server.onrender.com/add-recipe

Adds a new recipe to the database. The recipe should be provided in the request body.

### GET /recipes/:id

https://savor-book-server.onrender.com/recipes/:id

Returns a single recipe with the given id.

### GET /top-recipes

https://savor-book-server.onrender.com/top-recipes

Returns a list of the top 6 recipes in the database, sorted by likes.

### GET /my-recipes

https://savor-book-server.onrender.com/my-recipes

Returns a list of all recipes created by the user with the given email address.

## Run Locally

http:localhost:5000

### Requirements

- Node.js
- MongoDB

### Start the server

1. Clone the repository
2. Run `npm install`
3. Run `npm start`

The server will be running at <http://localhost:5000>.
