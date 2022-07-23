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

    function updateProfile(Tind3rProfile calldata userProfile) external;

    function like(address user) external;

    function getUserId(address user) external view returns (uint256 userId);

    function isTind3rMember(address user) external view returns (bool);

    function tokenURI(uint256 tokenId) external view returns (string memory);

    function ifLike(address userA, address userB) external view returns (bool);

    function prefixURI() external view returns (string memory);

    function metadataUIR() external view returns (string memory);

    function userStreamIdList(uint256 startId, uint256 endId)
        external
        view
        returns (string memory);

    function isMatched(address userA, address userB)
        external
        view
        returns (bool);

    function getMatches(address user) external view returns (uint32[] memory);
}
