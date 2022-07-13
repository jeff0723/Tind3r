const fs = require("fs");
const request = require("request");
const imageURI = JSON.parse(require("../../output/imageURI.json"));
console.log(imageURI);
// const download = (uri, filename, callback) => {
//   request.head(uri, (err, res, body) => {
//     console.log("content-type:", res.headers["content-type"]);
//     console.log("content-length:", res.headers["content-length"]);

//     request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
//   });
// };

// download("https://www.google.com/images/srpr/logo3w.png", "google.png", () => {
//   console.log("done");
// });
