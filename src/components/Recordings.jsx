import { useRef } from "react";
import { useMoralis } from "react-moralis";
import { MeetingContractAddress } from "../../src/components/Contracts/MeetingContract";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Web3Storage, File } from "web3.storage";
import LitJsSdk from "lit-js-sdk";

const client = new LitJsSdk.LitNodeClient();

export default function Recordings(props) {
  const { Moralis } = useMoralis();
  const router = useRouter();

  const videoRef = useRef();
  const videoUrl = useRef();
  const [data, setData] = useState();

  const { id } = router.query;

  const [recordings, setRecordings] = useState([]);

  const [storage] = useState(
    new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_KEY })
  );

  useEffect(() => {
    const Schedules = new Moralis.Object.extend("Schedules");
    const query = new Moralis.Query(Schedules);
    query.equalTo("objectId", id);
    query.first().then((result) => {
      setData(result);
    });
  }, []);

  useEffect(() => {
    if (data) {
      const CallRecordings = new Moralis.Object.extend("CallRecordings");
      const query = new Moralis.Query(CallRecordings);
      query.equalTo("tokenId", data.get("tokenId"));
      query.find().then((result) => {
        setRecordings(result);
      });
    }
  }, [data, props.setSelectedTab]);

  useEffect(() => {
    async function getClient() {
      await client.connect();
      window.litNodeClient = client;
    }
    getClient();
  }, []);

  const downloadVideo = async (video) => {
    const accessControlConditions = [
      {
        contractAddress: MeetingContractAddress,
        standardContractType: "ERC1155",
        chain: "mumbai",
        method: "balanceOf",
        parameters: [":userAddress", data.get("tokenId")],
        returnValueTest: {
          comparator: ">",
          value: "0",
        },
      },
    ];
    const res = await storage.get(video.get("cId"));

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    const symmetricKey = await window.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: video.get("key"),
      chain: "mumbai",
      authSig,
    });
    const web3Files = await res.files();

    const files = await LitJsSdk.decryptZip(web3Files[0], symmetricKey);

    videoUrl.current = window.URL.createObjectURL(
      await files[`encryptedAssets/${video.get("videoFile")}`].async("blob")
    );
    videoRef.current.src = videoUrl.current;
    //videoRef.current.type ="video/webm";

    videoRef.current?.load();
  };

  return (
    <div>
      <h3 className="text-lg leading-6 py-8 font-medium text-gray-900">
        Videocall Recordings
      </h3>
      <p className="flex-shrink-0 inline-block px-2 mb-8 py-0.5 text-green-800 text-xs font-sm bg-green-100 rounded-full">
        Powered By Go2Online
      </p>
      <div className="items-center flex mb-8 flex-col">
        <video width="640" height="480" controls ref={videoRef}>
          {" "}
        </video>
      </div>
      <ul
        role="list"
        className="pb-16 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {recordings.map((info, index) => (
          <li key="" className="relative">
            <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
              <img
                src={data.get("meetingFile")}
                alt=""
                className="object-cover pointer-events-none group-hover:opacity-75"
              />
              <button
                onClick={() => {
                  downloadVideo(info);
                }}
                type="button"
                className="absolute inset-0 focus:outline-none"
              >
                {" "}
                <span className="sr-only"></span>
              </button>
            </div>
            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
              {data.get("meetingDate")}
            </p>
            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
              {data.get("meetingName")}
            </p>
            <p className="block text-sm font-medium text-gray-500 pointer-events-none"></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
