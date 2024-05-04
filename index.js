import {IndexUser} from "./IndexUser.js";
import db from './database.json' with {type:"json"};

db.usernames.map(async usr => {
    await IndexUser(usr);
})