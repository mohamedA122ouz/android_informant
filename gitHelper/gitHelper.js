import read from "prompt-sync";
import history from "prompt-sync-history";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prompt = read({
    history:history()
});
function createSettingsFile(){
    const settings = {
        username : prompt("Enter your name: "),
        gitRepo : prompt("Add cloning Repo: ")
        
    }

}
let gitSettings = null;
try{
    gitSettings = fs.readFileSync(path.join(__filename,"./gitSettings.json"));
}catch{
    
}
