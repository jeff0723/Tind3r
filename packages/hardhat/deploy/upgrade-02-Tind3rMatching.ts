import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades, network } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { save, get, execute } = hre.deployments;
    const chainId = await hre.getChainId();
    const { deployer } = await hre.getNamedAccounts();
    console.log("network:", network.name, `(${chainId})`);
    const Tind3rMatching = await ethers.getContractFactory("Tind3rMatching");

    // get proxy address
    const proxy = await get("Tind3rMatching");
    console.log("Tind3rMatching proxy:", proxy.address);
    const logicAddress = await upgrades.erc1967.getImplementationAddress(proxy.address);
    console.log("Tind3rMatching logic:", logicAddress);

    // upgrade
    console.log("upgrading...");
    const newProxy = await upgrades.upgradeProxy(proxy.address, Tind3rMatching);
    console.log("Tind3rMatching proxy:", newProxy.address);
    await newProxy.deployed();
    const newLogicAddress = await upgrades.erc1967.getImplementationAddress(newProxy.address);
    console.log("Tind3rMatching logic:", newLogicAddress);
    if (proxy.address === newProxy.address) {
        console.log("success!");
    }
    else {
        console.log("error!");
        return;
    }

    // save proxy artifact
    const proxyArtifact = await hre.deployments.getArtifact('Tind3rMatching');
    const proxyDeployments = {
        address: newProxy.address,
        ...proxyArtifact
    };
    await save('Tind3rMatching', proxyDeployments);

    // save logic artifact for verification
    const logicArtifact = await hre.deployments.getExtendedArtifact('Tind3rMatching');
    const logicDeployments = {
        address: newLogicAddress,
        ...logicArtifact
    };
    await save('Tind3rMatchingLogic', logicDeployments);

    await execute("Tind3rMembership", { from: deployer }, "setMatchingContract", proxy.address);
};
export default func;
func.tags = ["upgradeMatching", "upgrade"];
