## Project Description 
Go2Online is a video conferencing platform built on top of web3 technologies such as IPFS and Filecoin, as well as protocols like HyperDapp, Lit Protocol, Tableland, XMTP, and Livepeer. Our platform allows DAO contributors and teams to host meetings and online events, with the option to make them public or invite-only. We also provide features such as the ability to store recordings of meetings on IPFS, mint POAPs within the conference, and send real-time notifications to team members via XMTP.

In terms of implementation, we use web3.storage and nft.storage to store content such as meeting image NFTs, NFT metadata, acceptance NFTs, and video recordings. These recordings are encrypted via Lit Protocol to keep private data secure on the open web, and can only be accessed by team members with the corresponding meeting NFT. We have also developed our own OPEN POAP Protocol, which allows team members and hosts to create and distribute POAPs. These POAPs start as unverified, but can be verified by contacting us and providing details. HyperDapp and Tableland are used to store the metadata for these POAPs and incorporate their UI/UX into our platform via an iframe.

Our platform is built using Next.js and Tailwind CSS, and can be easily deployed using Vercel.

## How it's Made
We used IPFS/Filecoin in combination with web3.storage and nft.storage to store content such as Meeting Image NFTs, NFT Metadata, Acceptance NFTs (for meetings) and actual video recordings of any given video meeting. These video recordings are uploaded to IPFS and encrypted via LIT Protocol to store private data on the open web. Only team members with the meeting NFT (which you get upon accepting the invitation in the notifications tab) will be able to access given recordings in the meeting archive. XMTP is used to send notifications in real time to team members, as soon as someone creates a scheduled meeting. Specifically Hacky was the invention of our own OPEN POAP Protocol to allow team members and hosts to create poaps and claim said poaps. We found it was too much red tape to get our POAPS approved. We decided to go with our own version where anyone can generate a POAP for distribution. Initially these POAPS have a state of being unverified. They can still be distributed if the creator of a POAP wants to have a verified POAP they can contact us and we will approve it based on the details they provide. Hyperdapp & Tableland are leveraged for the Open Poap Protocol to store said information in Tableland and embed the UI/UX from Hyperdapp via iframe in our pages. Tableland stores the dynamic metadata for the POAPS.

## Protocols & Sponsors
🚀 HyperDapp 
🥷 Lit Protocol 
🏊‍♂️ Tableland 
🥈 XMTP 
🏆 livepeer 
3️⃣5️⃣ IPFS/Filecoin 
livepeer best design 
polygon

## run the project 
yarn install
yarn dev


