import {
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { Loader, SearchIcon, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import {
  fetchPartnerTransferLocations,
  filterPickups,
  type PartnerTransferPickup,
} from "../../../shared/partnerLocationsService";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";

interface SearchLocationProps {
  closeDialog: () => void;
  ChangeValue: (data: string) => void;
  value: string;
  setValue: (value: string) => void;
  setExtraFields?: (fields: {
    toLat?: number;
    toLon?: number;
    pickupLocaDescription: string;
  }) => void;
}

const SearchPickUpLocation = ({
  closeDialog,
  value,
  setValue,
  setExtraFields,
  ChangeValue,
}: SearchLocationProps) => {
  const [query, setQuery] = useState(value);
  const [allPickups, setAllPickups] = useState<PartnerTransferPickup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerTransferLocations()
      .then((data) => setAllPickups(data.pickups))
      .catch(() => setError("Failed to load pickup locations"))
      .finally(() => setLoading(false));
  }, []);

  const suggestions = useMemo(
    () => filterPickups(allPickups, query),
    [allPickups, query],
  );

  const handleSelect = (location: PartnerTransferPickup) => {
    const code = location.area || location.city || location.displayName;
    ChangeValue(location.displayName);
    setQuery(location.displayName);
    setValue(code);
    if (setExtraFields) {
      setExtraFields({ pickupLocaDescription: location.displayName });
    }
    closeDialog();
  };

  return (
    <div className="inset-0 fixed z-50">
      <div className="fixed inset-0 " onClick={closeDialog} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full lg:h-[450px] lg:w-[450px] lg:min-w-lg lg:max-w-sm bg-white lg:rounded-lg shadow-2xl z-[999] flex flex-col mt-6 lg:mt-0">
        <div className="p-6 pb-0 relative">
          <div className="lg:hidden pt-12 pb-5 lg:border-b border-gray-200">
            <div className="p-2 size-10 absolute left-6 bg-white lg:border-[0.5px] lg:border-[#EBECED] shadow-md rounded-sm cursor-pointer">
              <X onClick={closeDialog} className="font-bold" />
            </div>
            <h2 className="text-lg font-bold text-center">Pick Up</h2>
          </div>
          <div className="lg:flex hidden  items-center pl-2">
            <div className="p-2 size-10 bg-white lg:border-[0.5px] lg:border-[#EBECED] shadow-md rounded-sm cursor-pointer">
              <X onClick={closeDialog} className="font-bold" />
            </div>
            <h2 className="flex-grow text-center font-bold">Pick Up</h2>
          </div>
        </div>
        <form className="mt-6 mx-5 lg:mx-8">
          <TextField
            id="from"
            variant="outlined"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter pickup area or city"
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
              className="lg:max-h-[300px] max-h-[600px]"
              sx={{
                overflowY: "auto",
                padding: 0,
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
                "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" },
                "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
              }}
            >
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((location) => (
                  <div
                    key={location.id}
                    className="flex justify-between w-full items-center cursor-pointer hover:bg-gray-100 rounded mt-3 pl-3"
                  >
                    <RoomOutlinedIcon className="text-[#FF6F1E]" sx={{ fontSize: "20px" }} />
                    <ListItem onClick={() => handleSelect(location)} sx={{ cursor: "pointer" }}>
                      <ListItemText
                        primary={`${location.displayName}`}
                        secondary={[location.area, location.city, location.country].filter(Boolean).join(" · ")}
                      />
                    </ListItem>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  {error ?? (query.length > 0 ? "No matching pickup locations" : "Enter a pickup area or city")}
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
