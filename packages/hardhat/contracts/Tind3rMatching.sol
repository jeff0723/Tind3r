// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";

interface T3M {
    function prefixURI() external view returns (string memory);

    function getUserId(address user) external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address);
}

error NotCallByMembershipContract();

contract Tind3rMatching is
    Initializable,
    UUPSUpgradeable,
    ERC1155SupplyUpgradeable,
    OwnableUpgradeable
{
    T3M private _t3mContract;

    event Match(uint256 aUserId, uint256 bUserId);

    event Block(uint256 aUserId, uint256 bUserId);

    /**
     * @dev initialization function for upgradeable contract
     */
    function initialize(T3M t3mContract) public initializer {
        __ERC1155Supply_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        _t3mContract = t3mContract;
    }

    /**
     * @dev Override ERC1155-uri
     */
    function uri(uint256) public view virtual override returns (string memory) {
        return string.concat(_t3mContract.prefixURI(), "{id}");
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
        emit Match(aUserId, bUserId);
    }

    /**
     * @dev Only Tind3eMembership contract can call
     */
    modifier onlyT3M() {
        if (msg.sender != address(_t3mContract))
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
        uint256 size = ids.length;
        uint256 fromId = _t3mContract.getUserId(from);
        uint256 toId = _t3mContract.getUserId(to);
        for (uint256 i = 0; i < size; ++i) {
            uint256 targetId = ids[i];
            address targetUser = _t3mContract.ownerOf(targetId);
            if (balanceOf(from, targetId) == 0) {
                emit Block(fromId, targetId);
            }
            if (balanceOf(targetUser, toId) > 0 && amounts[i] > 0) {
                emit Match(toId, targetId);
            }
        }
        super._afterTokenTransfer(operator, from, to, ids, amounts, data);
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
