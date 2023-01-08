import Header from "./Header";
import Landing from "./Landing";

export default function Login() {
  return (
    <div className="flex flex-col items-center ">
      <div className="absolute top-0 w-full z-50">
        <Header />
      </div>
      <div className="mt-24">
        <Landing />
      </div>
    </div>
  );
}
