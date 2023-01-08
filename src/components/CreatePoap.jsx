import { ClipboardCopyIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export default function CreatePoap() {
  const { Moralis } = useMoralis();
  const [data, setData] = useState();
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    const Schedules = new Moralis.Object.extend("Schedules");
    const query = new Moralis.Query(Schedules);
    query.equalTo("objectId", id);
    query.first().then((result) => {
      setData(result);
    });
  }, [id]);

  function viewMeeting() {
    router.push(`/hostmeeting/${data.id}`);
  }

  return (
    <div className="w-full flex flex-col h-screen text-gray-800 items-center justify-evenly rounded-xl bg-[#f5f5f5]">
      <div className="flex mt-24  flex-row items-center justify-evenly h-4/5">
        <div className="flex h-full shadow-xl bg-white rounded-xl sm:w-4/12 w-6/12 space-y-4 flex-col items-center justify-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Open Poap
          </h3>
          <div className="flex flex-col items-center space-y-4">
            <div className="mb-4">
              <Image
                className="rounded-xl"
                src={"/openpoap.png"}
                width={100}
                height={100}
              />
            </div>
            {/* <Image src={data?.get("meetingFile")} width={100} height={100} /> */}
            <div
              className="group mt-8 hover:underline cursor-pointer flex flex-row items-center justify-evenly"
              onClick={() => {
                navigator.clipboard.writeText(data?.get("meetingName"));
              }}
            >
              {data?.get("meetingName")}
              <ClipboardCopyIcon className="h-4 ml-2" />
            </div>
            <div
              onClick={() => {
                navigator.clipboard.writeText(data?.get("meetingFile"));
              }}
              className="group hover:underline cursor-pointer flex flex-row items-center justify-evenly"
            >
              {data?.get("meetingFile").slice(0, 15).concat("...") +
                data?.get("meetingFile").slice(38, 44)}
              <ClipboardCopyIcon className="h-4 ml-2" />
            </div>
            <div
              onClick={() => {
                navigator.clipboard.writeText(data?.get("meetingFile"));
              }}
              className="group pb-8 hover:underline cursor-pointer flex flex-row items-center justify-evenly"
            >
              {data ? data.get("meetingDescription") : "Description"}
              <ClipboardCopyIcon className="h-4 ml-2" />
            </div>
          </div>
          <button className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <a href="https://code.hyperdapp.dev/flow/QmSC4ybqxd5RVZE7jfaRtrYooyzdLSiDUaCyYpJAj5Kztv">
              Claim
            </a>
          </button>
          <button
            className="text-sm py-2 px-4  flex flex-row font-medium items-center bg-indigo-600 border border-transparent rounded-md shadow-sm hover:underline cursor-pointer text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              navigator.clipboard.writeText(
                "https://code.hyperdapp.dev/flow/QmSC4ybqxd5RVZE7jfaRtrYooyzdLSiDUaCyYpJAj5Kztv"
              );
            }}
          >
            {" "}
            Copy Link
          </button>
          <div className="mt-1 px-12 text-center text-xs text-gray-500">
            Copy this link and send it in the whereby group chat to verify each
            team members attendance.
          </div>
          <div className="pt-8">
            <button
              onClick={viewMeeting}
              className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Call
            </button>
          </div>
        </div>
        <iframe
          className="shadow-xl h-full"
          src="https://code.hyperdapp.dev/flow/QmbR3L7ybvugwveEDPXQ3QjuCWyfF89dj3L9U9xVT7uy1y"
        ></iframe>
      </div>
    </div>
  );
}
