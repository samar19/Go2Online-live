import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  GlobeAltIcon,
  HomeIcon,
  MenuIcon,
  PlusCircleIcon,
  VideoCameraIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useMoralis } from "react-moralis";

const solutions = [
  {
    name: "Home",
    description: "Homepage",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Pro Plan",
    description: "Pro Plan.",
    href: "/proplan",
    icon: PlusCircleIcon,
  },
  {
    name: "Dashboard",
    description: "Dashboard",
    href: "/dashboard",
    icon: GlobeAltIcon,
  },
  {
    name: "Liveroom",
    description: "Liveroom",
    href: "/liveroom",
    icon: VideoCameraIcon,
  },
];

export default function Header() {
  const { authenticate, isAuthenticated, logout } = useMoralis();

  return (
    <header className="w-full absolute top-0">
      <Popover className="relative">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="/">
              <span className="sr-only">Go2Online</span>
              <img className="h-20 w-auto" src="/logo.png" alt="" />
            </a>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>

          {!isAuthenticated ? (
            <p className="text-center text-lg font-semibold uppercase text-gray-500 tracking-wide">
              
            </p>
          ) : (
            <div>
              <p className="text-center text-lg font-semibold uppercase text-gray-500 tracking-wide">
              Go2Online
              </p>
              <p className="text-center text-xs font-semithin uppercase text-gray-500 tracking-wide">
                powered by XMTP
              </p>
            </div>
          )}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {!isAuthenticated ? (
              <button
                onClick={authenticate}
                class="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"              >
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center bg-gradient-to-r from-gray-800 to-indigo-600 bg-origin-border px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:from-purple-700 hover:to-indigo-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute z-30 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
          >
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <img
                      className="h-16 w-auto"
                      src="/logo.png"
                      alt="Go2Online"
                    />
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                {!isAuthenticated && (
                  <div className="mt-6">
                    <nav className="grid grid-cols-1 gap-7">
                      {solutions.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                            <item.icon className="h-6 w-6" aria-hidden="true" />
                          </div>
                          <div className="ml-4 text-base font-medium text-gray-900">
                            {item.name}
                          </div>
                        </a>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
              <div className="py-6 px-5">
                <div className="">
                  {!isAuthenticated ? (
                    <a
                      onClick={authenticate}
                      className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:from-purple-700 hover:to-indigo-700"
                    >
                      Metamask Login
                    </a>
                  ) : (
                    <a
                      onClick={logout}
                      className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:from-purple-700 hover:to-indigo-700"
                    >
                      Logout
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </header>
  );
}
