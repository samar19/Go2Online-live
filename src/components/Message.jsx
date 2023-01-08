/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { format } from "date-fns";

export default function MyMessage(props) {
  const router = useRouter();

  const [showMessage, setShowMessage] = useState(props.showMessage);

  const close = async () => {
    setShowMessage(false);
    props.close();
  };

  const accept = async () => {
    router.push(`/viewmeeting/${props.data.id}`);
  };

  console.log(props.data);
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="fixed inset-0 z-50 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={props.showMessage}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={props.data?.meetingFile}
                      alt=""
                    />
                  </div>

                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Meeting Invitation
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {props.data?.team ? props.data?.team : props.data?.from}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {props.data?.meetingName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {props.data
                        ? format(
                            new Date(props.data.meetingDate.iso),
                            "iii do MMM yyyy p"
                          )
                        : ""}
                    </p>

                    <div className="mt-4 flex">
                      <p className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-sm bg-green-100 rounded-full">
                        powered by XMTP
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      type="button"
                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={close}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
