import read from "prompt-sync";
import history from "prompt-sync-history";
import fs from "fs/promises";
const prompt = read({
    history:history()
});
fs.
let username = prompt("Enter your name: ");
