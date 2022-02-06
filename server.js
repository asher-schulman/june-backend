///////////////////////////
// Environmental Variables
///////////////////////////
require("dotenv").config();
const { PORT, MONGODBURI, NODE_ENV } = process.env

const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authRouter = require("./controllers/auth");
const apiRouter = require("./controllers/api");

const app = express();

//MONGO CONNECTION
const DB = mongoose.connection;

mongoose.connect(MONGODBURI, {
  useUnifiedTopology: true, 
  useNewUrlParser: true
});

DB.on("open", () => console.log("connected to mongo database"))
  .on("close", () => console.log("disconnected to mongo database"))
  .on("error", (err) => console.log(err));

////////////
//MIDDLEWARE
////////////
// NODE_ENV === "production" ? app.use(cors(corsOptions)) : app.use(cors());
app.use(cors({
  origin: "https://june-weather.herokuapp.com",
  credentials: true
}))
app.use(express.json());
app.use(morgan("tiny")); //logging
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// should only be storing usr IDs instead of entire user object in these cookies... just for testing and dev
passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user);
})

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  // successful authentication
  // insert into DB
  console.log(profile);
  cb(null, profile);
  // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //   return cb(err, user);
  // });
}));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect frontendhomeurl?.
    res.redirect('https://june-weather.herokuapp.com');
  });

// get around heroku by pinging the server every 5 minutes
setInterval(function() {
    app.get("https://june-backend.herokuapp.com", (req, res) => {
      console.log('wake up!')
    });
}, 300000); // every 5 minutes (300000)

///////////////
//Routes and Routers
//////////////

//Route for testing server is working
app.get("/", (req, res) => {
  res.send("Hello World! use route '/api' to see more documentation");
});

app.get("/json", (req, res) => {
  res.json({ hello: "Hello World!" });
});

// API Routes send to api router
app.use("/api", apiRouter);
app.use("/auth", authRouter);

//LISTENER
app.listen(PORT, () => {
  console.log(`server started and listening on port ${PORT}`);
});
