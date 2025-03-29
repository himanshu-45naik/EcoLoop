const express = require("express");
const axios = require("axios");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, 
    })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const FLASK_API_URL = "http://127.0.0.1:5000";

// Root route
app.get("/", async (req, res) => {
    if (!req.session.username) {
        return res.redirect("/login");
    }
    res.redirect("/home");
});

// Register route
app.get("/register", (req, res) => {
    res.render("register", { error: null });
});

app.post("/register", async (req, res) => {
    try {
        await axios.post(`${FLASK_API_URL}/register`, req.body);
        res.redirect("/login");
    } catch (error) {
        res.render("register", { error: error.response?.data?.error || "Registration failed" });
    }
});

// Login route
app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_API_URL}/login`, req.body, { withCredentials: true });

        if (response.data.username) {
            req.session.username = response.data.username;
            return res.redirect("/home");
        }
        res.render("login", { error: "Invalid credentials" });
    } catch (error) {
        res.render("login", { error: error.response?.data?.error || "Login failed" });
    }
});

// Logout route
app.post("/logout", async (req, res) => {
    try {
        await axios.post(`${FLASK_API_URL}/logout`);
        req.session.destroy(() => {
            res.redirect("/login");
        });
    } catch (error) {
        res.status(500).json({ error: "Error logging out" });
    }
});

// Home page route
app.get("/home", async (req, res) => {
    if (!req.session.username) {
        return res.redirect("/login");
    }
    res.render("home", { username: req.session.username });
});

// Dashboard route
app.get("/dashboard", (req, res) => {
    if (!req.session.username) {
        return res.redirect("/login");
    }
    res.render("dashboard", { username: req.session.username });
});

// Report Waste route
app.get("/report-waste", (req, res) => {
    if (!req.session.username) {
        return res.redirect("/login");
    }
    res.render("report-waste", { username: req.session.username });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Frontend server running at http://localhost:${PORT}`);
});
