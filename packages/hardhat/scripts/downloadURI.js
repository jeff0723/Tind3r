const { ethers } = require("hardhat");
const fs = require("fs");
const address = "0x9eE18F9745f60e1d2036486691fCA5F5f64b7Dda";
const outputDir = "../output";
const main = async () => {
  const { deployer } = await getNamedAccounts();
  console.log("deployer: ", deployer);
  console.log(typeof deployer);
  ethers.getContract;
  const referendumContract = await ethers.getContractFactory("Referendum");
  const referendum = await referendumContract.attach(address);
  console.log(referendum.address);
  const output = [];
  const totalSupply = (await referendum.totalSupply()).toNumber();
  for (let i = 0; i < totalSupply; ++i) {
    const uri = await referendum.tokenURI(i);
    console.log(i);
    output.push(uri);
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  fs.writeFileSync(`${outputDir}/metadata.json`, JSON.stringify(output));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
