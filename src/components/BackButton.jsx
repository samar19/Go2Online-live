import { ArrowCircleLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

export default function BackButton() {
  const router = useRouter();
  return (
    <div className="fixed z-50 top-24 inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
      <button
        onClick={() => {
          router.push("/");
        }}
        className="bg-indigo-600 items-center flex flex-row border border-transparent rounded-md shadow-sm py-2 px-4 justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <ArrowCircleLeftIcon className="h-4 mr-2" />
        Back
      </button>
    </div>
  );
}
