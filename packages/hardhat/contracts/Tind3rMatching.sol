// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "./ITind3rMatching.sol";
import "./ITind3rMembership.sol";

contract Tind3rMatching is
    Initializable,
    UUPSUpgradeable,
    ERC1155SupplyUpgradeable,
    OwnableUpgradeable,
    ITind3rMatching
{
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    ITind3rMembership private _membershipContract;

    mapping(address => EnumerableSetUpgradeable.UintSet) _userMatches;

    /**
     * @dev initialization function for upgradeable contract
     */
    function initialize(ITind3rMembership initMembershipContract)
        public
        initializer
    {
        __ERC1155Supply_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        _membershipContract = initMembershipContract;
    }

    /**
     * @dev Override ERC1155-uri
     */
    function uri(uint256) public view virtual override returns (string memory) {
        return string.concat(_membershipContract.prefixURI(), "{id}");
    }

    /**
     * @dev Mint A's token to B and B's to A
     */
    function mint(
        address aUser,
        uint256 aUserId,
        address bUser,
        uint256 bUserId
    ) external onlyT3M {
        _mint(aUser, bUserId, 1, "");
        _mint(bUser, aUserId, 1, "");
        _userMatches[aUser].add(bUserId);
        _userMatches[bUser].add(aUserId);
        emit Match(aUserId, bUserId);
    }

    /**
     * @dev Show membership contract
     */
    function membershipContract() public view returns (address) {
        return address(_membershipContract);
    }

    /**
     * @dev Only Tind3eMembership contract can call
     */
    modifier onlyT3M() {
        if (msg.sender != address(_membershipContract))
            revert NotCallByMembershipContract();
        _;
    }

    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        if (from == address(0) || to == address(0)) return;
        uint256 size = ids.length;
        uint256 fromId = _membershipContract.getUserId(from);
        uint256 toId = _membershipContract.getUserId(to);
        for (uint256 i = 0; i < size; ++i) {
            uint256 targetId = ids[i];
            address targetUser = _membershipContract.ownerOf(targetId);
            if (balanceOf(from, targetId) == 0) {
                emit Block(fromId, targetId);
                _userMatches[from].remove(targetId);
                _userMatches[targetUser].remove(fromId);
            }
            if (balanceOf(targetUser, toId) > 0 && amounts[i] > 0) {
                emit Match(toId, targetId);
                _userMatches[to].add(targetId);
                _userMatches[targetUser].add(toId);
            }
        }
        super._afterTokenTransfer(operator, from, to, ids, amounts, data);
    }

    /**
     * @dev Get user all matches
     */
    function getMatches(address user)
        public
        view
        returns (uint32[] memory matchedIds)
    {
        uint256 size = _userMatches[user].length();
        matchedIds = new uint32[](size);
        for (uint256 i = 0; i < size; ++i) {
            matchedIds[i] = uint32(_userMatches[user].at(i));
        }
    }

    /**
     * @dev Override _authorizeUpgrade to upgrade only by owner
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
