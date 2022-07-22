import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades, network } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { save, get } = hre.deployments;
    const chainId = await hre.getChainId();
    console.log("network:", network.name, `(${chainId})`);
    const Tind3rMembership = await ethers.getContractFactory("Tind3rMembership");

    // get proxy address
    const proxy = await get("Tind3rMembership");
    console.log("Tind3rMembership proxy:", proxy.address);
    const logicAddress = await upgrades.erc1967.getImplementationAddress(proxy.address);
    console.log("Tind3rMembership logic:", logicAddress);

    // upgrade
    console.log("upgrading...");
    const newProxy = await upgrades.upgradeProxy(proxy.address, Tind3rMembership);
    console.log("Tind3rMembership proxy:", newProxy.address);
    await newProxy.deployed();
    const newLogicAddress = await upgrades.erc1967.getImplementationAddress(newProxy.address);
    console.log("Tind3rMembership logic:", newLogicAddress);
    if (proxy.address === newProxy.address) {
        console.log("success!");
    }
    else {
        console.log("error!");
        return;
    }

    // save proxy artifact
    const proxyArtifact = await hre.deployments.getArtifact('Tind3rMembership');
    const proxyDeployments = {
        address: newProxy.address,
        ...proxyArtifact
    };
    await save('Tind3rMembership', proxyDeployments);

    // save logic artifact for verification
    const logicArtifact = await hre.deployments.getExtendedArtifact('Tind3rMembership');
    const logicDeployments = {
        address: newLogicAddress,
        ...logicArtifact
    };
    await save('Tind3rMembershipLogic', logicDeployments);
};
export default func;
func.tags = ["upgradeMembership", "upgrade"];
