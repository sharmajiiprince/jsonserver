const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const cors = require('cors');
const port = process.env.PORT || 3030;
const fs=require("fs");

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

//read data from json
function readDataFromFile() {
    const rawData = fs.readFileSync(__dirname + "/db.json");
    return JSON.parse(rawData);
  }
  
  // Write data to JSON file
  function writeDataToFile(data) {
    fs.writeFileSync(__dirname + "/db.json", JSON.stringify(data, null, 2));
  }


server.get('/api/user', (req, res) => {
  //const users = router.db.get('user').value();
  const data = readDataFromFile();
  console.log(data)
  res.json(data.user);
});

server.get('/getblood', (req, res) => {
  const data = readDataFromFile();
  const { group,type} = req.body;
  const bloodGroup = data.blood.find(blood => Object.keys(blood)[0] === group);

  if (type == 'donner') {
    res.json(bloodGroup[group][0])
  } 
  if (type == 'acceptor') {
    res.json(bloodGroup[group][1]);
  } 
});

server.post('/api/user', (req, res) => {
  const { name, email, password, role, image } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Please provide name, email, password, and role" });
  }
  console.log("42",req.body);
  const newUser = {
    id: Math.random().toString(36).substr(2, 9), 
    name,
    email,
    password,
    role,
    image
  };

  // router.db.get('user').push(newUser).write();
  // res.status(201).json(newUser);

  const data = readDataFromFile();
  //console.log("56",data.user)
  data.user.push(newUser);
  writeDataToFile(data);
  res.status(201).json(newUser);
});

server.post('/api/product', (req, res) => {
  const { name, price, color, weight, by } = req.body;

  if (!name || !price || !color || !weight || !by) {
    return res.status(400).json({ error: "Please provide name, price, color, weight, and by" });
  }

  const newProduct = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    price,
    color,
    weight,
    by
  };

  router.db.get('product').push(newProduct).write();
  res.status(201).json(newProduct);
});

server.put('/api/product/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price, color, weight, by } = req.body;

  // Find the product by ID
  const product = router.db.get('product').find({ id: productId }).value();

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Update the product properties if provided
  if (name) {
    product.name = name;
  }
  if (price) {
    product.price = price;
  }
  if (color) {
    product.color = color;
  }
  if (weight) {
    product.weight = weight;
  }
  if (by) {
    product.by = by;
  }

  // Update the product in the database
  router.db.get('product').find({ id: productId }).assign(product).write();

  res.json(product);
});

server.put('/api/product/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price, color, weight, by } = req.body;

  const product = router.db.get('product').find({ id: productId }).value();

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updatedProduct = {
    ...product,
    name: name || product.name,
    price: price || product.price,
    color: color || product.color,
    weight: weight || product.weight,
    by: by || product.by
  };

  router.db.get('product').find({ id: productId }).assign(updatedProduct).write();
  
  res.json(updatedProduct);
});

server.put('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, password, role, image } = req.body;

  const user = router.db.get('user').find({ id: userId }).value();

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update user properties if provided in the request body
  user.name = name || user.name;
  user.email = email || user.email;
  user.password = password || user.password;
  user.role = role || user.role;
  user.image = image || user.image;

  // Update the user in the database
  router.db.get('user').find({ id: userId }).assign(user).write();

  res.json(user);
});


server.delete('/api/user/:id', (req, res) => {
  const userId = req.params.id;

  const user = router.db.get('user').find({ id: userId }).value();

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Remove the user from the database
  router.db.get('user').remove({ id: userId }).write();

  res.json({ message: "User deleted successfully", deletedUser: user });
});


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

server.get('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  const user = router.db.get('user').find({ email: email }).value();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // bcrypt.compare(password, user.password, (err, result) => {
  //   if (err) {
  //     return res.status(500).json({ error: "Internal server error" });
  //   }

  //   if (!result) {
  //     return res.status(401).json({ error: "Invalid password" });
  //   }
  // });

  const token = jwt.sign({ id: user.id, name:user.name, role:user.role, email: user.email }, 'your_secret_key', { expiresIn: '1h' });
  res.json({ message: "Login successful", token: token });
});


server.use(router);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


//last code
// const express = require('express');
// const app = express();
// const fs = require('fs');

// app.use(express.json());

// const dbFilePath = __dirname + "/db.json";

// // Read data from JSON file
// function readDataFromFile() {
//   const rawData = fs.readFileSync(dbFilePath);
//   return JSON.parse(rawData);
// }

// // Write data to JSON file
// function writeDataToFile(data) {
//   fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
// }

// // Root route handler
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });

// app.get('/api/user', (req, res) => {
//   const data = readDataFromFile();
//   res.json(data.user);
// });

// app.post('/api/user', (req, res) => {
//   const { name, email, password, role, image } = req.body;

//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ error: "Please provide name, email, password, and role" });
//   }

//   const newUser = {
//     id: Math.random().toString(36).substr(2, 9),
//     name,
//     email,
//     password,
//     role,
//     image
//   };

//   const data = readDataFromFile();
//   data.user.push(newUser);
//   writeDataToFile(data);

//   res.status(201).json(newUser);
// });

// const PORT = process.env.PORT || 3030;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


//express code ..
// const express = require('express');
// const app = express();
// const fs = require('fs');
// const cors = require('cors');

// // Middleware to parse JSON body
// app.use(express.json());
// app.use(cors());

// // Read data from JSON file
// function readDataFromFile() {
//   const rawData = fs.readFileSync(__dirname + "/db.json");
//   return JSON.parse(rawData);
// }

// // Write data to JSON file
// function writeDataToFile(data) {
//   fs.writeFileSync(__dirname + "/db.json", JSON.stringify(data, null, 2));
// }

// // Get all users
// app.get('/users', (req, res) => {
//   const data = readDataFromFile();
//   res.json(data.users);
// });

// // Get user by ID
// app.get('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const data = readDataFromFile();
//   const user = data.users.find(user => user.id === id);
//   if (!user) {
//     return res.status(404).json({ error: "User not found" });
//   }
//   res.json(user);
// });

// // Create a new user
// app.post('/users', (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ error: "Please provide name, email, password, and role" });
//   }
  
//   const newUser = {
//     id: Math.random().toString(36).substr(2, 9),
//     name,
//     email,
//     password,
//     role
//   };
  
//   const data = readDataFromFile();
//   data.users.push(newUser);
//   writeDataToFile(data);
  
//   res.status(201).json(newUser);
// });

// // Update user by ID
// app.put('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const { name, email, password, role } = req.body;
  
//   const data = readDataFromFile();
//   const userIndex = data.users.findIndex(user => user.id === id);
//   if (userIndex === -1) {
//     return res.status(404).json({ error: "User not found" });
//   }
  
//   data.users[userIndex] = {
//     ...data.users[userIndex],
//     name: name || data.users[userIndex].name,
//     email: email || data.users[userIndex].email,
//     password: password || data.users[userIndex].password,
//     role: role || data.users[userIndex].role
//   };
  
//   writeDataToFile(data);
  
//   res.json(data.users[userIndex]);
// });

// // Delete user by ID
// app.delete('/users/:id', (req, res) => {
//   const { id } = req.params;
  
//   const data = readDataFromFile();
//   const userIndex = data.users.findIndex(user => user.id === id);
//   if (userIndex === -1) {
//     return res.status(404).json({ error: "User not found" });
//   }
  
//   data.users.splice(userIndex, 1);
//   writeDataToFile(data);
  
//   res.status(204).send();
// });

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

