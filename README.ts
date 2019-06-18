import Bluebird from "bluebird";
// tslint:disable-next-line:no-implicit-dependencies
import Handlebars from "handlebars";
import request from "request";

import { readFile, writeFile } from "./lib/utility/fs";

import { execSync } from "child_process";

Handlebars.registerHelper("bash", (command: string) => {
  return execSync(command).toString("ascii");
});

async function fromGithub(endpoint: string) {
  return Bluebird.promisify(request)({
    method: "GET",
    url: "https://api.github.com/" + endpoint,
    json: true,
    headers: { "User-Agent": "README generator" }
  }).then((response: request.RequestResponse & { body: any }) => response.body);
}

Promise.all([
  readFile("./README.handlebars", "utf8"),
  fromGithub("repos/2fd/graphdoc"),
  fromGithub("repos/2fd/graphdoc/contributors").then(
    (contributors: Array<{ login: string }>) =>
      contributors.filter(c => c.login !== "2fd")
  )
]).then(([template, project, contributors]) => {
  return writeFile(
    "README.md",
    Handlebars.compile(template)({ project, contributors })
  );
});
