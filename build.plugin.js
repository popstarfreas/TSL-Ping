var fs = require("fs");
var child_process = require("child_process");

const execOptions = {
    stdio: [
        process.stdin,
        process.stderr,
        process.stdout
    ]
}

try {
    child_process.execSync("npm i ../../pluginreference", execOptions)
    child_process.execSync("npm run build", execOptions)
    fs.renameSync("./build", "./plugin")
} catch (e) {
    console.log(e.message)
    process.exit(1);
}
