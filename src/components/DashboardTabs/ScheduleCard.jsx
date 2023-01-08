import { useRouter } from "next/router";
import { VideoCameraIcon, SaveIcon } from "@heroicons/react/solid";
import { UserAddIcon } from "@heroicons/react/outline";

export default function ScheduleCard(props) {
  const router = useRouter();

  function viewMeeting() {
    router.push(`/hostmeeting/${props.data.id}`);
  }

  function viewRecordings() {
    router.push(`/recordings/${props.data.id}`);
  }

  function createPoap() {
    router.push(`/createpoap/${props.data.id}`);
  }
  return (
    <li
      key={props.id}
      className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
    >
      <div className="w-full flex items-center justify-between p-6 space-x-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="text-gray-900 text-sm font-medium truncate">
              {props.data.get("meetingName")}
            </h3>
          </div>
          <p className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-sm bg-green-100 rounded-full">
            Powered By Go2Online
          </p>
          <p className="mt-1 text-gray-500 text-sm truncate">
            {props.data.get("meetingDate")}
          </p>
        </div>
        <img
          className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
          src={props.data.get("meetingFile")}
          alt=""
        />
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="w-0 flex-1 flex">
            <button
              onClick={viewMeeting}
              className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
            >
              <VideoCameraIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-2">Call</span>
            </button>
          </div>
          <div className="w-0 flex-1 flex">
            <button
              onClick={createPoap}
              className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
            >
              <UserAddIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-2">Poap</span>
            </button>
          </div>
          <div className="-ml-px w-0 flex-1 flex">
            <button
              onClick={viewRecordings}
              className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
            >
              <SaveIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
              <span className="ml-2">Archive</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
