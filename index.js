const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const cors = require('cors');
const port = process.env.PORT || 3030;

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get('/api/user', (req, res) => {
  const users = router.db.get('user').value();
  console.log("lknfeovi")
  res.json(users);
});

server.post('/api/user', (req, res) => {
  const { name, email, password, role, image } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Please provide name, email, password, and role" });
  }

  const newUser = {
    id: Math.random().toString(36).substr(2, 9), 
    name,
    email,
    password,
    role,
    image
  };

  router.db.get('user').push(newUser).write();
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

server.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  const user = router.db.get('user').find({ email: email }).value();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!result) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ message: "Login successful", token: token });
  });
});


server.use(router);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
