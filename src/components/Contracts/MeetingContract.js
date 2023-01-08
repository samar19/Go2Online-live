export const MeetingContractAddress =
  "0xB0Da6F68e04F0897A5dA739fAa2fA1F92E49a2Da";
export const MeetingContractABI = [
  "function subscribed() public view returns (bool)",
  "function subscribe() public ",
  "function createMeeting(string calldata _name, string calldata _uri, uint256 startDate, bool isPublic, uint256 cost) external onlyOwner returns(uint256 tokenId)",
  "function sendInvite(uint tokenId,address invitee) external",
  "function mintNFT(uint tokenId) external",
];
