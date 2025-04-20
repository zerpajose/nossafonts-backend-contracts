// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Burnable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract NossaFonts is ERC721, ERC721URIStorage, Ownable {
  // In order to mint an nft, users need to deposit a stake (will be returned if burn the NFT)
  uint256 public constant STAKE_AMOUNT = 0.001 ether;
  // You will be added to AllowList when you do the stake deposit
  mapping(address => bool) public allowList;

  uint256 private _nextTokenId;

  constructor(address initialOwner) ERC721("NossaFonts", "NOSSAFONTS") Ownable(initialOwner) {}

  function safeMint(string memory uri) public returns (uint256) {
    require(allowList[msg.sender], "You are not in the AllowList");
    address _to = msg.sender;
    
    uint256 tokenId = _nextTokenId++;
    _safeMint(_to, tokenId);
    _setTokenURI(tokenId, uri);
    return tokenId;
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  //AllowList
  // Add msg.sender to AllowList
  function setAllowList() external payable {
    require(msg.value >= STAKE_AMOUNT, "Ether value sent is not correct");
    allowList[msg.sender] = true;
  }

  // Withdraw the Ether from the contract to the NFT owner
  function withdrawStake(uint _id) public {
    require(msg.sender == ownerOf(_id), "Not owner of this NFT");
    allowList[msg.sender] = false;
    payable(msg.sender).transfer(STAKE_AMOUNT);
  }
}
