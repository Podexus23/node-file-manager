import { basename, extname, join, resolve } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { printWorkingDirectory } from "./printOps.js";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { EOL } from "node:os";

export async function compressFileBrotli(file, destFile) {
  if (!file || !destFile) {
    console.error(
      `Invalid input.${EOL}compress: undefined or wrong data in arguments.`
    );
    printWorkingDirectory();
    return;
  }

  const destPath = extname(destFile)
    ? join(destFile + ".br")
    : join(destFile, basename(file) + ".br");

  const filePath = resolve(file);
  const destArch = resolve(destPath);
  let errCheck = 0;

  const rs = createReadStream(filePath);
  const ws = createWriteStream(destArch, { flags: "wx" });
  const gzip = createBrotliCompress();

  rs.on("error", (error) => {
    console.error(`Operation failed.${EOL}compress: ${error.message}`);
    errCheck++;
  });

  gzip.on("error", (error) => {
    if (!errCheck)
      console.error(`Operation failed.${EOL}compress: ${error.message}`);
    errCheck++;
  });

  ws.on("error", (error) => {});

  rs.pipe(gzip).pipe(ws);
  ws.on("close", () => {
    if (!errCheck) console.log("File compressed");
    printWorkingDirectory();
  });
}

export async function decompressFileBrotli(file, dest) {
  if (!file || !dest) {
    console.error(
      `Invalid input.${EOL}decompress: undefined or wrong data in arguments.`
    );
    printWorkingDirectory();
    return;
  }

  const destPath = extname(dest)
    ? join(dest)
    : join(dest, basename(file, extname(file)));

  const archPath = resolve(file);
  const destFile = resolve(destPath);

  const rs = createReadStream(archPath);
  const ws = createWriteStream(destFile, { flags: "wx" });
  const gzip = createBrotliDecompress();
  let errCheck = 0;

  ws.on("error", (error) => {
    if (!errCheck)
      console.error(`Operation failed.${EOL}decompress: ${error.message}`);
    errCheck++;
  });

  gzip.on("error", (error) => {
    if (!errCheck)
      console.error(`Operation failed.${EOL}decompress: ${error.message}`);
    errCheck++;
  });

  rs.on("error", (error) => {
    console.error(`Operation failed.${EOL}decompress: ${error.message}`);
    errCheck++;
  });

  rs.pipe(gzip).pipe(ws);
  ws.on("close", () => {
    if (!errCheck) console.log("File decompressed");
    printWorkingDirectory();
  });
}
