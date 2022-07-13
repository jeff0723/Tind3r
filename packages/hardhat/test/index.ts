import { assert } from "chai";
import { ethers, deployments, network } from "hardhat";
import { DemocracyToken__factory, Referendum__factory } from "../../frontend/src/typechain";

describe("Referendum", function () {
  it("mint", async function () {
    // Accounts
    const [dev, user0, user1, user2] = await ethers.getSigners();

    // Deployment
    console.log("deploy");
    await deployments.fixture(["referendum"]);
    const referendumDeployment = await deployments.get("Referendum");
    const referendumContract = Referendum__factory.connect(
      referendumDeployment.address,
      dev
    );
    const democracyTokenContract = DemocracyToken__factory.connect(
      await referendumContract.democracyToken(),
      dev
    )

    const baseURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";

    // self-mint
    console.log("self-mint");
    const tokenURI0 = baseURI + "0";
    const tx0 = await referendumContract.connect(user0).mint(tokenURI0);
    await tx0.wait();
    assert(
      (await referendumContract.tokenURI(0)) === tokenURI0,
      "tokenURI0 error"
    );
    assert(
      (await referendumContract.ownerOf(0)) === user0.address,
      "owner0 error"
    );
    assert(
      ethers.utils.parseEther("2").eq(await democracyTokenContract.balanceOf(user0.address)),
      "user0 DOM balance error"
    );

    // free-mint
    console.log("free-mint");
    const tokenURI1 = baseURI + "1";
    const tx1 = await referendumContract.connect(dev).mintTo(tokenURI1, user1.address);
    await tx1.wait();
    assert(
      (await referendumContract.tokenURI(1)) === tokenURI1,
      "tokenURI1 error"
    );
    assert(
      (await referendumContract.ownerOf(1) === user1.address),
      "owner1 error"
    );
    assert(
      ethers.utils.parseEther("1").eq(await democracyTokenContract.balanceOf(user1.address)),
      "user1 DOM balance"  
    );    

    // donate
    console.log("donate");
    const devBalance = await dev.getBalance();
    const donate = ethers.utils.parseEther("5");
    const tx = await user2.sendTransaction({
      from: user2.address,
      to: referendumContract.address,
      value: donate
    });
    await tx.wait();
    assert(
      devBalance.add(donate).eq(await dev.getBalance()),
      "dev balance error"
    );
    assert(
      donate.eq(await democracyTokenContract.balanceOf(user2.address)),
      "donator DOM balance error"
    );

    // pass to end time
    console.log("end mint");
    await network.provider.send("evm_setNextBlockTimestamp", [(await referendumContract.endTime()).toNumber()+60]);
    await network.provider.send("evm_mine");

    // mint Democracy Spirit NFT
    console.log("mint Democracy Spirit NFT");
    const tokenURI2 = baseURI + "777";
    const tx2 = await referendumContract.mintDemocracySpiritNFT(tokenURI2);
    await tx2.wait();
    const totalSupply = await referendumContract.totalSupply();
    assert(
      (await referendumContract.tokenURI(totalSupply)) === tokenURI2,
      "tokenURI2 error"  
    );
    assert(
      (await referendumContract.ownerOf(totalSupply)) === referendumContract.address,
      "owner of DS-NFT error"  
    );
  });
});
