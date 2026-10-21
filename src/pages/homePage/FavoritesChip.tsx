import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart, FaChevronRight } from "react-icons/fa";
import { RootState } from "../../store";
import { fetchFavorites } from "../../features/stays/api";

// The favorites feature already exists (src/pages/Favorites.tsx) but
// nothing on the homepage ever pointed to it. Only fetched/shown for
// logged-in users -- favorites is a genuinely personal, per-account
// feature, unlike the open recommend/popular-destinations/top-rated calls
// elsewhere on this page.
const FavoritesChip = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    fetchFavorites()
      .then((data) => setCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setCount(0));
  }, [accessToken]);

  if (!accessToken || count === 0) return null;

  return (
    <div className="w-[90%] m-auto mt-[24px]">
      <button
        type="button"
        onClick={() => navigate("/favorites")}
        className="w-full flex items-center gap-3 rounded-xl bg-green-50 border border-green-100 px-4 py-3 cursor-pointer hover:bg-green-100 transition-colors"
      >
        <FaHeart className="text-green-700" size={18} />
        <span className="flex-1 text-left text-sm font-semibold text-green-800">
          You have {count} saved {count === 1 ? "stay" : "stays"}
        </span>
        <FaChevronRight className="text-green-700" size={14} />
      </button>
    </div>
  );
};

export default FavoritesChip;
