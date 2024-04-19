import read from "prompt-sync";
import history from "prompt-sync-history";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import child from "child_process";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prompt = read({
    history: history()
});
const currentPath = (data) => path.join(__dirname, data || "");
function writeSetting(data) {
    try {
        fs.writeFileSync(currentPath("./gitSettings.json"), JSON.stringify(data));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
function readSetting() {
    try {
        return JSON.parse(fs.readFileSync(currentPath("./gitSettings.json"), JSON.stringify(data)));
    } catch (e) {
        console.log(e);
        return false;
    }
}
function updateSetting() {
    let setting = readSetting();
    if (setting !== false)
        settings.gitSettings = setting;
    else console.log("Faild to Update settings.gitSettings");
}
const commandOptions = { cwd: currentPath("../") };
const settings = { gitSettings: null };
function createSettings() {
    const setting = {
        mainBranch: "main",
        username: prompt("Enter your name: "),
        gitRepo: prompt("Add cloning Repo(Press Enter with no input for default): ") || "https://github.com/mohamedA122ouz/android_informant.git",
        AllowBranches: false,
        AlreadyExistProject: (prompt("Did you created Your Own Project or Not Y/N: ").toLowerCase()).includes("y"),
        initialized: false,
        localBranch: settings.mainBranch
    }
    return setting;
}
try {
    settings.gitSettings = JSON.parse(fs.readFileSync(currentPath("gitSettings.json")));
} catch {
    settings.gitSettings = createSettings();
    fs.writeFileSync(currentPath("gitSettings.json"), JSON.stringify(settings.gitSettings));
}
const git = {
    init: "git init",
    clone: `git clone ${settings.gitSettings.gitRepo}`,
    commit: () => `git commit -m "${prompt("Insert Message: ")}"`,
    add: "git add .",
    finishIt: function () { return `${this.add}\n${this.commit()}\n${this.push()}` },
    switch: (branch) => "git switch " + branch,
    branch: (branch) => "git branch " + branch,
    push: () => `git push -u origin ${settings.gitSettings.localBranch}`,
    setRemoteOrigin: `git remote add origin ${settings.gitSettings.gitRepo}`,
    linkExistedProject: `git pull origin ${settings.gitSettings.mainBranch} --allow-unrelated-histories`,
    pull: "git pull",
    renameCurrent:`git branch -M ${settings.gitSettings.mainBranch}`
}
if (!settings.gitSettings.initialized) {
    if (settings.gitSettings.AlreadyExistProject) {
        try {
            let existedFiles = fs.readdirSync(currentPath("../"));
            if (existedFiles.includes(".git")) {
                child.execSync(git.branch(settings.gitSettings.localBranch), commandOptions);
                child.execSync(git.switch(settings.gitSettings.localBranch), commandOptions);
                child.execSync(git.setRemoteOrigin, commandOptions);
                child.execSync(git.linkExistedProject, commandOptions);
            } else {
                throw "Not Exist";
            }
        } catch {
            try {
                child.execSync(git.init, commandOptions);
                child.execSync(git.renameCurrent, commandOptions);
                child.execSync(git.branch(settings.gitSettings.localBranch), commandOptions);
                child.execSync(git.switch(settings.gitSettings.localBranch), commandOptions);
                child.execSync(git.add, commandOptions);
                child.execSync(git.commit(), commandOptions);
            } catch (e) {
                if (e.toString().includes(`git config --global user.email "you@example.com"`)) {
                    console.log("Hold on While Authentication in process");
                    child.execSync(`git config --global user.name "${settings.gitSettings.username}"`);
                    child.execSync(git.add, commandOptions);
                    child.execSync(git.commit(), commandOptions);
                }
            }
            try {
                child.execSync(git.setRemoteOrigin, commandOptions);
                child.execSync(git.linkExistedProject, commandOptions);
                settings.gitSettings.initialized = true;
            } catch (e) {
                if (e.toString().includes("remote origin already exists")) {
                    child.execSync(git.linkExistedProject, commandOptions);
                    settings.gitSettings.initialized = true;
                    writeSetting(settings.gitSettings);
                }
            }
            // child.execSync(git.linkExistedProject, commandOptions);
        }
    } else {
        let repoPath = currentPath(`../${repoFileName}`);
        //clone the repo
        try {
            child.execSync(git.clone, commandOptions);
        } catch (e) { console.log("error"); }
        let repoFileName = settings.gitSettings.gitRepo;
        repoFileName = repoFileName.slice(repoFileName.lastIndexOf("/") + 1, repoFileName.length - 4);
        settings.gitSettings.initialized = true;
        // let nodeCode = `
        // const fs = require("fs");
        // const child = require("child_process");
        // setTimeout(()=>{
        //     fs.cpSync("${currentPath()}","${repoPath}");
        //     fs.rmdirSync("${currentPath()}");
        //     child.execSync(node ${path.join(repoPath,"gitHelper/gitHelper.js")});
        // },2000);
        // `;
        // fs.writeFile(path.join(repoPath,"run.js"),nodeCode);
        // child.execSync(`node ${path.join(repoPath,"run.js")}`);

    }
    let localCommand = {cwd:currentPath("../android_informant")}
    settings.gitSettings.localBranch = settings.gitSettings.username + "_";
    child.execSync(git.renameCurrent,localCommand);
    child.execSync(git.branch(settings.gitSettings.localBranch),localCommand);
    child.execSync(git.switch(settings.gitSettings.localBranch),localCommand);
    writeSetting(settings.gitSettings);
    prompt(`Please Close This window and copy currentFile ${currentPath()} into ${repoPath}`);
}
else {
    function updateMain() {
        try {
            child.execSync(git.switch(settings.gitSettings.mainBranch));
            child.execSync(git.pull);
            child.execSync(git.switch(settings.gitSettings.localBranch));
        }
        catch (e) {
            console.log(e);
        }
    }
    if (prompt("Do you want to update Y/N: ").toLowerCase().includes("y")) {
        updateMain();
    } else {
        if (prompt("Do you want to commit your work Y/N: ").toLowerCase().includes("y")) {
            updateMain();
            child.execSync(git.finishIt(), commandOptions);
        }
    }
}