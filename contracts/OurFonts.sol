// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OurFonts is ERC721, ERC721URIStorage, Ownable {

  using Counters for Counters.Counter;

  // In order to mint an nft, users need to deposit a stake (will be returned if burn the NFT)
  uint256 public constant STAKE_AMOUNT = 0.001 ether;
  // You will be added to AllowList when you do the stake deposit
  mapping(address => bool) public allowList;

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("OurFont", "OURFONT") {}

  function safeMint(string memory uri) public {
    require(allowList[msg.sender], "You are not in the AllowList");
    address _to = msg.sender;
    
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(_to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
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
