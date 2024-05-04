import fetch from "node-fetch";
import udm from './UsernameDatabaseManager.js';
import log from 'shittylog';

const wait = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

const retryFetch = async (url) => {
    let data = [];
    while (true) {
        try {
            data = await fetch(url).then(data => data.json());
            break;
        } catch (err) {
            log("bgRed", "Failed network attempt; retrying..");
            await wait(1000);
        }
    }
    return data;
};

export async function IndexUser(username) {
    console.log(username)
    udm.AddUsername(username);
    let runcount = 0;
    let offset = 0;
    while (true) {
        let followers = await retryFetch(`https://api.scratch.mit.edu/users/${username}/followers?limit=40&offset=${offset}`);
        if (runcount > 25 || followers.length == 0) break;
        followers.map(async user => {
            console.log(user.username)
            if (user.username) {
                await IndexUser(user.username);
            }
        });
        runcount++;
        offset += 40;
    }
    //now do the same with theyre following
    offset = 0;
    runcount = 0;
    while (true) {
        let following = retryFetch(`https://api.scratch.mit.edu/users/${username}/followers?limit=40&offset=${offset}`);
        if (following.length == 0 || runcount > 25) break;
        following.map(async user => {
            console.log(user.username)
            if (user.username) {
                await IndexUser(user.username);
            }
        });
        runcount++;
        offset += 40;
    }
}