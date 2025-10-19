import {
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { Loader, SearchIcon, X } from "lucide-react";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { transferService } from "../../services/transferService";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import toast from "react-hot-toast";

interface SearchLocationProps {
  closeDialog: () => void;
  ChangeValue: (data: string) => void;
  value: string;
  setValue: (value: string) => void;
  setExtraFields?: (fields: {
    endAddress?: string;
    endCity?: string;
    endCountry?: string;
    fromLat?: number;
    fromLon?: number;
    toLat?: number;
    toLon?: number;
    pickUpLocaDescription: string;
  }) => void;
}

interface PickUp {
  cityName: string;
  countryCode: string;
  countryName: string;
  displayName: string;
  geoCode: { latitude: number; longitude: number };
  iataCode: string;
  id: string;
  name: string;
  type: string;
}

const SearchPickUpLocation = ({
  closeDialog,
  value,
  setValue,
  setExtraFields,
  ChangeValue,
}: SearchLocationProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<PickUp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounce function to limit API calls
  const timeoutRef = useRef<number | null>(null);
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    return (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => func(...args), wait);
    };
  };

  const fetchLocations = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await transferService.lookupTerminal(searchQuery);
      if (response?.data && Array.isArray(response.data)) {
        setSuggestions(
          response.data && response.data.find((loc) => loc.type === "AIRPORT")
            ? response.data.filter((loc) => loc.type === "AIRPORT")
            : response.data
        );
      } else {
        setSuggestions([]);
        setError(response.error || "Failed to fetch airports");
      }
    } catch (error: any) {
      setError(error.response.data || "Failed to fetch airports");
      toast.error(error.response.data || "Failed to fetch airports");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced fetchLocations to prevent excessive API calls
  const debouncedFetchLocations = useMemo(
    () => debounce(fetchLocations, 300),
    [fetchLocations]
  );

  const handleSelect = (location: PickUp) => {
    ChangeValue(location.displayName);
    setQuery(location.displayName);
    setValue(location.iataCode);
    if (setExtraFields) {
      const fields: Parameters<NonNullable<typeof setExtraFields>>[0] = {
        fromLat: location.geoCode.latitude,
        fromLon: location.geoCode.longitude,
        endCountry: location.countryName,
        pickUpLocaDescription: location.displayName,
      };
      setExtraFields(fields);
    }
    // setQuery("");
    closeDialog();
  };

  useEffect(() => {
    if (query) {
      debouncedFetchLocations(query);
    } else {
      setSuggestions([]);
      setError(null);
    }
  }, [query, debouncedFetchLocations]);

  return (
    <div className="inset-0 fixed z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 " />
      <div className="min-w-screen min-h-screen p-8 rounded-lg bg-white shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:min-h-[400px] lg:min-w-[90vh] block z-[99] mt-5">
        <div className="flex justify-normal gap-24 lg:gap-42 items-center my-5 w-full pt-12 lg:pt-0">
          <div className="p-[8px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] cursor-pointer">
            <X onClick={closeDialog} className="font-bold" />
          </div>
          <h2 className="font-bold text-lg ">
            Pick Up
          </h2>
        </div>
        <form className="mt-6">
          <TextField
            id="from"
            variant="outlined"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter airport name or location"
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
          <div>
            <List
              className="lg:max-h-[300px] h-full"
              sx={{
                // maxHeight: "300px",

                overflowY: "auto",
                padding: 0,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#555",
                },
              }}
            >
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((location, index) => (
                  <div
                    key={index}
                    className="flex justify-between w-full items-center cursor-pointer hover:bg-gray-100 rounded mt-3 pl-3"
                  >
                    <RoomOutlinedIcon
                      className="text-[#FF6F1E]"
                      sx={{ fontSize: "20px" }}
                    />
                    <ListItem
                      onClick={() => handleSelect(location)}
                      sx={{ cursor: "pointer" }}
                    >
                      <ListItemText
                        primary={`${location.displayName} ${location.countryName}`}
                        secondary="Airport"
                      />
                    </ListItem>
                    <p className="pr-3">{location.iataCode}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-red-500">
                  {error ? error : "Enter a valid airport name or location"}
                </div>
              )}
            </List>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchPickUpLocation;
