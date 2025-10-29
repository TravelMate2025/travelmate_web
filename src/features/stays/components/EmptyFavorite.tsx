import bookmark from "../../../assets/images/favorite_border.png";
const EmptyState = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-4 m-auto lg:mt-24 my-12 text-center">
      <div className="border-[1px] border-neutral-300 p-3 rounded-full bg-neutral-200">
        <img className="size-12" src={bookmark} alt="bookmark" />
      </div>
      <h3 className="text-lg lg:text-2xl font-bold capitalize">
        No favorites yet
      </h3>
      <p className="text-wrap w-auto">
        You haven't added any favorites. Tap the heart icon to save your
        favorite stays.
      </p>
    </div>
  );
};

export default EmptyState;
