import Navbar from "../pages/homePage/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import { useEffect, useState } from "react";

import EmptyState from "../features/stays/components/EmptyFavorite";

import { useNavigate } from "react-router-dom";
import hotelImage from "../assets/images/StayImage.png";
import { fetchFavorites } from "../features/stays/api";
import { CiLocationOn } from "react-icons/ci";

import { IoStarSharp } from "react-icons/io5";

export interface Hotel {
  id: number;
  hotel_code: string;
  hotel_name: string;
  address: string;
  category: string; // e.g. "3 STARS"
  rating: number;
  reviews_count: number;
  images: HotelImage[];
  created_at: string; // ISO date string
}

export interface HotelImage {
  id?: number;
  url: string;
  type?: string;
}
const Favorites = () => {
  const breadcrumbs = [{ name: "Home", link: "/" }, { name: "Favorites" }];
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteStays = async () => {
      try {
        const response = await fetchFavorites();
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorite stays:", error);
      }
    };
    fetchFavoriteStays();
  }, [favorites]);

  return (
    <div className="mt-24">
      <Navbar />
      <Breadcrumbs items={breadcrumbs} />
      <div className="lg:px-10 px-4">
        <h1 className="text-2xl py-6 font-bold">Favorites</h1>

        <div className="mt-6">
          {favorites.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((hotel) => (
                <div
                  key={hotel.id}
                  className="border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer p-4 border-gray-300 "
                  onClick={() => navigate(`/stays-detail/${hotel.id}`)}
                >
                  <img
                    src={hotel?.images[0]?.url || hotelImage}
                    alt={hotel.hotel_name}
                    className="w-full h-48 object-cover rounded-xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/placeholder-hotel.jpg";
                    }}
                  />
                  <div className="">
                    <div className="flex justify-between w-ful items-center pt-3">
                      <h3 className="font-semibold text-lg">
                        {hotel.hotel_name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <IoStarSharp fill="#FF6F1E" />
                        <p>
                          {hotel.rating}({hotel.reviews_count})
                        </p>
                      </div>
                    </div>

                    {hotel.address && (
                      <div className="flex items-center gap-1">
                        <CiLocationOn />
                        <p className="text-gray-600 text-sm">{hotel.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
