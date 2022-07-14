// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";

error ExistingProfile();

error CanNotTransferAndBurn();

contract Tind3rMembership is
    Initializable,
    UUPSUpgradeable,
    ERC721AUpgradeable,
    OwnableUpgradeable
{
    using StringsUpgradeable for uint256;

    string private constant _tablePrefix = "tind3r";

    ITablelandTables private _tableland;
    string private _metadataTable;
    uint256 private _metadataTableId;

    // Our will be pulled from the network
    string private _baseURIString;

    // Profile data struct
    struct Tind3rProfile {
        string name;
        string description;
        string image;
        uint64 dateOfBirth;
        uint8 gender;
        uint8 sexOrientation;
        uint64 insteretVector;
    }

    // Emit profile data (to be caught by TheGraph indexers)
    event NewProfile(
        uint256 indexed tokenId,
        string name,
        string description,
        string image,
        uint64 dateOfBirth,
        uint8 indexed gender,
        uint8 indexed sexOrientation,
        uint64 insteretVector
    );

    /**
     * @dev initialization function for upgradeable contract
     */
    function initialize(string calldata initBaseURI)
        public
        initializerERC721A
        initializer
    {
        __ERC721A_init("Tind3rMembership", "T3M");
        __Ownable_init();
        __UUPSUpgradeable_init();
        /*
         * The Tableland address on your current chain
         */
        _tableland = TablelandDeployments.get();

        string memory chainId = block.chainid.toString();

        /*
         * Stores the unique ID for the newly created table.
         */
        _metadataTableId = _tableland.createTable(
            address(this),
            string.concat(
                "CREATE TABLE ",
                _tablePrefix,
                "_",
                chainId,
                " (id integer, name text, image text);"
            )
        );

        /*
         * Stores the full tablename for the new table.
         * {prefix}_{chainid}_{tableid}
         */
        _metadataTable = string.concat(
            _tablePrefix,
            "_",
            chainId,
            "_",
            _metadataTableId.toString()
        );

        /// set initial base URI
        _baseURIString = initBaseURI;
    }

    /**
     * @dev create Tind3r profile with name and image
     */
    function createProfile(Tind3rProfile calldata userProfile)
        public
        returns (uint256)
    {
        address msgSender = _msgSenderERC721A();
        if (balanceOf(msgSender) > 0) revert ExistingProfile();
        uint256 newTokenId = totalSupply();

        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "INSERT INTO ",
                _metadataTable,
                " (id, name, image) VALUES (",
                newTokenId.toString(),
                ", ",
                userProfile.name,
                ", ",
                userProfile.image,
                ")"
            )
        );
        _safeMint(msgSender, 1, "");
        emit NewProfile(
            newTokenId,
            userProfile.name,
            userProfile.description,
            userProfile.image,
            userProfile.dateOfBirth,
            userProfile.gender,
            userProfile.sexOrientation,
            userProfile.insteretVector
        );
        return newTokenId;
    }

    /**
     * @dev Update baseURI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseURIString = baseURI;
    }

    /**
     * @dev tokenURI is an example of how to turn a row in your table back into
     * erc721 compliant metadata JSON. Here, we do a simple SELECT statement
     * with function that converts the result into json.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();
        string memory baseURI = _baseURI();

        if (bytes(baseURI).length == 0) {
            return "";
        }

        /* SELECT json_object('id',id,name,'name','image',image) FROM {tablename} WHERE id = */
        string memory query = string.concat(
            "SELECT+",
            "json_object%28%27id%27%2Cid%2Cname%2C%27name%27%2C%27image%27%2Cimage%29+",
            "from+",
            _metadataTable,
            "+WHERE+id%3D",
            tokenId.toString()
        );
        return string.concat(baseURI, query);
    }

    /**
     * @dev Override baseURI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseURIString;
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
     * @dev Override _beforeTokenTransfers to be soulbound
     */
    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 startTokenId,
        uint256 quantity
    ) internal override {
        if (from != address(0)) revert CanNotTransferAndBurn();
        super._beforeTokenTransfers(from, to, startTokenId, quantity);
    }
}
