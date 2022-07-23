// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC1155Upgradeable.sol";

interface ITind3rMatching is IERC1155Upgradeable {
    // Emit Match if both users like each other
    event Match(uint256 aUserId, uint256 bUserId);

    // Emit Block when one address dislike another address
    event Block(uint256 aUserId, uint256 bUserId);

    // Revert when user isn't Tind3r user
    error NotCallByMembershipContract();

    // Mint A's token to B and B's to A if match
    function mint(
        address aUser,
        uint256 aUserId,
        address bUser,
        uint256 bUserId
    ) external;

    // Get user all matches
    function getMatches(address user)
        external
        view
        returns (uint32[] memory matchedIds);
}
