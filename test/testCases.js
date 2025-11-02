import { createWriteStream } from "node:fs";
import { commandsController } from "../modules/controller.js";
import { userData } from "../app.js";
import { join } from "node:path";

async function createFileToTest() {
  const data = "some data to read";
  const ws = createWriteStream(
    join(userData.currentDir, "testMegaSuperFile.txt")
  );

  ws.write(data);
  ws.end();
  ws.close();
}

function navigationTest() {
  //run up to see diretory
  commandsController("up");
  //run 3 times more to see Error
  commandsController("up");
  commandsController("up");
  commandsController("up");

  //run cd
  commandsController("cd users");
  commandsController("cd "); //invalid input
  commandsController("cd bababababab"); //operation failed

  //run ls
  commandsController("ls");
}

function osTest() {
  commandsController("os --EOL");
  commandsController("os --cpus");
  commandsController("os --homedir");
  commandsController("os --username");
  commandsController("os --architecture");
  commandsController("os --strange_flag");
}

async function hashTest() {
  await commandsController("add helloFile.txt"); //create to check
  await commandsController("hash    "); //check for invalid input
  await commandsController("hash helloFile.txt"); //check real file
  await commandsController("hash helloFile2.txt"); // check fake file

  setTimeout(() => {
    commandsController("rm helloFile.txt"); //remove file from system
  });
}

async function workWithFilesTest(arg) {
  const name = "testMegaSuperFile.txt";
  // cat
  if (arg == "cat") {
    //create file to check
    await createFileToTest();
    //check for invalid input
    await commandsController("cat");
    await commandsController("cat      ");
    //check for fake file
    await commandsController("cat someFantasticNameForAFile.txt");
    //check for normal file
    await commandsController(`cat ${name}`);
    //remove file from system
    setTimeout(async (handler) => {
      await commandsController(`rm ${name}`);
    }, 1000);
  }
  if (arg == "add") {
    //create file to check
    await createFileToTest();
    //check for invalid input
    await commandsController("add");
    await commandsController("add      ");
    //check for invalid name
    await commandsController("add someFantasti>cNameForAFile.txt");
    //check for already made files
    await commandsController(`add ${name}`);
    //normal check
    await commandsController("add normal.txt");
    setTimeout(async (handler) => {
      await commandsController(`rm ${name}`); //remove file from system
      await commandsController(`rm normal.txt`); //remove file from system
    }, 1000);
  }
  if (arg == "rn") {
    //create file to check
    await createFileToTest();
    //check for invalid input
    await commandsController("rn");
    await commandsController(`rn ${name}     `);
    //check for invalid name
    await commandsController(
      "rn someFantasti>cNameForAFile.txt someFantasti>cNameForAFip.txt"
    );
    //check for already made files
    await commandsController(`rn ${name} ${name}`);
    //normal check
    await commandsController("add normal.txt");
    await commandsController("rn normal.txt renamed.txt");
    setTimeout(async (handler) => {
      await commandsController(`rm ${name}`); //remove file from system
      await commandsController(`rm renamed.txt`); //remove file from system
    }, 1000);
  }
  if (arg == "cp") {
    //create file to check
    await createFileToTest();
    //check for invalid input
    await commandsController("cp");
    await commandsController(`cp ${name}     `);
    //check for invalid name
    await commandsController("cp someFantasti>cNameForAFile.txt source");
    await commandsController(`cp ${name} source2`);

    //normal check
    await commandsController(`cp ${name} source`);
    //check for already made files
    await commandsController(`cp ${name} source`);
    setTimeout(async (handler) => {
      await commandsController(`rm source/${name}`); //remove file from system
      await commandsController(`rm ${name}`); //remove file from system
    }, 1000);
  }
  if (arg == "mv") {
    //create file to check
    await createFileToTest();
    //check for invalid input
    await commandsController("mv");
    await commandsController(`mv ${name}     `);
    //check for invalid name
    await commandsController("mv someFantasti>cNameForAFile.txt source");
    await commandsController(`mv ${name} source2`);

    //normal check
    await commandsController(`mv ${name} source`);
    //check for already made files
    // await createFileToTest();
    // await commandsController(`mv ${name} source`);
    setTimeout(async (handler) => {
      await commandsController(`rm source/${name}`); //remove file from system
      // await commandsController(`rm ${name}`); //remove file from system
    }, 1000);
  }
  if (arg == "rm") {
    //create file to check
    await createFileToTest();
    //check for invalid input
    await commandsController("rm");
    await commandsController(`rm     `);
    //check for invalid name
    await commandsController("rm someFantasti>cNameForAFile.txt");

    //normal check
    await commandsController(`rm ${name}`);
    //check for mistake
    setTimeout(async (handler) => {
      await commandsController(`rm ${name}`); //remove file from system
    }, 1000);
  }
}

//to check each part, remove comments
export async function runTest() {
  // navigationTest();
  // osTest();
  // hashTest();
  // await workWithFilesTest("cat");
  // await workWithFilesTest("add");
  // await workWithFilesTest("rn");
  // await workWithFilesTest("cp");
  // await workWithFilesTest("mv");
  // await workWithFilesTest("rm");
}
