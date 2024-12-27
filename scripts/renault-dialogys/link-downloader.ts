import fs from "fs";
import path from "path";

function downloadFile(filePath: string, dirPath: string) {
  const json = Object.values(
    JSON.parse(fs.readFileSync(filePath, "utf8"))
  ).flat();
  console.log("Found:", json, dirPath);
  for (const line of json) {
    const filepath = `${dirPath}/${line.filename.replaceAll("/", "_")}`;
    if (fs.existsSync(filepath)) {
      continue;
    }
    fs.appendFileSync(
      "curl.sh",
      `
curl '${line.path}' -o "${filepath}" -f \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: en-US,en;q=0.9,hr;q=0.8' \
  -H 'cache-control: no-cache' \
  -H 'cookie: dtCookie=' \
  -H 'pragma: no-cache' \
  -H 'priority: u=0, i' \
  -H 'referer: https://newdialogys.renault.com/' \
  -H 'sec-ch-ua: "Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: same-site' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    `.trim() + "\n"
    );
  }
}

function findFile(startPath, fileName) {
  if (!fs.existsSync(startPath)) {
    console.log("Directory does not exist:", startPath);
    return;
  }

  const files = fs.readdirSync(startPath);

  for (const file of files) {
    const filePath = path.join(startPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFile(filePath, fileName);
    } else if (file === fileName) {
      downloadFile(filePath, startPath);
    }
  }
}

const startDirectory = "./Clio";
const fileName = "links.json";

findFile(startDirectory, fileName);
