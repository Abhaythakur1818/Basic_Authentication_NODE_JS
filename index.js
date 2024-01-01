const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = 80;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];



const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};



app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user)
  {   
    req.session.user = user;
    res.cookie('user_id', user.id);
    res.json({ success: true, message: 'Login successful' });
  } 
  else 
  {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});



app.post('/logout', isAuthenticated, (req, res) => { 
  req.session.destroy();
  res.clearCookie('user_id');
  res.json({ success: true, message: 'Logout successful' });
});



app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  res.json({ success: true, message: 'Signup successful' });
});


app.get('/dashboard', isAuthenticated, (req, res) => {
  res.json({ success: true, message: 'Welcome to the dashboard, ' + req.session.user.username + '!' });
});

// app.get('/', (req,res) =>{
//     res.send("HEllo World");
// })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
