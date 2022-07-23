// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "erc721a-upgradeable/contracts/IERC721AUpgradeable.sol";

interface ITind3rMembership is IERC721AUpgradeable {
    // Emit profile data (to be caught by TheGraph indexers)
    event NewProfile(
        uint256 indexed tokenId,
        string name,
        string description,
        string image
    );

    // Emit profile data (to be caught by TheGraph indexers)
    event UpdateProfile(
        uint256 indexed tokenId,
        string name,
        string description,
        string image
    );

    // Revert when an address which has created a profile wants to create another profile
    error ExistentUser(uint64);

    // Revert when an address which hasn't created a profile wants to update profile
    error NonExistentUser();

    // Revert when a user wants to transfer their token
    error CanNotTransferOrBurn();

    // Don't give too much love otherwise you'll get hurt easily :(
    error AlreadyLike();

    // Test profile schema
    struct Tind3rProfile {
        string name;
        string description;
        string image;
    }

    // Create profile and mint an soulbound token which contains their profile data to user
    function createProfile(Tind3rProfile calldata userProfile)
        external
        returns (uint256);

    // Update Tind3r profile with name and image
    function updateProfile(Tind3rProfile calldata userProfile)
        external
        returns (uint256);

    // Record if user like others
    function like(address user) external;

    // Get tokenId own by certain user
    function getUserId(address user) external view returns (uint256 userId);

    // Check if user of Tind3r
    function isTind3rMember(address user) external view returns (bool);

    // Check if the first given address liked second given address
    function ifLike(address userA, address userB) external view returns (bool);

    // Get whole data of table
    function prefixURI() external view returns (string memory);

    // Get whole data of table
    function metadataURI() external view returns (string memory);

    // Return user list given ID range [startId, endId)
    function userStreamIdList(uint256 startId, uint256 endId)
        external
        view
        returns (string memory);

    // If A and B are matched
    function isMatched(address userA, address userB)
        external
        view
        returns (bool);

    // Get all matches given user
    function getMatches(address user) external view returns (uint32[] memory);
}
