import {
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { Loader, SearchIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  MapLocation,
  searchDetailedLocation,
} from "../../services/locationService";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";

export interface SearchLocationProps {
  closeDialog: () => void;
  value: string;
  setValue: (value: string) => void;
  ChangeValue: (data: string, lat: number, lon: number) => void;
  collectTo: (
    data: string,
    data2: string,
    latitude: number,
    longitude: number
  ) => void;
  setExtraFields?: (fields: {
    endAddress?: string;
    endCity?: string;
    endCountry?: string;
    fromLat?: number;
    fromLon?: number;
    toLat?: number;
    toLon?: number;
  }) => void;
}

const SearchDropOffLocation = ({
  closeDialog,
  value,
  setValue,
  ChangeValue,
  setExtraFields,
  collectTo,
}: SearchLocationProps) => {
  const [query, setQuery] = useState(value);
  const [dropSuggestions, setDropSuggestions] = useState<MapLocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setDropSuggestions([]);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchDropoffLocations = async () => {
      try {
        if (query.length > 2) {
          setLoading(true);
          const destinationResult = await searchDetailedLocation(
            setLoading,
            query
          );

          setDropSuggestions(destinationResult);
        }else{
          setError("Please enter at least 3 characters");
          setDropSuggestions([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch destinations");
        setDropSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDropoffLocations();
  }, [query]);

  const handleSelect = (location: MapLocation) => {
    if (!location.name || location.name.length < 2) {
      setError("Please select a valid location");
      return;
    }

    setValue(location.name);
    ChangeValue(location.country, location.latitude, location.longitude);
    collectTo(
      location.country,
      location.name,
      location.latitude,
      location.longitude
    );

    if (setExtraFields) {
      setExtraFields({
        endAddress: location.street,
        endCity: location.city,
        endCountry: location.country,
        toLat: location.latitude,
        toLon: location.longitude,
      });
    }
    closeDialog();
  };

  return (
    <div className="inset-0 fixed z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 " />
      <div className="min-w-screen min-h-screen p-8 rounded-lg bg-white shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:min-h-[400px] lg:min-w-[90vh] block z-[99] mt-5">
        <div className="flex justify-normal gap-24 lg:gap-42 items-center my-5 w-full pt-12 lg:pt-0">
          <div className="p-[8px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]">
            <X onClick={closeDialog} className="font-bold cursor-pointer" />
          </div>
          <h2 className="font-bold text-lg">Drop Off</h2>
        </div>
        <div className="mt-6">
          <TextField
            id="to"
            variant="outlined"
            size="small"
            value={query}
            error={!!error && !loading}
            helperText={!loading ? error : ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Destinations"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {loading && <Loader className="animate-spin" />}
                </InputAdornment>
              ),
            }}
            className="w-full"
            sx={{
              "& .MuiInputBase-root": {
                height: "44px",
                borderRadius: "8px",
              },
            }}
          />
          <List
          className="lg:max-h-[330px] h-full"
            sx={{
              overflowY: "auto",
              padding: 0,
              "&::-webkit-scrollbar": { width: "8px" },
              "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
            }}
          >
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : dropSuggestions.length === 0 && !loading && query.length > 3 ? (
              <div className="text-center py-4 text-red-400">
                {error || "No items match your search"}
              </div>
            ) : (
              dropSuggestions.map((location, index) => (
                <div
                  key={index}
                  className="flex justify-between w-full items-center cursor-pointer hover:bg-gray-100 rounded mt-3 pl-3"
                >
                  <RoomOutlinedIcon
                    className="text-[#FF6F1E]"
                    sx={{ fontSize: "20px" }}
                  />
                  <ListItem
                    key={location.placeId}
                    onClick={() => handleSelect(location)}
                  >
                    <ListItemText primary={location.name} />
                  </ListItem>
                </div>
              ))
            )}
          </List>
        </div>
      </div>
    </div>
  );
};

export default SearchDropOffLocation;
