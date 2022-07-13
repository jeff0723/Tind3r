//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 @title Democracy Token (fractional token for Democracy Spirit NFT)
 @author Jeffrey Lin
 */
contract DemocracyToken is ERC20("DemocracyToken", "DOM") {
    /// @notice Address of ReferendumNFT contract
    address public referendumNFTAddress;

    /// @dev Set address
    constructor() {
        referendumNFTAddress = _msgSender();
    }

    /// @dev Only mint by ReferendumNFT contract
    function mint(address _to, uint256 _amount) external {
        require(
            _msgSender() == referendumNFTAddress,
            "Only master contract can mint"
        );
        _mint(_to, _amount);
    }
}
