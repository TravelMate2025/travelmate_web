import Navbar from "../../../pages/homePage/Navbar";
import Breadcrumbs from "../../../components/Breadcrumbs";
// import { useEffect, useState } from "react";
// import { fetchFavorites, getHotelDetails } from "../api";
// import { getAccessToken } from "../../../api/services/authUtils";
// import EmptyState from "../components/EmptyFavorite";
// import { Rating } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { Loader } from "lucide-react";

// interface FavoriteApiItem {
//   id: number;
//   hotel: number;
//   hotel_name: string;
//   created_at: string;
// }

// interface FavoriteCard {
//   favId: number;
//   hotelId: number;
//   name: string;
//   image?: string;
//   address?: string;
//   rating?: number;
// }

const Favorites = () => {
  const breadcrumbs = [{ name: "Home", link: "/" }, { name: "Favorites" }];
  // const accessToken = getAccessToken();
  // const [favoritesRaw, setFavoritesRaw] = useState<FavoriteApiItem[]>([]);
  // const [favorites, setFavorites] = useState<FavoriteCard[]>([]);
  // const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchFavoriteStays = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetchFavorites(accessToken);
  //       // response.data is expected to be an array of favorite items
  //       setFavoritesRaw(response.data || []);

  //       // fetch hotel details for each favorite in parallel
  //       const detailsPromises = (response.data || []).map(
  //         async (fav: FavoriteApiItem) => {
  //           try {
  //             // getHotelDetails signature may require dates/adults - pass empty/defaults
  //             const detail = await getHotelDetails(
  //               String(fav.hotel),
  //               "", // checkIn (if required)
  //               "", // checkOut (if required)
  //               2,
  //               0,
  //               1,
  //               accessToken || undefined
  //             );
  //             return {
  //               favId: fav.hotel,
  //               hotelId: fav.id,
  //               name: fav.hotel_name,
  //               image:
  //                 detail?.images && detail.images.length > 0
  //                   ? detail.images[0].url || detail.images[0]
  //                   : "src/assets/images/StayImage.png",
  //               address: detail?.address || detail?.location || "",
  //               rating: detail?.rating ? Number(detail.rating) : undefined,
  //             } as FavoriteCard;
  //           } catch (err) {
  //             // fallback to minimal info from favorites API
  //             return {
  //               favId: fav.id,
  //               hotelId: fav.hotel,
  //               name: fav.hotel_name,
  //             } as FavoriteCard;
  //           }
  //         }
  //       );

  //       const resolved = await Promise.all(detailsPromises);
  //       setFavorites(resolved.filter(Boolean));
  //     } catch (error) {
  //       console.error("Error fetching favorite stays:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchFavoriteStays();
  // }, [accessToken]);

  // if (loading) {
  //   return (
  //     <div className="mt-24">
  //       <Navbar />
  //       <div className="lg:px-10 px-4">
  //         <div className="py-20 flex justify-center">
  //           <Loader className="animate-spin  h-20 w-20" />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="mt-24">
      <Navbar />
      <Breadcrumbs items={breadcrumbs} />
      <div className="lg:px-10 px-4">
        <h1 className="text-2xl py-6 font-bold">Favorites</h1>

        {/* <div className="mt-6">
          {favorites.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((hotel) => (
                <div
                  key={hotel.favId}
                  className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/stays-detail/${hotel.hotelId}`)}
                >
                  <img
                    src={hotel.image || "/placeholder-hotel.jpg"}
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/placeholder-hotel.jpg";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                    {hotel.address && (
                      <p className="text-gray-600 text-sm mb-2">
                        {hotel.address}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Rating
                          value={hotel.rating ?? 0}
                          readOnly
                          precision={0.1}
                          size="small"
                        />
                        <span className="text-sm text-gray-600">
                          {hotel.rating ? hotel.rating.toFixed(1) : "—"}
                        </span>
                      </div>
                      <button
                        className="text-sm text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          // optionally implement remove favorite action here
                          console.log("Remove favorite", hotel.favId);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Favorites;
