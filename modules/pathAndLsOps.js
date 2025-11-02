import path from "path";
import fs from "fs/promises";
import { userData } from "../app.js";
import { EOL } from "os";

export function pathUp() {
  if (path.parse(userData.currentDir).root == userData.currentDir) {
    console.error(
      `Operation failed.${EOL}up: you've reached the root folder ${userData.currentDir}`
    );
    return;
  }
  const newPath = path.dirname(userData.currentDir);
  userData.currentDir = newPath;
  process.chdir(userData.currentDir);
}

export async function goToPath(newPath) {
  if (!newPath) {
    console.error(
      `Invalid input.${EOL}cd: undefined or wrong data in arguments.`
    );
    return;
  }
  const absolutePath = path.resolve(newPath);

  try {
    await fs.access(absolutePath);
    userData.currentDir = absolutePath;
    process.chdir(userData.currentDir);
  } catch (error) {
    console.error(`Operation failed.${EOL}cd: ${error.message}`);
  }
}

export async function showCurrentLs() {
  try {
    const lsData = await fs.readdir(userData.currentDir, {
      withFileTypes: true,
    });
    const showData = lsData
      .map((e) => {
        return {
          ["Name"]: e.name,
          ["Type"]: e.isDirectory() ? "directory" : e.isFile() ? "file" : null,
        };
      })
      .filter((e) => e.Type != null);
    const dir = showData
      .filter((e) => e.Type == "directory")
      .sort((a, b) => a.Name.localeCompare(b.Name));
    const files = showData
      .filter((e) => e.Type == "file")
      .sort((a, b) => a.Name.localeCompare(b.Name));
    const concatSortedData = [...dir, ...files];
    console.table(concatSortedData);
  } catch (error) {
    console.error(error.message);
  }
}
