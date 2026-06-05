const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DB_FILE = "./database.json";

function readDB() {
    try {
        if (!fs.existsSync(DB_FILE)) return {};
        return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    } catch {
        return {};
    }
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
    res.send("Whitelist API Online");
});

app.get("/check/:username", (req, res) => {
    const username = req.params.username.toLowerCase();
    const db = readDB();

    res.json({
        whitelisted: !!db[username]
    });
});

app.post("/whitelist", (req, res) => {
    const { robloxUser, discordId } = req.body;

    if (!robloxUser || !discordId) {
        return res.status(400).json({
            error: "Missing data"
        });
    }

    const db = readDB();

    db[robloxUser.toLowerCase()] = discordId;

    saveDB(db);

    res.json({
        status: "success",
        message: `${robloxUser} added to whitelist`
    });
});

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
