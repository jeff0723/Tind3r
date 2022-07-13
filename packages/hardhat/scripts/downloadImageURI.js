const fs = require("fs");
const https = require("https");
const metadata = JSON.parse(fs.readFileSync("../output/metadata.json"));
const access = fs.createWriteStream("../output/imageURI.json");
process.stdout.write = process.stderr.write = access.write.bind(access);

const resolveLink = (url) => {
  if (!url || !url.includes("ipfs://")) return url;
  return url.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
};
for (const uri of metadata) {
  const req = https.get(resolveLink(uri), (res) => {
    res.on("data", (d) => {
      const data = JSON.parse(d);
      console.log(`"${data.image}",`);
    });
  });
  req.end();
}
