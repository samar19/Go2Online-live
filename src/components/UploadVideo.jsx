import { MeetingContractAddress } from ".././components/Contracts/MeetingContract";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import LitJsSdk from "lit-js-sdk";
import { Web3Storage, File } from "web3.storage";
import Notification from "../../src/components/Notification";

const client = new LitJsSdk.LitNodeClient();

export default function UploadVideo(props) {
  const { Moralis } = useMoralis();
  const router = useRouter();

  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);

  const [show, setShow] = useState(false);
  const close = async () => {
    setShow(false);
  };

  const videoUrl = useRef();
  const videoRef = useRef();

  const [data, setData] = useState();
  const { id } = router.query;

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
    async function getClient() {
      await client.connect();
      window.litNodeClient = client;
    }
    getClient();
  }, []);

  const uploadVideo = async (e) => {
    e.preventDefault();

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
    const videoFile = document.getElementById("file-upload").files;
    if (videoFile.length <= 0) {
      setDialogType(2); //Error
      setNotificationTitle("Error");
      setNotificationDescription("Error no file selected.");
      setShow(true);
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    const files = await LitJsSdk.zipAndEncryptFiles(videoFile);
    // console.log(videoFile);
    // console.log(files);

    const symmetricKey = files.symmetricKey;

    const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: "mumbai",
    });
    // console.log(files.encryptedZip);
    //Get File data
    const fdata = await files.encryptedZip;

    //Upload file to web3.storage
    const cid = await storage.put([new File([fdata], videoFile.name)]);
    const CallRecording = new Moralis.Object.extend("CallRecordings");
    const recording = new CallRecording();
    recording.set("tokenId", data.get("tokenId"));
    recording.set("cId", cid);
    recording.set("videoFile", videoFile[0].name);
    recording.set(
      "key",
      LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    );
    recording.save().then((rec) => {
      setDialogType(1); //Successful
      setNotificationTitle("Recording Saved");
      setNotificationDescription("Successfully saved recording.");
      setShow(true);
      props.updateSearch();
    });
  };
  return (
    <form className="space-y-8">
      <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
      <div className="space-y-8 sm:space-y-5">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Upload File
            </h3>
          </div>

          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Video Recording
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            onClick={uploadVideo}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
