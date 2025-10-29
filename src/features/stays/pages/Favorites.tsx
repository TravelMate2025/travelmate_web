import Navbar from "../../../pages/homePage/Navbar";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useEffect, useState } from "react";
import { fetchFavorites } from "../api";
import { getAccessToken } from "../../../api/services/authUtils";
import EmptyState from "../components/EmptyFavorite";

interface FavoriteProps {
  id: string;
  title: string;
  imageUrl: string;
  address: string;
  rating: number;
}
const Favorites = () => {
  const breadcrumbs = [{ name: "Home", link: "/" }, { name: "Favorites" }];
  const accessToken = getAccessToken();
  const [favorites, setFavorites] = useState<FavoriteProps[]>([]);
  // const hotelId = favorites.map((favorite) => favorite.id);
  useEffect(() => {
    const fetchFavoriteStays = async () => {
      try {
        const response = await fetchFavorites(accessToken);
        setFavorites(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching favorite stays:", error);
      }
    };
    fetchFavoriteStays();
  }, []);
  // useEffect(()=>{
  //   const getHotelDetails = async()=>{
  //     await getHotelDetails(hotelId)
  //   }
  // })
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
            <div>Favorites go here!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
