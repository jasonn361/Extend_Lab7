const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const hbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");

const homeHandler = require("./controllers/home");
const roomHandler = require("./controllers/room");
const signupHandler = require("./controllers/signup");

const app = express();
const port = 8080;

const mongoURI =
  "mongodb+srv://hnguy513:OdoXPO84kYDxjG4f@cluster0.owidxmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get("/", homeHandler.getHome);
app.post("/create", homeHandler.createRoom);
app.get("/signup", signupHandler.getSignup);
app.post("/signup", signupHandler.postSignup);
app.post("/login", signupHandler.postLogin);
app.post("/logout", signupHandler.logout);

app.get("/:roomName", roomHandler.getRoom);
app.get("/:roomName/messages", roomHandler.getMessages);
app.post("/:roomName/messages", roomHandler.postMessage);

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
