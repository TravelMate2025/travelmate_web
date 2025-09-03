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

interface SearchLocationProps {
  closeDialog: () => void;
  value: string;
  collectFrom: (data: string, data2: string) => void;
  setValue: (value: string) => void;
  setExtraFields?: (fields: {
    endAddress?: string;
    endCity?: string;
    endCountry?: string;
    endGeoLat?: number;
    endGeoLong?: number;
    fromLat?: number;
    fromLon?: number;
    toLat?: number;
    toLon?: number;
    pickUpLocaDescription: string;
  }) => void;
}

interface PickUp {
  code: string;
  content: {
    description: string;
    error: string | null;
    type: string;
  };
  coordinates: {
    error: string | null;
    latitude: number;
    longitude: number;
  };
  countryCode: string;
  language: string;
}

const SearchPickUpLocation = ({
  closeDialog,
  value,
  setValue,
  collectFrom,
  setExtraFields,
}: SearchLocationProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<PickUp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounce function to limit API calls
  const timeoutRef = useRef<number| null>(null);
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    return (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => func(...args), wait);
    };
  };

  const fetchLocations = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
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
        setSuggestions(response.data);
      } else {
        setSuggestions([]);
        setError("No airports found for this query");
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch airports");
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
    if (!location.code || !location.code.match(/^[A-Z]{3}$/)) {
      setError("Please select a valid IATA code");
      return;
    }

    setQuery(location.content.description);
    setValue(location.content.description);
    collectFrom(location.content.description, location.code);
    if (setExtraFields) {
      const fields: Parameters<NonNullable<typeof setExtraFields>>[0] = {
        fromLat: location.coordinates.latitude,
        fromLon: location.coordinates.longitude,
        endCountry: location.countryCode,
        pickUpLocaDescription: location.content.description,
      };
      setExtraFields(fields);
    }
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
    <div className="min-w-screen min-h-screen p-8 rounded-lg bg-white shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:min-h-[400px] lg:min-w-[90vh] block z-[99] mt-5">
      <div className="flex justify-normal gap-32 lg:gap-42 items-center my-5 w-full">
        <div className="p-[8px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] cursor-pointer">
          <X onClick={closeDialog} className="font-bold" />
        </div>
        <h2 className="font-bold text-lg">Pick Up</h2>
      </div>
      <form className="mt-6">
        <TextField
          id="from"
          variant="outlined"
          size="small"
          value={query}
          helperText={error}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter airport name or IATA code"
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
            sx={{
              maxHeight: "300px",
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
                  className="flex justify-between w-full items-center"
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
                      primary={location.content.description}
                      secondary="Airport"
                    />
                  </ListItem>
                  <p className="pr-3">{location.code}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                {query
                  ? "No airports found"
                  : "Enter an airport name or IATA code"}
              </div>
            )}
          </List>
        </div>
      </form>
    </div>
  );
};

export default SearchPickUpLocation;
