import fs from "fs";
import path from "path";
import { promisify } from "util";
import axios from "axios";
import chalk from "chalk";
import meow from "meow";

const cli = meow({
  flags: {
    outDir: {
      type: "string",
      default: "papers-dist"
    },
    papers: {
      type: "string",
      default: "papers"
    }
  }
});

const paperDir = cli.flags.papers;
const outDir = cli.flags.outDir;
const manifest = path.join(paperDir, "manifest.json");

const readFile = promisify(fs.readFile);
const copyFile = promisify(fs.copyFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const status = (...datum: any[]) =>
  console.log(chalk.bgBlue(" info "), "   " + datum.join(" "));

const success = (...datum: any[]) =>
  console.log(chalk.bgGreen(" success ") + " " + datum.join(" "));

const error = (...datum: any[]) =>
  console.error(chalk.bgRed(" error ") + "  " + datum.join(" "));

interface Manifest {
  papers: Array<Paper>;
}

interface Paper {
  type: "url" | "file";
  ref: string;
  tags: Array<string>;
}

const xor = (a: boolean, b: boolean): boolean => (a ? !b : b);

const hasKeys = (obj: any, keys: Array<string>): boolean => {
  let keySet = new Set(Object.keys(obj));
  return keys.map(el => keySet.has(el)).reduce((p, c) => p && c);
};

const parsePaper = (data: any): Paper => {
  if (
    !hasKeys(data, ["tags"]) ||
    !xor(hasKeys(data, ["url"]), hasKeys(data, ["file"]))
  ) {
    throw new Error(`Malformed paper ${JSON.stringify(data)}`);
  }
  return {
    type: data.file ? "file" : "url",
    ref: data.file || data.url,
    tags: data.tags
  };
};

const parseManifest = (data: any): Manifest => {
  if (data.papers === undefined || data.papers === null) {
    throw new Error("manifest.papers does not exist");
  }
  return {
    papers: data.papers.map(parsePaper)
  };
};

mkdir(outDir, { recursive: true })
  .catch((_: Error) => {}) // we can ignore if the directory already exists
  .then(() => readFile(manifest))
  .then(buff => JSON.parse(buff.toLocaleString()))
  .then(parseManifest)
  .then(manifest =>
    Promise.all(
      manifest.papers.map(paper => {
        if (paper.type === "file") {
          return copyFile(
            path.join(paperDir, paper.ref),
            path.join(outDir, path.basename(paper.ref))
          )
            .then(_ => status(`${paper.ref} ${chalk.green("OK")}`))
            .catch(_ => error(`${paper.ref} ${chalk.red("ERR")}`));
        } else {
          return axios
            .get(paper.ref)
            .then(resp =>
              writeFile(path.join(outDir, path.basename(paper.ref)), resp.data)
            )
            .then(_ => status(`${paper.ref} ${chalk.green("OK")}`))
            .catch(_ => error(`${paper.ref} ${chalk.red("ERR")}`));
        }
      })
    ).then(_ => success(`processed ${manifest.papers.length} papers`))
  )
  .catch((e: Error) => error(e.message));
