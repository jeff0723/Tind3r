import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades, network } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { save, get, execute } = hre.deployments;
    const chainId = await hre.getChainId();
    const { deployer } = await hre.getNamedAccounts();
    console.log("network:", network.name, `(${chainId})`);
    const t3mDeployment = await get("Tind3rMembership");
    const t3mAddress = t3mDeployment.address;

    const Tind3rMatching = await ethers.getContractFactory("Tind3rMatching");

    // deploy
    const proxy = await upgrades.deployProxy(
        Tind3rMatching,
        [t3mAddress],
        { kind: 'uups' }
    );
    await proxy.deployed();
    console.log("Tind3rMatching Proxy:", proxy.address);
    const logicAddress = await upgrades.erc1967.getImplementationAddress(proxy.address);
    console.log("Tind3rMatching Logic:", logicAddress);

    // save proxy artifact
    const proxyArtifact = await hre.deployments.getArtifact('Tind3rMatching');
    const proxyDeployments = {
        address: proxy.address,
        ...proxyArtifact
    };
    await save('Tind3rMatching', proxyDeployments);

    // save logic artifact for verification
    const logicArtifact = await hre.deployments.getExtendedArtifact('Tind3rMatching');
    const logicDeployments = {
        address: logicAddress,
        ...logicArtifact
    };
    await save('Tind3rMatchingLogic', logicDeployments);

    await execute("Tind3rMembership", { from: deployer }, "setMatchingContract", proxy.address);
};
export default func;
func.tags = ["deployMatching", "deploy"];