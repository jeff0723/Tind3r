// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "erc721a-upgradeable/contracts/IERC721AUpgradeable.sol";

interface ITind3rMembership is IERC721AUpgradeable {
    struct Tind3rProfile {
        string name;
        string description;
        string image;
    }

    function createProfile(Tind3rProfile calldata userProfile) external;

    function getUserId(address user) external view returns (uint256 userId);
}
