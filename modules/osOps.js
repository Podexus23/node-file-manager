import os, { EOL } from "node:os";

export function osOps(flag) {
  switch (flag) {
    case "--EOL": {
      console.log(`On this system EOL is ${JSON.stringify(EOL)}`);
      break;
    }
    case "--cpus": {
      let cpusData = os.cpus();
      console.log(`Overall amount of logical CPUs: ${cpusData.length}`);
      console.log("Models:");
      for (let cpu of cpusData) {
        console.log(
          `${cpu.model.trim()}. Speed: ${(cpu.speed / 1000).toFixed(2)} GHz`
        );
      }
      break;
    }
    case "--homedir": {
      console.log("Home directory is:", os.homedir());
      break;
    }
    case "--username": {
      console.log("Host name for this PC is:", os.hostname());
      break;
    }
    case "--architecture": {
      console.log("This Pc works on", os.arch(), "architecture");
      break;
    }
    default: {
      console.error(
        `Invalid input.${EOL}os: No such flag for os command, try one of these: --EOL, --cpus, --homedir, --username, --architecture`
      );
    }
  }
}
