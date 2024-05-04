import log from 'shittylog';
import Database from "easy-json-database";

const db = new Database('./database.json');

if (!((typeof db.get("usernames")) == "object")) {
    db.push("usernames", "dumorando")
}

function Add(username) {
    if (db.get("usernames").includes(username)) return;
    log("bgBlue", `Added ${username}`);
    db.push("usernames", username);
}

export default {
    AddUsername: Add
}