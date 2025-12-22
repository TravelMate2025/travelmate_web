import bookmark from "../../assets/images/book@3x.png";
interface props {
  title?: string;
  content?: string;
}
const EmptyState = ({ title, content }: props) => {
  return (
    <div className="flex justify-center items-center flex-col gap-4 m-auto lg:mt-24 my-12 text-center">
      <div className="border-[1px] border-neutral-300 p-3 rounded-full bg-neutral-200">
        <img className="size-12" src={bookmark} alt="bookmark" />
      </div>
      <h3 className="text-lg lg:text-2xl font-bold capitalize">
        {title || "No bookings yet"}
      </h3>
      <p className="text-wrap w-auto">
        {content ||
          "You haven't made any bookings yet. When you do, they will appear here."}
      </p>
    </div>
  );
};

export default EmptyState;
