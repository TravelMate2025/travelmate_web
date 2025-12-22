import { InputAdornment, TextField } from "@mui/material";
import axios from "axios";
import { Loader, SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { GuestInfoProps } from "../../slice";

interface countryModalProps {
  closeDialog: () => void;
  formData?: GuestInfoProps;
  setFormData: (data: GuestInfoProps) => void;
}
const CountryCodeModal = ({
  closeDialog,
  setFormData,
  formData,
}: countryModalProps) => {
  const [query, setQuery] = useState("");
  const [countryCodes, setCountryCodes] = useState<any[]>([]);
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags"
        );
        const filtered = response.data.filter(
          (c: any) =>
            c.idd && c.idd.root && c.idd.suffixes && c.idd.suffixes.length > 0
        );
        const mapped = filtered.map((c: any) => ({
          ...c,
          dialCode: `${c.idd.root}${c.idd.suffixes[0]}`,
        }));
        // ✅ Sort alphabetically by country name
        const sorted = mapped.sort((a: any, b: any) =>
          a.name.common.localeCompare(b.name.common)
        );

        setCountryCodes(sorted);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };
    fetchCodes();
  }, []);
  const filteredCountry = countryCodes.filter(
    (country) =>
      country.name.common.toLowerCase().includes(query.toLowerCase()) ||
      country.cca2.toLowerCase().includes(query.toLowerCase()) ||
      country.dialCode.includes(query)
  );

  return (
    <div className="inset-0 fixed z-50 lg:pt-6">
      {/* Backdrop */}
      <div className="fixed inset-0 " onClick={closeDialog} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full lg:h-[450px] lg:w-[450px] lg:min-w-lg lg:max-w-sm bg-white lg:rounded-lg shadow-2xl z-[999] flex flex-col mt-6 pt-6 ">
        <div className=" pb-0 relative">
          <div className="px-6 lg:hidden pt-12 pb-5 lg:border-b border-gray-200">
            <div className="p-2 size-10 absolute left-6 bg-white lg:border-[0.5px] lg:border-[#EBECED] shadow-md rounded-sm cursor-pointer">
              <X onClick={closeDialog} className="font-bold" />
            </div>
            <h2 className="text-lg font-bold text-center">
              Select Country Code
            </h2>
          </div>
          <div className="px-6 lg:flex hidden  items-center pl-2">
            <div className="p-2 size-10 bg-white lg:border-[0.5px] lg:border-[#EBECED] shadow-md rounded-sm cursor-pointer">
              <X onClick={closeDialog} className="font-bold" />
            </div>
            <h2 className="flex-grow text-center font-bold">
              Select Country Code
            </h2>
          </div>
          <div className="mt-4">
            <TextField
              id="from"
              variant="outlined"
              size="small"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Enter country name or codes"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              className="w-full"
              sx={{
                "& .MuiInputBase-root": {
                  height: "44px",
                  borderRadius: "8px",
                  marginX: "24px",
                },
              }}
            />
            <h3 className="bg-gray-300 p-2 pl-7 mt-6 font-semibold">
              Country Codes
            </h3>
            <div className="pt-3 lg:h-[300px] h-screen overflow-y-scroll bg-white">
              {countryCodes.length === 0 ? (
                <div className="flex justify-center items-center gap-2">
                  Loading
                  <Loader className="animate-spin" />
                </div>
              ) : filteredCountry.length === 0 ? (
                <p className="text-center m-auto border-b-[1px] border-b-neutral-300 p-2">No Country Found</p>
              ) : (
                filteredCountry.map((country) => (
                  <p
                    key={country.cca2}
                    onClick={() => {
                      setFormData({
                        ...formData!,
                        countryCode: `${country.dialCode}`,
                      });
                      closeDialog();
                    }}
                    className="p-2 pl-7 border-b-[1px] border-b-neutral-300 hover:bg-gray-200 cursor-pointer"
                  >
                    {`${country.name.common} (${country.dialCode})`}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryCodeModal;
