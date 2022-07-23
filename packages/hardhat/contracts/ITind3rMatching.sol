// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC1155Upgradeable.sol";

interface ITind3rMatching is IERC1155Upgradeable {
    event Match(uint256 aUserId, uint256 bUserId);

    event Block(uint256 aUserId, uint256 bUserId);

    error NotCallByMembershipContract();

    function mint(
        address aUser,
        uint256 aUserId,
        address bUser,
        uint256 bUserId
    ) external;

    function getMatches(address user)
        external
        view
        returns (uint32[] memory matchedIds);
}
