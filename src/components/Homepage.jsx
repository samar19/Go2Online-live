import Dashboard from "./Dashboard";
import Hero from "./Hero";

export default function Homepage() {
  return (
    <div className="w-full flex flex-col items-center justify-start absolute top-24 lg:w-8/12">
      <div className="w-full">
        <Hero />
      </div>
      <Dashboard />
    </div>
  );
}
