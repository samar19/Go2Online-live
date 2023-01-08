// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract OpenPOAP is ERC1155,Ownable {

    struct poap {
       bool isValue;
       bool verified; 
    }
    mapping (uint256 =>poap) poaps;   
    string public name = "Open Proof Of Attendance Protocol";
    string public symbol ="OPOAP"; 
    string public _poapTable;
    uint256 private _poapTableId;
    string private _tablePrefix = "OpenPOAP";
    ITablelandTables private _tableland;    

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
     // The testnet gateway URI plus query parameter
  string private _baseURIString = "https://testnet.tableland.network/query?mode=list&s=";


/**
   * @dev Modifier tokenExist. 
   * 
   **/
   modifier tokenExist (uint256 tokenId){
      require(poaps[tokenId].isValue == true ,"Not a valid token id.");
	  
   _; 
 }

   constructor (address registry)  ERC1155(""){
      _tableland = ITablelandTables(registry);

     createTable();

    }
    
    /**
   * @dev Function createTable - create table on Tableland to hold metadata
   * 
   **/
   function createTable() internal{
           _poapTableId = _tableland.createTable(
        address(this),
        string.concat(
          "CREATE TABLE OPENPOAP_",Strings.toString(block.chainid),
          " (id int, name text, description text, image text, verified text,dateCreated int,dateVerified int);"
        )
      );

      _poapTable = string.concat(
        "OPENPOAP_",Strings.toString(block.chainid),
        "_",
        Strings.toString(_poapTableId)
      );
   }

   /**
   * @dev Function createPOAP - Create POAP to be claimed
    * @param  title of the POAP.
   * @param cid image link for POAP.
   * @param description description for POAP. 
   **/
   function createPOAP(string calldata title,string calldata cid,string calldata description)  external returns(uint256 tokenId){
    
    _tokenIdCounter.increment();
     tokenId = _tokenIdCounter.current();
     poaps[tokenId].isValue = true;
     poaps[tokenId].verified = false; 
    _tableland.runSQL(
      address(this),
      _poapTableId,
      string.concat(
        "INSERT INTO ",
        _poapTable,
        " (id, name,image,description,verified,dateCreated,dateVerified) VALUES (",
        Strings.toString(tokenId),",",
        "'", title,"',","'", cid,"','",description, "','NO',",Strings.toString(block.timestamp),",0)"
      )
    );
   }

   /**
   * @dev Function mintPOAP - allows user to claim POAP
   * @param tokenId  Token ID to be claimed.
   *
   **/


   function mintPOAP(uint256 tokenId) external tokenExist(tokenId) {
       require(balanceOf(msg.sender,tokenId) == 0,"Token already claimed.");
       _mint(msg.sender, tokenId,1, "");


   }


 /**
   * @dev Function verifyPOAP - verify POAP
   * @param tokenId  Token ID to be verified.
   *
   **/

   function verifyPOAP(uint256 tokenId) external onlyOwner tokenExist(tokenId) {
       _tableland.runSQL(
    address(this),
    _poapTableId,
    string.concat(
      "UPDATE ",
      _poapTable,
      " SET verified = 'YES'",
    
      " WHERE id = ",
      Strings.toString(tokenId),
      ";"
    ));
    poaps[tokenId].verified = true;

   }
/**
   * @dev Function uri - returns uri for POAP
   * @param tokenId  
   *
   **/


   function uri(uint256 tokenId) override
        public
       view
        returns (string memory)
    {
        return string.concat(_baseURIString,"select+json_object%28%27name%27%2Cname%2C%27image%27%2Cimage%2C%27description%27%2Cdescription%2C%27attributes%27%2C+json_group_array%28%0D%0A%09%09%09json_object%28%27display_type%27%2C+%27text%27%2C+%27trait_type%27%2C+%27verified%27%2C+%27value%27%2C+verified%29%29%0D%0A%09%09%29+from+",_poapTable,"+where+id%3D%0D%0A",Strings.toString(tokenId));

    } 


}