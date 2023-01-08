// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MeetingNFT is ERC1155,Ownable {
    struct subscription {
        bool isValue;
        address subscriber;
        uint256 subscriptionDate;
    }


    struct meeting {
       string name; 
       uint256 minted;
       uint256 cost;
       uint256 balance;
       
       uint256 startDate;
       address owner;
       bool isValue;
       bool isPublic;
       string uri;
    }

    string public name = "Go2Online NFT";
    string public symbol ="Go2Online"; 
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    mapping (uint256 => meeting) meetings;
    mapping (address =>subscription) subscriptions;
    uint256 subscriptionBalance;
    uint256 subscriptionFee;
    address USDC_ADDRESS = address(0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2); //Polygon Mumbai USDC
    IERC20 internal usdcToken; 
    event MeetingCreated(uint256 tokenId,string name,address owner,uint256 dateCreated,uint256 startDate,bool isPublic,uint256 cost);
    event Subscribed(address subscriber,uint256 subscriptionDate);

    constructor (uint256 fee)  ERC1155(""){
       subscriptionFee = fee;
        usdcToken = IERC20(USDC_ADDRESS);

    }

	    

/**
   * @dev Modifier isSubscribed. 
   * 
   **/	  
	  
    modifier isSubscribed (){
	  require(subscriptions[msg.sender].isValue == true, "You are not subscribed.");
  	  require(block.timestamp -subscriptions[msg.sender].subscriptionDate <= (86400*365), "You are not subscribed"); // 1 year Subscription

   _; 
 }

/**
   * @dev Modifier notSubscribed. 
   * 
   **/
   modifier notSubscribed (){
      if(subscriptions[msg.sender].isValue == true)
	  require(block.timestamp -subscriptions[msg.sender].subscriptionDate > (86400*365), "You are subscribed"); //30 Day Subscription

   _; 
 }

  /**
   * @dev Modifier isMeeting. 
   * @param   id  token ID
   **/	  
	  
    modifier isMeeting (uint256  id){
	  require(meetings[id].isValue == true, "Not a valid meeting");
   _; 
 }	    

 /**
   * @dev Modifier isMeetingOwner. 
   * @param   id  token ID
   **/	  
	  
    modifier isMeetingOwner (uint256  id){
	  require(meetings[id].isValue == true, "Not a valid meeting");
      require(meetings[id].owner == msg.sender,"You are not the owner");
   _; 
 }	    

    /**
   * @dev Function subscribed  
   * 
   **/
    function subscribed() public view returns (bool) 
    {
        if(subscriptions[msg.sender].isValue == true && block.timestamp -subscriptions[msg.sender].subscriptionDate <= (86400*365))
          return true;

        return false;  
    }

    /**
   * @dev Function subscribe  
   * 
   **/
    function subscribe() public notSubscribed() 
    {
        uint256 senderBalanceRequired = subscriptionFee*10**6;
        require(usdcToken.balanceOf(msg.sender) >= senderBalanceRequired, "Not enough balance");
        usdcToken.transferFrom(msg.sender,address(this), senderBalanceRequired);
        subscriptions[msg.sender].isValue = true;
        subscriptions[msg.sender].subscriber = msg.sender;
        subscriptions[msg.sender].subscriptionDate = block.timestamp;
        subscriptionBalance += senderBalanceRequired;
        emit Subscribed(msg.sender,block.timestamp);


    }


  /**
   * @dev Function allows users to create meetings
    * @param _name of NFT.
   * @param _uri of NFTs. 
   * @param startDate
   **/
    
    function createMeeting(string calldata _name,string calldata _uri,uint256 startDate,bool isPublic,uint256 cost ) external  returns(uint256 tokenId)  {
     _tokenIdCounter.increment();
     uint256 index=_tokenIdCounter.current();
     meetings[index].name = _name;
     meetings[index].startDate = startDate;
     meetings[index].uri = _uri;
     meetings[index].owner = msg.sender;
     meetings[index].isValue = true;
     meetings[index].isPublic = isPublic;
     meetings[index].cost = cost;
     tokenId =_tokenIdCounter.current();
     _mint(msg.sender, tokenId,1, "");
     meetings[index].minted +=1;
    emit MeetingCreated(tokenId, _name,msg.sender,block.timestamp,startDate,isPublic,cost);

    }

  /**
   * @dev Function allows meeting owner to send invite
    * @param tokenId of NFTs.
   * @param invitee person to invite to meeting.
    
   **/
    
    function sendInvite(uint tokenId,address invitee) external  isMeetingOwner(tokenId) {
       _mint(invitee, tokenId,1, "");
       meetings[tokenId].minted++;
    
    }

    /**
   * @dev Function allows users to mint meeting NFTs
    * @param tokenId of NFTs.
   
    
   **/
    
    function mintNFT(uint tokenId) external  isMeeting(tokenId) {
       require(meetings[tokenId].isPublic == true,"This meeting is private");
       require(balanceOf(msg.sender,tokenId) == 0, "You have already subscribed to this meeting.");
    if(meetings[tokenId].cost > 0) //IF the meeting has a fee for attendance
    {
        uint256 senderBalanceRequired = (meetings[tokenId].cost*10**6);
        require(usdcToken.balanceOf(msg.sender) >= senderBalanceRequired, "Not enough balance");
        usdcToken.transferFrom(msg.sender,address(this), senderBalanceRequired);
        meetings[tokenId].balance += senderBalanceRequired;
    }
    
       _mint(msg.sender, tokenId,1, "");
       meetings[tokenId].minted++;
    
    }

    function uri(uint256 tokenId) override
        public
       view
        returns (string memory)
    {
        return string(abi.encodePacked( meetings[tokenId].uri));

    } 

    /**
   * @dev Function set uri 
   * @param tokenId of NFTs.
   * @param  _uri of NFTs.

   **/
    function setUri(uint256 tokenId,string calldata _uri) public isMeetingOwner(tokenId)
    {
        meetings[tokenId].uri =  _uri;
    
    } 


     /**
   * @dev Function set subscription Fee 
   * 
   * 

   **/
    function setSubcriptionFee(uint256 fee) public onlyOwner
    {
        subscriptionFee = fee;
    
    } 


     /**
   * @dev Function get subscription Fee 
   * 
   * 

   **/
    function getSubcriptionFee() public view returns(uint256) 
    {
        return(subscriptionFee) ;
    
    } 

    /**
   * @dev Function withdraw funds from meeting balance  
   * @param tokenId of NFTs.
    
   **/
    function withDraw(uint256 tokenId) public isMeetingOwner(tokenId) 
    {

        require(meetings[tokenId].balance > 0 , "Balance is zero.");
        require(usdcToken.balanceOf(address(this))  >= meetings[tokenId].balance,"Not Enough balance" );
        usdcToken.transfer(msg.sender, meetings[tokenId].balance);
       meetings[tokenId].balance = 0;
    }   



    
}