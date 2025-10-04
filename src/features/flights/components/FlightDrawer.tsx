import {
  SwipeableDrawer,
  DialogContent,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
  Dialog,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { Icon } from "@iconify/react/dist/iconify.js";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlightClassOutlinedIcon from "@mui/icons-material/FlightClassOutlined";
import { MdArrowDropDown } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { FlightOffer, FlightUpsellOfferResponse, Segment, UpsellFlightOffer, UpsellFlightOfferResponse, UpSellPrice } from "../types";
import { formatDuration, formatStops, getCity } from "../utils/functions";
import { FlightReviewState } from "./roundtrip/Steps/Step1";
import { useEffect, useState, memo } from "react";
import { fromTheme } from "tailwind-merge";

import dayjs from "dayjs";
import FlightDetails from "./FlightDetails";
import { useUpsellFlightOfferMutation } from "../api/flightApi";

export function formatDateRange(range: string) {
  console.log(range);
  
  const [start, end] = range.split(" to ");
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  // If both are in the same month, show month once
  if (startDate.format("MMM") === endDate.format("MMM")) {
    return `${startDate.format("MMM D")} to ${endDate.format("MMM D")}`;
  }

  // Different months → show both
  return `${startDate.format("MMM D")} to ${endDate.format("MMM D")}`;
}

interface Option {
  id: string;
  title: string;
  price: number;
  image: string;
  features: string[];
}

export interface Counts {
  adults: number;
  children?: number;
  infants?: number;
  extraBags: number; // add this
}
interface FlightDrawerProps {
  openClick: boolean;
  handleCloseClick: () => void;
  selectedDeparture?: FlightOffer;
  title: string;
  options: Option[];
  onNext?: () => void;
  multiCitySelections?: {
    flight: FlightOffer;
    counts: Counts;
    option: string;
    upsell: UpsellFlightOfferResponse;
  }[];
  selectedOption: string | null;
  setMultiCitySelections?: React.Dispatch<
    React.SetStateAction<
      {
        flight: FlightOffer;
        counts: Counts;
        option: string;
        upsell: UpsellFlightOfferResponse;
      }[]
    >
  >;
  setSelectedOption: (id: string) => void;
  counts: Counts;
  handleIncrement: (
    type: "children" | "adults" | "infants" | "extraBags"
  ) => void; // extend
  handleDecrement: (
    type: "children" | "adults" | "infants" | "extraBags"
  ) => void; // extend
  returnFlight: number;
}

export const FlightDrawer = memo<FlightDrawerProps>(
  ({
    openClick,
    handleCloseClick,
    selectedDeparture,
    options,
    onNext,
    selectedOption,
    setSelectedOption,
    counts,
    multiCitySelections,
    setMultiCitySelections,
    handleIncrement,
    handleDecrement,
    returnFlight,
    title,
  }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const extraBagPrice = 10000;

    let firstSegment, lastSegment, itinerary, price;
    if (selectedDeparture) {
      itinerary = selectedDeparture.itineraries?.[returnFlight]; // departure itinerary
      firstSegment = itinerary?.segments?.[0];
      lastSegment = itinerary?.segments?.[itinerary.segments.length - 1];
      price = Number(selectedDeparture.price?.grandTotal);
    }

    const [upsell, setUpsell] =  useState<{upsell?:FlightUpsellOfferResponse , total:number}>({total:0})

    const [upsellFlightOffer, { data, isLoading, error }] =
      useUpsellFlightOfferMutation();

   

    // Helper function to get segment details
  

   

    useEffect(() => {
      if (selectedDeparture) {
        const handleUpsell = async () => {
          const res = await upsellFlightOffer({
            flight_offer_id: selectedDeparture.id,
          }).unwrap();
          console.log("Upsell result:", res);
        };

        handleUpsell();
      }
    }, [selectedDeparture]);

    const handleMultiCitySelect = () => {
      // Ensure required data is available
      if (!selectedDeparture || !selectedOption) {
        console.warn(
          "Cannot select: Missing selectedDeparture or selectedOption"
        );
        return;
      }

      // Compute the updated selections locally
      const updatedSelections = [
        ...(multiCitySelections || []),
        {
          counts: { ...counts },
          flight: selectedDeparture,
          option: selectedOption,
          upsell
        },
      ];

      // Log for debugging
      console.log("Current returnFlight index:", returnFlight);

      // Update the state
      setMultiCitySelections?.(updatedSelections);

      // Check if there is a next segment
      if (
        location.state?.flights &&
        Array.isArray(location.state.flights) &&
        returnFlight + 1 < location.state.flights.length &&
        onNext
      ) {
        console.log("Proceeding to next segment");
        handleCloseClick();
        onNext();
        return;
      }

      // If last segment, navigate to review page
    
      navigate("/flight/review", {
        state: { ...location.state, multiCitySelections: updatedSelections,  },
      });
    };

    useEffect(() => {
      console.log("multiCitySelections updated:", multiCitySelections);
    }, [multiCitySelections]);

    const Content = (
      <DialogContent
        sx={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: "5px",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="absolute z-40 top-0 left-0 right-0 bg-white md:border-b border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-4">
          <div className="flex  items-center relative max-md:flex-row-reverse">
            <p className="text-[20px] font-inter  flex-1  text-center font-semibold ">
              {title} Flight
            </p>

            <IconButton onClick={handleCloseClick} sx={{}}>
              <CloseOutlinedIcon
                onClick={handleCloseClick}
                className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]"
              />
            </IconButton>
          </div>
        </div>

        <div className="mt-[75px] ">
          <div className="w-full border-1 border-[#023E8A] bg-[#CCD8E81A] rounded-[6px] mb-[16px] ">
            <div className="items-center p-2">
       
                <>
                  <p className=" text-[14px] md:text-[18px] text-[#181818] font-inter font-medium">
                    {
                      getCity(firstSegment?.departure.iataCode as string)
                        ?.municipality
                    }{" "}
                    to{" "}
                    {
                      getCity(lastSegment?.arrival.iataCode as string)
                        ?.municipality
                    }
                  </p>
                </>
             

              <p className="text-[14px] text-[#4E4F52] ">
                {/* {formatDateRange(location.state.departureDate)},{" "} */}
                {/* {location.state?.passengers} */}
              </p>
            </div>
          </div>

          <div>
            <div className="w-full border border-[#DEDFE1] bg-white rounded-[6px] p-[12px]">
              <div>
                <p className="md:text-[19px] text-[12px] font-medium text-[#181818]">
                  Departure Flight
                </p>

                {/* Base Price */}
                <div>
                  <p className="text-[#181818] md:text-[16px] text-[12px] font-medium">
                    {selectedDeparture?.price?.totalWithFee
                      ? Number(
                          selectedDeparture.price.grandTotal
                        ).toLocaleString()
                      : "50,000"}{" "}
                    {selectedDeparture?.price.currency}
                  </p>

                  <p className="text-[#67696D] md:text-[12px] text-[10px] font-normal">
                    Per Passenger
                  </p>
                </div>

                {/* Extra Bags */}
                {counts.extraBags > 0 && (
                  <p className="text-[#67696D] md:text-[16px] text-[12px] font-normal">
                    + ₦{(extraBagPrice * counts.extraBags).toLocaleString()} for{" "}
                    {counts.extraBags} extra bag
                    {counts.extraBags > 1 ? "s" : ""}
                  </p>
                )}

                {/* Total Price */}

                <p className="text-[#67696D] md:text-[14px] text-[11px]">
                  Price includes taxes & fees
                </p>
              </div>
            </div>
          </div>

          {selectedDeparture && (
            <div>
              <div className="w-full border-1 border-[#DEDFE1] bd-white rounded-[6px] p-[12px] mt-[16px] mb-[16px]">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-[4px] items-center">
                    <div className="border p-[3px] border-[#DEDFE1] bg-white h-[40px] w-[40px] rounded-lg flex items-center justify-center">
                      {/* Airline code as placeholder since no image in JSON */}
                      <span className="font-bold">
                        {firstSegment?.carrierCode}
                      </span>
                    </div>
                    <span className="text-base font-medium">
                      {firstSegment?.carrierCode} {firstSegment?.number}
                    </span>
                  </div>
                  <p className="text-[#4E4F52] font-normal md:text-[16px] text-[12px] ">
                    <FlightClassOutlinedIcon
                      sx={{
                        width: { xs: "16px", md: "18px" },
                        height: { xs: "16px", md: "18px" },
                      }}
                    />
                    {location.state?.flightClass}
                  </p>
                  <p className="text-[#4E4F52] font-normal md:text-[16px] text-[12px] ">
                    <CalendarMonthOutlinedIcon
                      sx={{
                        width: { xs: "16px", md: "18px" },
                        height: { xs: "16px", md: "18px" },
                      }}
                    />
                    {firstSegment?.departure?.at
                      ? ` ${new Date(firstSegment.departure.at).toLocaleString(
                          "en-US",
                          { month: "short", day: "2-digit" }
                        )}`
                      : ""}
                  </p>
                  <p className="text-[#4E4F52] md:text-[16px] text-[12px] font-normal">
                    <AccessTimeIcon
                      sx={{
                        width: { xs: "16px", md: "18px" },
                        height: { xs: "16px", md: "18px" },
                      }}
                    />
                    {firstSegment?.departure?.at
                      ? new Date(firstSegment.departure.at).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )
                      : ""}{" "}
                    -{" "}
                    {lastSegment?.arrival?.at
                      ? new Date(lastSegment.arrival.at).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : ""}{" "}
                    (
                    {itinerary?.duration
                      ? formatDuration(itinerary.duration)
                      : ""}
                    ,{" "}
                    {itinerary?.segments
                      ? formatStops(itinerary.segments.length - 1)
                      : ""}
                    )
                  </p>

                  <p className="text-[#4E4F52] md:text-[16px] text-[12px]  font-normal">
                    <CloseOutlinedIcon
                      sx={{
                        width: { xs: "16px", md: "18px" },
                        height: { xs: "16px", md: "18px" },
                      }}
                    />{" "}
                    {selectedDeparture?.pricingOptions.fareType[0]}
                  </p>
                </div>

                <div></div>
              </div>
            </div>
          )}
          <div className="w-full border-1 border-[#DEDFE1] space-y-3 bd-white rounded-[6px] p-3 my-4">
            <h3 className="font-[500]">Seat</h3>

            {/* Seat */}
            <p className="text-[#4E4F52] text-sm md:text-base mb-2 flex items-center gap-2">
              {selectedDeparture?.travelerPricings?.[0]
                ?.fareDetailsBySegment?.[0]?.cabin ||
                "Cabin info not available"}
            </p>
          </div>

          <Accordion
            disableGutters
            square
            sx={{
              "&:before": { display: "none" },
              boxShadow: "none",
              borderBottom: "1px solid #e0e0e0",
              mb: 2,

              borderRadius: 2,
              "&.MuiPaper-root": {
                width: "unset !important",
                height: "unset !important",
                minWidth: "unset !important",
              },
            }}
            variant="outlined"
          >
            <AccordionSummary
              expandIcon={<MdArrowDropDown color="#023E8A" size={20} />}
              sx={{
                px: 2,
                bgcolor: "#F5F5F5",
                "& .MuiAccordionSummary-content": {
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              }}
            >
              <Typography
                variant="h6"
                fontSize={{
                  xs: "12px",
                  sm: "14px",
                  bgcolor: "#F5F5F5",
                  color: "#023E8A",
                }}
                padding={0}
                fontWeight={500}
              >
                View Flight Details
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              {selectedDeparture && (
                <FlightDetails
                  flight={selectedDeparture}
                  segment={returnFlight}
                />
              )}
            </AccordionDetails>
          </Accordion>
          {data && (
            <Accordion
              disableGutters
              square
              sx={{
                "&:before": { display: "none" },
                boxShadow: "none",
                borderBottom: "1px solid #e0e0e0",
                borderRadius: 2,
                "&.MuiPaper-root": {
                  width: "unset !important",
                  height: "unset !important",
                  minWidth: "unset !important",
                },
              }}
              variant="outlined"
            >
              <AccordionSummary
                expandIcon={<MdArrowDropDown color="black" size={20} />}
                sx={{
                  px: 2,
                  "& .MuiAccordionSummary-content": {
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  fontSize={{ xs: "14px", sm: "18px" }}
                  padding={0}
                >
                  Upgrade Your Flight
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Divider sx={{ bgcolor: "#CDCED1" }} />
                {data.data.map((flightData) => {
                  return (
                    <>
                      <Accordion
                        key={flightData.id}
                        disableGutters
                        square
                        sx={{
                          "&:before": { display: "none" },
                          boxShadow: "none",
                          borderRadius: "0 !important",
                          borderBottom: 1 ? "1px solid #CDCED1" : "none",
                          "&.MuiPaper-root": {
                            width: "unset !important",
                            height: "unset !important",
                            minWidth: "unset !important",
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <MdArrowDropDown color="black" size={20} />
                          }
                          sx={{
                            px: 2,
                            "& .MuiAccordionSummary-content": {
                              justifyContent: "space-between",
                              alignItems: "center",
                            },
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle1"
                              fontSize={{ xs: "14px", sm: "18px" }}
                              p={0}
                            >
                              ({flightData.cabin})
                            </Typography>
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ pb: 2, px: 2 }}>
                          <div className="flex justify-between items-center mb-4">
                            <Typography variant="body2" color="text.secondary">
                              Total: {flightData.price.currency}{" "}
                              {flightData.price.upsellDifference && (
                                <span>
                                  {" "}
                                  (Upsell: {flightData.price.upsellDifference})
                                </span>
                              )}
                            </Typography>
                            <div>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "medium", mt: 0.5 }}
                              >
                                Checked Bags:{" "}
                                {firstSegment.includedCheckedBags?.quantity ??
                                  0}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "medium", mt: 0.5 }}
                              >
                                Cabin Bags:{" "}
                              </Typography>
                            </div>

                            <Button
                              disabled={upsell?.upsell?.id === flightData.id}
                              variant="contained"
                              sx={{
                                backgroundColor:
                                  upsell?.upsell?.id === flightData.id
                                    ? "#9B9EA4"
                                    : "#023E8A",
                                "&:hover": {
                                  backgroundColor:
                                    upsell?.upsell?.id === flightData.id
                                      ? "#9B9EA4"
                                      : "#0353A4",
                                },
                                borderRadius: 2,
                                textTransform: "none",
                              }}
                              onClick={() => {
                                const rawDiff =
                                  flightData.price.upsellDifference || "";
                                const pricePart = rawDiff.includes("+")
                                  ? rawDiff.split("+")[1]
                                  : rawDiff;
                                const price = Number(pricePart) || 0;

                                setUpsell({
                                  total: price,
                                  upsell: flightData,
                                });
                              }}
                            >
                              {upsell?.upsell?.id === flightData.id
                                ? "Selected"
                                : "Select"}
                            </Button>
                          </div>

                          <Stack direction="row" flexWrap="wrap">
                            {firstSegment.amenities?.map((a, i) => (
                              <Box
                                key={i}
                                display="flex"
                                alignItems="center"
                                mr={2}
                                mb={1}
                              >
                                {a.isChargeable ? (
                                  <Icon
                                    icon="ic:baseline-money"
                                    width="20"
                                    height="20"
                                    color="black"
                                  />
                                ) : (
                                  <CheckIcon
                                    fontSize="small"
                                    sx={{ mr: 0.5, color: "black" }}
                                  />
                                )}
                                <Typography variant="body2">
                                  {a.description}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          )}

          <Card
            variant="outlined"
            sx={{
              marginTop: "20px",
              borderRadius: "6px",
              "&.MuiPaper-root": {
                width: "unset !important",
                height: "unset !important",
                minWidth: "unset !important",
              },
            }}
          >
            {selectedDeparture && (
              <CardContent>
                <div className="space-y-1 mb-4">
                  <p className="text-[#181818] font-semibold text-[12px] md:text-[18px] font-medium">
                    Bags
                  </p>

                  {/* Carry-on bag */}
                  <p className="text-[#4E4F52] text-[10px] md:text-[16px] font-normal">
                    Carry On Bag
                  </p>
                  <p className="text-[#181818] text-[10px] md:text-[16px] font-normal">
                    {selectedDeparture?.travelerPricings[0]
                      .fareDetailsBySegment[0].includedCabinBags?.quantity > 0
                      ? `${selectedDeparture?.travelerPricings[0].fareDetailsBySegment[0].includedCabinBags.quantity} Included`
                      : "Not Included"}
                  </p>

                  {/* Checked bag */}
                  <p className="text-[#4E4F52] text-[12px] md:text-[18px] font-normal">
                    Checked Bag
                  </p>
                  <p className="text-[#181818] text-[12px] md:text-[18px] font-normal">
                    {selectedDeparture?.travelerPricings[0]
                      .fareDetailsBySegment[0].includedCheckedBags?.quantity > 0
                      ? `${selectedDeparture.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} Included`
                      : "Checked bag for a fee"}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </DialogContent>
    );

    const state = location.state as FlightReviewState;

    const checkRoute = (): string => {
      switch (location.pathname) {
        case "/flight/departure":
          return state.tripType === "round-trip"
            ? "/flight/return"
            : "/flight/review";

        case "/flight/review":
          return "/flight/review";

        default:
          return "/flight/review";
      }
    };
    const ActionButton = (
      <div
        className="sticky bottom-0 md:border-t border-[grey] left-0 right-0 bg-white p-4 rounded-b-[10px]"
        onClick={
          location.state.tripType === "multi-city"
            ? handleMultiCitySelect
            : undefined
        }
      >
        <button
          className="w-full h-[52px] rounded-[6px] bg-[#023E8A] text-white cursor-pointer"
          onClick={
            location.state.tripType !== "multi-city"
              ? () => {
                  let state;

                  if (location.pathname === "/flight/departure") {
                    state = {
                      ...location.state,
                      departureFlight: selectedDeparture,
                      departureTotal: price as any,
                      departureUpsell: upsell,
                      departureCounts: counts,
                      departureFlightOption: selectedOption,
                      upsell,
                    };
                  } else if (location.pathname === "/flight/return") {
                    state = {
                      ...location.state,
                      returnTotal: price,
                      returnUpsell: upsell,
                      upsell,
                      returnFlight: selectedDeparture,
                      returnCounts: counts,
                      returnFlightOption: selectedOption,
                    };
                  } else {
                  
                        state = {
                          ...location.state,
                          total: price,
                          upsell,
                        };
                  }
           

                  navigate(checkRoute(), { state });
                }
              : undefined
          }
        >
          Select for {price ? Number(price + upsell.total).toLocaleString() : "—"}{" "}
          {selectedDeparture?.price.currency}
        </button>
      </div>
    );

    return isMobile ? (
      <SwipeableDrawer
        anchor="bottom"
        open={openClick}
        onClose={handleCloseClick}
        onOpen={() => {}}
        PaperProps={{
          sx: {
            height: "85vh",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {Content}
        {ActionButton}
      </SwipeableDrawer>
    ) : (
      <Dialog
        open={openClick}
        onClose={handleCloseClick}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          "& .MuiPaper-root": {
            maxWidth: "693px",
            width: "100%",
            height: "880px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {Content}
        {ActionButton}
      </Dialog>
    );
  }
);

FlightDrawer.displayName = "FlightDrawer";
