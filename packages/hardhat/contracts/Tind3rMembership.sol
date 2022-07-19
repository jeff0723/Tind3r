// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "./Tind3rMatching.sol";

error ExistentProfile(uint64);
error NonExistentProfile();
error CanNotTransfer();
error AlreadyLike();

contract Tind3rMembership is
    Initializable,
    UUPSUpgradeable,
    ERC721AUpgradeable,
    OwnableUpgradeable
{
    using StringsUpgradeable for uint256;

    string private constant TABLE_PREFIX = "tind3r_membership";

    ITablelandTables private _tableland;
    string private _metadataTable;
    uint256 private _metadataTableId;

    string private _baseURIString;

    Tind3rMatching public matchingContract;

    mapping(uint256 => uint256) private _likeMap;

    // Profile data struct
    struct Tind3rProfile {
        string name;
        string description;
        string image;
    }

    // Emit profile data (to be caught by TheGraph indexers)
    event NewProfile(
        uint256 indexed tokenId,
        string name,
        string description,
        string image
    );

    // Emit user address and ID when delete
    event DeleteProfile(uint256 indexed tokenId);

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
                TABLE_PREFIX,
                "_",
                chainId,
                " (id integer, name text, description text, image text);"
            )
        );

        /*
         * Stores the full tablename for the new table.
         * {prefix}_{chainid}_{tableid}
         */
        _metadataTable = string.concat(
            TABLE_PREFIX,
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
        if (balanceOf(msgSender) > 0)
            revert ExistentProfile(_getAux(msgSender));
        uint256 newTokenId = _nextTokenId();
        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "INSERT INTO ",
                _metadataTable,
                " (id, name, description, image) VALUES (",
                newTokenId.toString(),
                ", '",
                userProfile.name,
                "', '",
                userProfile.description,
                "', '",
                userProfile.image,
                "');"
            )
        );
        _safeMint(msgSender, 1);
        _setAux(msgSender, uint64(newTokenId));
        emit NewProfile(
            newTokenId,
            userProfile.name,
            userProfile.description,
            userProfile.image
        );
        return newTokenId;
    }

    /**
     * @dev update Tind3r profile with name and image
     */
    function updateProfile(Tind3rProfile calldata newProfile)
        public
        returns (uint256)
    {
        address msgSender = _msgSenderERC721A();
        if (balanceOf(msgSender) < 1) revert NonExistentProfile();
        uint256 ownerTokenId = _getAux(msgSender);

        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "UPDATE ",
                _metadataTable,
                " SET name='",
                newProfile.name,
                "', description='",
                newProfile.description,
                "', image='",
                newProfile.image,
                "' WHERE id=",
                ownerTokenId.toString(),
                ";"
            )
        );
        emit NewProfile(
            ownerTokenId,
            newProfile.name,
            newProfile.description,
            newProfile.image
        );
        return ownerTokenId;
    }

    /**
     * @dev delete tind3r profile
     */
    function deleteProfile() external {
        address msgSender = _msgSenderERC721A();
        if (balanceOf(msgSender) == 0) revert NonExistentProfile();
        uint256 tokenId = _getAux(msgSender);
        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "DELETE FROM ",
                _metadataTable,
                " WHERE id=",
                tokenId.toString(),
                ";"
            )
        );
        _burn(tokenId);
        emit DeleteProfile(tokenId);
    }

    function like(address target) external {
        address msgSender = _msgSenderERC721A();
        _setALikeB(msgSender, target);
        if (_isALikeB(target, msgSender)) {
            matchingContract.mint(
                msgSender,
                getUserId(msgSender),
                target,
                getUserId(target)
            );
        }
    }

    /**
     * @dev Set baseURI
     */
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseURIString = newBaseURI;
    }

    /**
     * @dev Set controller
     */
    function setController(address newController) external onlyOwner {
        _tableland.setController(
            address(this),
            _metadataTableId,
            newController
        );
    }

    /**
     * @dev Set matching contract
     */
    function setMatchingContract(Tind3rMatching _matchingContract)
        external
        onlyOwner
    {
        matchingContract = _matchingContract;
    }

    /**
     * @dev Get tokenId own by certain user
     */
    function getUserId(address user) public view returns (uint256) {
        if (balanceOf(user) == 0) revert NonExistentProfile();
        return _getAux(user);
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

        string memory _prefixURI = prefixURI();
        if (bytes(_prefixURI).length == 0) return "";

        return string.concat(_prefixURI, tokenId.toString());
    }

    /**
     * @dev get whole data of table
     */
    function prefixURI() public view returns (string memory) {
        string memory baseURI = _baseURI();
        if (bytes(baseURI).length == 0) return "";
        /* SELECT json_object(
            'id',id,
            'name',name,
            'description',description,
            'image',image
        ) FROM {tablename} WHERE id={tokenId} */
        return
            string.concat(
                baseURI,
                "mode=list&",
                "s=SELECT+",
                "json_object%28",
                "%27id%27%2Cid%2C",
                "%27name%27%2Cname%2C",
                "%27description%27%2Cdescription%2C",
                "%27image%27%2Cimage%29+",
                "FROM+",
                _metadataTable,
                "+WHERE+id="
            );
    }

    /**
     * @dev get whole data of table
     */
    function metadataURI() public view returns (string memory) {
        string memory baseURI = _baseURI();
        if (bytes(baseURI).length == 0) return "";
        return
            string.concat(
                baseURI,
                "mode=list&"
                "s=SELECT+*+FROM+",
                _metadataTable
            );
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
        if (from != address(0) && to != address(0)) revert CanNotTransfer();
        super._beforeTokenTransfers(from, to, startTokenId, quantity);
    }

    function _isALikeB(address userA, address userB)
        private
        view
        returns (bool)
    {
        uint256 userIdA = getUserId(userA);
        uint256 userIdB = getUserId(userB);
        return _likeMap[(userIdA << 64) + userIdB] > 0;
    }

    function _setALikeB(address userA, address userB) private {
        uint256 userIdA = getUserId(userA);
        uint256 userIdB = getUserId(userB);
        uint256 pairNumber = (userIdA << 64) + userIdB;
        if (_likeMap[pairNumber] > 0) revert AlreadyLike();
        _likeMap[pairNumber] = 1;
    }
}
