import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const root = process.env.INIT_CWD;
if(!root || root === process.cwd()) process.exit(0);

const indexPath = join(root, "pages", "index.html");
if(!existsSync(indexPath)){
  mkdirSync(join(root, "pages"), { recursive: true });
  writeFileSync(indexPath, "<h1>Hello World</h1>\n");
  console.log("kempo-app: created pages/index.html");
}
