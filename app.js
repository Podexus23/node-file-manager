import { stdin } from "node:process";
import {
  printGoodBye,
  printHello,
  printWorkingDirectory,
} from "./modules/printOps.js";
import { commandsController } from "./modules/controller.js";
import { setUserDir, setUserName } from "./modules/helpers.js";

export const userData = {
  userName: "Username",
  currentDir: "",
};

function main() {
  //start program
  setUserName(userData);
  printHello(userData.userName);
  setUserDir(userData);
  printWorkingDirectory(userData.currentDir);

  //take data from terminal
  stdin.setEncoding("utf-8");
  stdin.on("data", commandsController);

  //exit on ctrl+c
  process.on("SIGINT", (signal) => {
    printGoodBye(userData.userName);
    process.exit(0);
  });
}

main();
