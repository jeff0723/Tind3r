import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { BigNumber } from "@ethersproject/bignumber";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy, read } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const startMint =
    chainId === "137"
      ? BigNumber.from(new Date(2021, 11, 18, 8).getTime()).div(1000)
      : BigNumber.from(new Date().getTime()).div(1000).sub(60); // for test
  const endMint = startMint.add(40 * 60 * 60);
  const referendum = await deploy("Referendum", {
    from: deployer,
    args: [startMint, endMint],
    gasPrice: BigNumber.from("100000000000"),
  });
  console.log("Referendum deployed to:", referendum.address);
  console.log(
    "DemocracyToken deployed to:",
    await read("Referendum", "democracyToken")
  );
};
export default func;
func.tags = ["referendum"];
