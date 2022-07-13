//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./DemocracyToken.sol";

/// @notice Democracy Token interface
interface IDemocracyToken {
    function mint(address _to, uint256 _amount) external;
}

/**
 @title Mint NFT for Taiwan referendum 2021 
 @author Jeffrey Lin
 */
contract Referendum is ERC721URIStorage {
    /// @notice Fee payer for not onboard users
    address public feePayer;
    /// @notice Total NFT minted
    uint256 public totalSupply;
    /// @notice Starting time of referedum
    uint256 public startTime;
    /// @notice Ending time of referendum
    uint256 public endTime;
    /// @notice Token of democracy spirit
    IDemocracyToken public democracyToken;
    /// @dev If Democracy NFT is minted
    bool private _isDemocracySpiritMinted;
    /// @dev One NFT for one address
    mapping(address => bool) private _isMinted;

    /// @dev Set interval and deploy according Democracy Token
    constructor(uint256 startTime_, uint256 endTime_)
        ERC721("Referendum", "RNFT")
    {
        startTime = startTime_;
        endTime = endTime_;
        democracyToken = IDemocracyToken(address(new DemocracyToken()));
        feePayer = _msgSender();
    }

    /// @notice Mint NFT for others
    function mintTo(string calldata tokenURI_, address to_) public {
        require(
            block.timestamp >= startTime && block.timestamp <= endTime,
            "Mint time hasn't started or has ended"
        );
        require(!_isMinted[to_], "Already minted");
        _isMinted[to_] = true;
        _safeMint(to_, totalSupply);
        _setTokenURI(totalSupply, string(tokenURI_));
        democracyToken.mint(to_, 1e18);
        totalSupply++;
    }

    /// @notice Mint NFT for self
    function mint(string calldata tokenURI_) external {
        mintTo(tokenURI_, _msgSender());
        democracyToken.mint(_msgSender(), 1e18);
    }

    /// @dev Mint Democracy Spirit NFT (only owner)
    function mintDemocracySpiritNFT(string calldata tokenURI_) external {
        require(feePayer == _msgSender(), "Only fee payer");
        require(block.timestamp >= endTime, "Mint time hasn't ended");
        require(!_isDemocracySpiritMinted, "Already minted");
        _isDemocracySpiritMinted = true;
        _mint(address(this), totalSupply);
        _setTokenURI(totalSupply, tokenURI_);
    }

    /// @notice Donate to fee payer and receive Democracy Token
    receive() external payable {
        Address.sendValue(payable(feePayer), msg.value);
        democracyToken.mint(_msgSender(), msg.value);
    }
}
