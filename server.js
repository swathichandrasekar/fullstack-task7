const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

let users = []; // store all submitted users

// Home page (Signup form)
app.get("/", (req, res) => {
  res.render("index");
});

// Handle form submission and show usercard
app.post("/usercard", (req, res) => {
  const { name, email, age, phone, password, course } = req.body;

  const user = {
    id: uuidv4().slice(0, 8),
    name,
    email,
    age,
    phone,
    password,
    course,
    status: "Active",
    signupDate: new Date()
  };

  users.push(user);
  res.render("usercard", { user });
});

// Login page
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Handle login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.render("usercard", { user });
  } else {
    res.render("login", { error: "Invalid email or password" });
  }
});

// User Management page
app.get("/usermanagement", (req, res) => {
  res.render("usermanagement", { users });
});

// Extra: Redirect /users to /usermanagement
app.get("/users", (req, res) => {
  res.redirect("/usermanagement");
});

// Delete user
app.post("/delete/:id", (req, res) => {
  const userId = req.params.id;
  users = users.filter(user => user.id !== userId);
  res.redirect("/usermanagement");
});

// Edit user page
app.get("/edit/:id", (req, res) => {
  const user = users.find(user => user.id === req.params.id);
  if (user) {
    res.render("edit", { user });
  } else {
    res.redirect("/usermanagement");
  }
});

// Handle edited user details
app.post("/update/:id", (req, res) => {
  const { name, email, age, phone, course } = req.body;
  const user = users.find(user => user.id === req.params.id);
  if (user) {
    user.name = name;
    user.email = email;
    user.age = age;
    user.phone = phone;
    user.course = course;
  }
  res.redirect("/usermanagement");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
