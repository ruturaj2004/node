const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const PORT = 4000;
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const roles = [
  { name: "admin", permissions: ["get_customer", "create_customer"] },
  { name: "customer", permissions: ["get_customer"] },
];

const customer = [
  { name: "Tushar", role: "customer", password: "abcd" },
  { name: "Rao", role: "admin", password: "1234" },
];

function checkPermission(pname, req, res, next) {
  let user = req.user;
  let role = user.role;
  let roleData = roles.find((r) => r.name === role);
  if (roleData) {
    let hasPermission = roleData.permissions.find((p) => p === pname);
    if (hasPermission) next();
    else {
      res.send("You do not have permssion to call this API");
    }
  }
}

function verifyToken(req, res, next) {
  console.log("Verify token is called");
  let authToken = req.headers["authorization"];
  console.log(authToken);
  if (authToken) {
    let token = authToken.split(" ")[1];
    jwt.verify(token, "thisismysecrete", (err, decoded) => {
      if (err) {
        res.send("Invalid token, you do not have access to call this");
      } else {
        console.log("After verify", decoded);
        req.user = decoded;
        checkPermission("create_customer", req, res, next);
        next();
      }
    });
  } else {
    res.send("You should be logged in to call this api");
  }
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let foundUser = customer.find(
    (c) => c.name === username && c.password === password
  );
  if (!foundUser) {
    res.send("Invalid username or password");
  } else {
    let token = jwt.sign(foundUser, "thisismysecrete");
    res.send(token);
  }
});

app.post(
  "/create_customer",
  verifyToken,
  (req, res) => {
    const { name, role, password } = req.body;
    if (!name || !role || !password) {
      res.send("Invalid data for customer");
    } else {
      customer.push(req.body);
      res.send("Customer created successfully");
    }
  }
);

app.get("/get_customers", verifyToken, (req, res) => {
  res.send(customer);
});

app.listen(PORT, () => {
  console.log("Application is running");
});
