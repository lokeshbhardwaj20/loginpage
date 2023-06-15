const bodyParser = require("body-parser")
const mongoose = require("mongoose")        // mangoose require
const ejs = require("ejs")
const express = require("express")
const app = express()

const session = require("express-session")
const passport = require("passport")
// const LocalStrategy = require("passport-local").Strategy
const passportLocalMongoose = require("passport-local-mongoose")



app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "our little secret.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// ---------------------------------------------------------------------------------------
mongoose.connect("mongodb://127.0.0.1:27017/newUserDB")   // creating db name "newUserDB"

const newUserSchema = new mongoose.Schema({           // creating db schema 
    name: String,
    username: String,
    password: Number

})

newUserSchema.plugin(passportLocalMongoose);

const Signupuser = mongoose.model("Signupuser", newUserSchema)  // creating db model

// passport.use(new LocalStrategy(Signupuser.authenticate()))
passport.serializeUser(Signupuser.serializeUser());
passport.deserializeUser(Signupuser.deserializeUser());
// ---------------------------------------------------------------------------------------
app.get("/", (req, res) => {

    res.render("index")
})

app.get("/signup", (req, res) => {

    res.render("signup")
})

// const userDeatils = []

app.post("/", (req, res) => {
    const loginuser = new Signupuser({
        username: req.body.username,
        password: req.body.password

    });
    req.login(loginuser, function (err) {
        if (err) { console.log(err) } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/main");
            });
        }

    });

    // const loginUser = {
    //     username: req.body.username,
    //     userpassword: req.body.password
    // }

    // userDeatils.push(loginUser)
    // console.log(userDeatils)


    // res.redirect("index")

});

app.get("/main", async (req, res) => {
    loginuser = new Signupuser({
        username: req.body.username,
        password: req.body.password

    });
    if (req.isAuthenticated()) {

        res.render("main",)
    } else {
        res.redirect("/")
    }
})
// const signupDetail = []
app.post("/signup", async (req, res) => {
    try {
        var newUser = new Signupuser({
            name: req.body.newName,
            username: req.body.newEmail,
        });
        Signupuser.register(newUser, req.body.newPassword)
        passport.authenticate("local")(req, res, () => {
            res.redirect("/main");
        });
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


app.listen(3000, () => {
    console.log("server starting at port 3000")
})

