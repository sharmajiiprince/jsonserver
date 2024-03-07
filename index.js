// const jsonServer = require("json-server"); 
// const server = jsonServer.create();
// const router = jsonServer.router("db.json");
// const middlewares = jsonServer.defaults();
// const cors = require('cors');
// const port = process.env.PORT || 3030; 

// server.use(cors());
// server.use(middlewares);
// server.use(router);



// server.listen(3030, () => {
//     console.log(`Server is running on port`);
// });

const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const cors = require('cors');
const port = process.env.PORT || 3030;

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser); // Middleware to parse JSON body

// Define your custom POST endpoint
server.post('/api/data', (req, res) => {
  // Assuming db.json has an array called "data"
  const newData = req.body;

  // Add the new data to db.json
  router.db.get('data').push(newData).write();

  res.status(201).json(newData);
});

// Use the router middleware
server.use(router);

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
