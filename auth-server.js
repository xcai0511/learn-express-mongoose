const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const cors = require('cors');

const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',    // never hardcode in source code. hard-coded here for demonstration purposes.
  resave: false,
  saveUninitialized: true
}));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// Set up CSRF protection
app.use(csurf());

// Mock user data
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Mock authentication
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy();
    res.json({ success: true });
  }
  else {
    res.json({ success: false });
  }
});

// Check login status route
app.get('/check-login', (req, res) => {
  const user = req.session.user;
  res.json({ loggedIn: !!user, user });
});

// Start server
const PORT = process.env.PORT || 8001;
let server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = server;