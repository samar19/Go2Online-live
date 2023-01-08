import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

export default function PoapItem() {
  const { Web3API } = useMoralisWeb3Api();
  const { Moralis } = useMoralis();

  const [poaps, setPoaps] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      const testnetNFTs = await Web3API.account.getNFTs({
        chain: "mumbai",
      });
      //console.log(testnetNFTs);
      let _poaps = [];
      testnetNFTs.result.forEach(async (nft) => {
        if (nft.token_address == "0x318a3dc9f57a81c7ee34f9e010674082139cc5da") {
          console.log(nft.token_uri);
          console.log(nft.token_id);
          const tokenIdMetadata = await Moralis.Cloud.run("getMetadata", {
            token_id: nft.token_id,
            token_uri: nft.token_uri,
          });
          _poaps.push(tokenIdMetadata);
        }
      });
      setPoaps(_poaps);
      console.log(_poaps);
    };
    fetchNFTs();
  }, []);

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {poaps.map((data, index) => (
        <li
          key={index}
          className="col-span-1 flex flex-col text-center items-center justify-evenly bg-white rounded-lg shadow divide-y divide-gray-200"
        >
          <div className="flex-1 flex flex-col p-8">
            <dd className="mb-3">
              <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                {data.data.name}
              </span>
            </dd>
            <img
              className="w-42 h-32 mx-auto rounded-full"
              src={data.data.image}
              alt="token-uri"
            />
            <dl className="mt-3 flex-grow flex flex-col justify-between">
              <h3 className="my-2 text-gray-900 text-xs">
                {data.data.description.slice(0, 8).concat("...") +
                  data.data.description.slice(38, 44)}
              </h3>
            </dl>
          </div>
          <div></div>
        </li>
      ))}
    </ul>
  );
}
