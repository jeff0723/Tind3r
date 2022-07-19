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
}

error NotCallByMembershipContract();

contract Tind3rMatching is
    Initializable,
    UUPSUpgradeable,
    ERC1155SupplyUpgradeable,
    OwnableUpgradeable
{
    T3M private _t3mContract;

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
     * @dev Override _authorizeUpgrade to upgrade only by owner
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

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
    }

    modifier onlyT3M() {
        if (msg.sender != address(_t3mContract))
            revert NotCallByMembershipContract();
        _;
    }
}
