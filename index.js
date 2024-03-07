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
server.use(jsonServer.bodyParser); 
server.post('/api/user', (req, res) => {
  const newData = req.body;
  router.db.get('data').push(newData).write();

  res.status(201).json(newData);
});

server.use(router);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
