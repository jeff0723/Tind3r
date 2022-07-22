import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades, network } from "hardhat";

const initBaseURI = "https://testnet.tableland.network/query?";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { save } = hre.deployments;
    const chainId = await hre.getChainId();
    console.log("network:", network.name, `(${chainId})`);

    const Tind3rMembership = await ethers.getContractFactory("Tind3rMembership");

    // deploy
    const proxy = await upgrades.deployProxy(
        Tind3rMembership,
        [initBaseURI],
        { kind: 'uups' }
    );
    await proxy.deployed();
    console.log("Tind3rMembership Proxy:", proxy.address);
    const logicAddress = await upgrades.erc1967.getImplementationAddress(proxy.address);
    console.log("Tind3rMembership Logic:", logicAddress);

    // save proxy artifact
    const proxyArtifact = await hre.deployments.getArtifact('Tind3rMembership');
    const proxyDeployments = {
        address: proxy.address,
        ...proxyArtifact
    };
    await save('Tind3rMembership', proxyDeployments);

    // save logic artifact for verification
    const logicArtifact = await hre.deployments.getExtendedArtifact('Tind3rMembership');
    const logicDeployments = {
        address: logicAddress,
        ...logicArtifact
    };
    await save('Tind3rMembershipLogic', logicDeployments);
};
export default func;
func.tags = ["deployMembership", "deploy"];