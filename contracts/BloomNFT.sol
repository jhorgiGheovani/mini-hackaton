// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BloomNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ERC721Burnable {
    uint256 private _nextTokenId;
    string public basePinataGateway = "https://gateway.pinata.cloud/ipfs/";

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
        Ownable(msg.sender) 
    {
        _nextTokenId = 1;
    }

    function setBasePinataGateway(string memory newBase) public onlyOwner {
        basePinataGateway = newBase;
    }

    // --- Minting ---
    function mint(address to, string memory ipfsHash) external onlyOwner returns (uint256) {
        uint256 id = _nextTokenId;
        _nextTokenId++;
        _safeMint(to, id);
        _setTokenURI(id, ipfsHash);
        return id;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(ownerOf(tokenId) != address(0), "URI query for nonexistent token");
        string memory storedURI = super.tokenURI(tokenId);
        return string(abi.encodePacked(basePinataGateway, storedURI));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}