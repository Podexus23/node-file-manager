import {
  coptFileOp,
  createFileOp,
  deleteFileOp,
  moveFileOp,
  readFileOp,
  renameFileOp,
} from "./mngOps.js";
import { goToPath, pathUp, showCurrentLs } from "./pathAndLsOps.js";
import { hashOps } from "./hashOps.js";
import { compressFileBrotli, decompressFileBrotli } from "./compressionOps.js";
import { osOps } from "./osOps.js";
import { printGoodBye, printWorkingDirectory } from "./printOps.js";
import { runTest } from "../test/testCases.js";
import { EOL } from "node:os";
import { normalize } from "node:path";

const allCommands = {
  up: "up",
  cd: "cd path_to_directory",
  ls: "ls",
  cat: "cat path_to_file",
  add: "add new_file_name",
  rn: "rn path_to_file new_filename",
  cp: "cp path_to_file path_to_new_directory",
  mv: "mv path_to_file path_to_new_directory",
  rm: "rm path_to_file",
  os: `\tos --EOL${EOL}\tos --cpus${EOL}\tos --homedir${EOL}\tos --username${EOL}\tos --architecture`,
  hash: "hash path_to_file",
  compress: "compress path_to_file path_to_destination",
  decompress: "decompress path_to_file path_to_destination",
};

function getCommHelp() {
  for (let key in allCommands) {
    console.log(`${key}: ${allCommands[key]}`);
  }
}

function checkSpacedPath(data) {
  const splittedData = data.split(" ");
  let words = [];
  const brackets = ["'", '"', "`"];
  let longPath = [];
  let starter;

  for (let word of splittedData) {
    word.trim();
    if (brackets.includes(word[0]) && word[0] === word.at(-1)) {
      words.push(word);
    } else if (brackets.includes(word[0]) && !starter) {
      longPath.push(word);
      starter = word[0];
    } else if (word.at(-1) === starter) {
      let longWord;
      longPath.push(word);
      starter = null;
      longWord = longPath.join(" ").slice(1, -1);
      words.push(longWord);
      longPath = [];
    } else if (starter) {
      longPath.push(word);
    } else words.push(word);
  }
  return words.map((e) => normalize(e)).filter((e) => e);
}

export async function commandsController(data) {
  let inputData = data.toString().trim();
  const sortedInputData = checkSpacedPath(inputData);

  // check for operation
  switch (sortedInputData[0]) {
    case "os":
      osOps(sortedInputData[1]);
      printWorkingDirectory();
      break;
    case "up":
      pathUp();
      printWorkingDirectory();
      break;
    case "cd":
      await goToPath(sortedInputData[1]);
      printWorkingDirectory();
      break;
    case "ls":
      await showCurrentLs();
      printWorkingDirectory();
      break;
    case "hash":
      const hashRes = await hashOps(sortedInputData[1]);
      if (hashRes) console.log(`Hash for your file${EOL}` + hashRes);
      printWorkingDirectory();
      break;
    case "cat":
      readFileOp(sortedInputData[1]);
      break;
    case "add":
      await createFileOp(sortedInputData[1]);
      break;
    case "rn":
      renameFileOp(sortedInputData[1], sortedInputData[2]);
      break;
    case "cp":
      coptFileOp(sortedInputData[1], sortedInputData[2]);
      break;
    case "mv":
      moveFileOp(sortedInputData[1], sortedInputData[2]);
      break;
    case "rm":
      deleteFileOp(sortedInputData[1]);
      break;
    case "compress":
      compressFileBrotli(sortedInputData[1], sortedInputData[2]);
      break;
    case "decompress":
      decompressFileBrotli(sortedInputData[1], sortedInputData[2]);
      break;
    case ".exit":
      printGoodBye();
      process.exit(0);
      break;
    case "help":
      getCommHelp();
      printWorkingDirectory();
      break;
    // case "test":
    //   runTest();
    //   break;

    default:
      console.log(
        `Sorry, no such command as "${sortedInputData[0]}".${EOL}Type 'help' to see all available commands`
      );
      printWorkingDirectory();
      break;
  }
}
