import { Search } from "lucide-react";
import { Link } from "react-router";

type props = {
  title: string;
  content: string;
};
const EmptyState = ({ title, content }: props) => {
  return (
    <div className="flex justify-center items-center flex-col gap-6 py-12 text-center mt-12 lg:mt-auto px-6 lg:px-0">
      <div className="bg-[#F5F5F5] border border-[#DEDFE1] rounded-full h-32 w-32 relative">
        <Search
          width={60}
          height={60}
          className="m-auto absolute top-1/2 left-1/2 -translate-1/2"
          stroke="#696b6c"
        />
      </div>
      <h1 className="lg:text-4xl text-2xl font-bold">
        {title}
      </h1>
      <p className="text-[#67696D] w-96">{content}</p>
      <button className="py-3 px-6 bg-[#023E8A] text-white rounded-md cursor-pointer">
        <Link to="/">Back to Search</Link>
      </button>
    </div>
  );
};

export default EmptyState;
