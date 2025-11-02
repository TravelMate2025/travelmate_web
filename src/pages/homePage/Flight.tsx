import type React from "react";
import {  useCallback, useMemo, useState, useRef } from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  IconButton,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { DateSelection, useFlightBooking } from "../../features/flights/hooks/useFlightBooking";
import { LocationSelector } from "../../features/flights/components/LocationSelector";
import { DateSelector } from "../../features/flights/components/DateSelector";
import { PassengerSelector } from "../../features/flights/components/PassengerSelector";
import { ClassSelector } from "../../features/flights/components/ClassSelector";
import { format, startOfDay, isBefore,  } from "date-fns";
import { Airport } from "../../features/flights/types";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Shared
const today = startOfDay(new Date());

export const airportSchema = yup.object({
  id: yup.string().nullable(),
  name: yup.string().required("Airport name is required"),
  iataCode: yup.string().nullable(),
  cityName: yup.string().required("City name is required"),
  countryCode: yup.string().required("Country code is required"),
  countryName: yup.string().nullable(),
  geoCode: yup.object({
    latitude: yup.number().required(),
    longitude: yup.number().required(),
  }),
  displayName: yup.string().required(),
  type: yup.mixed<"AIRPORT" | "CITY">().oneOf(["AIRPORT", "CITY"]).required(),
  priority: yup.number().required(),
});

export const segmentSchema = yup.object({
  from: airportSchema.required("Origin is required"),
  to: airportSchema.required("Destination is required"),
  date: yup
    .mixed()
    .test("future-date", "Date must be in the future", (value) => {
      if (!value) return false;
      if (value instanceof Date) {
        return !isBefore(startOfDay(value), today);
      }
      return false;
    })
    .required("Date is required"),
});

const passengersSchema = yup
  .object({
    adults: yup.number().min(1, "At least 1 adult is required"),
    children: yup.number().min(0),
    infants: yup.number().min(0),
  })
  .test(
    "children-infants",
    "Children and infants cannot exceed adults",
    (v) => {
      const adults = v?.adults || 0;
      const children = v?.children || 0;
      const infants = v?.infants || 0;
      return children + infants <= adults;
    }
  );
type TripDate = Date | { startDate: Date; endDate: Date };
// ✅ Simple trip schema
export const simpleTripSchema = yup.object({
  tripType: yup
    .string()
    .oneOf(["round-trip", "one-way", "multi-city"])
    .required(),
  from: airportSchema.required("Origin is required"),
  to: airportSchema.required("Destination is required"),
  date: yup
    .mixed<TripDate>()
    .required("Date is required")
    .test("future-date", "Date must be in the future", (value) => {
      if (!value) return false;
      
      console.log("value", value);
      if (value instanceof Date) {
        return !isBefore(startOfDay(value), today);
      }

      if (
      Object.keys(value).length > 0
      ) {
        return !isBefore(startOfDay(value.startDate), today);
      }

      return false;
    }),
  class: yup.string().required("Class is required"),
  passengers: passengersSchema,
});

// ✅ Multi-city schema
export const multiTripSchema = yup.object({
  tripType: yup.string().oneOf(["multi-city"]).required(),
  flights: yup
    .array()
    .of(segmentSchema)
    .min(2, "At least 2 flights required")
    .required("At least 2 flights are required"),
  class: yup.string().required("Class is required"),
  passengers: passengersSchema,
});

export type SimpleTripFormValues = yup.InferType<typeof simpleTripSchema>;
export type MultiTripFormValues = yup.InferType<typeof multiTripSchema>;

  export const getFormattedDate = (date: DateSelection) => {
    if (!date) return "";
    if (date instanceof Date) return format(date, "dd MMM yyyy");
    return `${format(date.startDate, "dd MMM yyyy")} to ${format(
      date.endDate,
      "dd MMM yyyy"
    )}`;
  };
const FlightBookingForm: React.FC = () => {
  const {
    tripType,
    setTripType,

   
    handleSearch,
  } = useFlightBooking();

  const simpleForm = useForm<SimpleTripFormValues>({
    resolver: yupResolver(simpleTripSchema),
    defaultValues: {
      tripType: "round-trip",
      from: undefined,
      to: undefined,
      date: undefined,
      class: "",
      passengers: { adults: 1, children: 0, infants: 0 },
    },
  });

  const multiForm = useForm<MultiTripFormValues>({
    resolver: yupResolver(multiTripSchema),
    defaultValues: {
      tripType: "multi-city",
      flights: [],
      class: "",
      passengers: { adults: 1, children: 0, infants: 0 },
    },
  });

  const onSubmit = simpleForm.handleSubmit((data) => {
    console.log("✅ Validated Form:", data);

    handleSearch(
      data.class,
      data.passengers as any,
      data.date as any,
      data.from as Airport,
      data.to as Airport,
    );
  });
  const onSubmitMulti = multiForm.handleSubmit((data) => {
    console.log("✅ Validated Form:", data);

     handleSearch(
       data.class,
       data.passengers as any,
       undefined,
       undefined,
       undefined,
    // @ts-ignore
    data.flights
     );
  });

  const fromAnchors = useRef<Record<string, HTMLDivElement | null>>({});
  const toAnchors = useRef<Record<string, HTMLDivElement | null>>({});

  const [isOpenFrom, setIsOpenFrom] = useState(false);
  const [isOpenTo, setIsOpenTo] = useState(false);

  const [openFrom, setOpenFromMulti] = useState<Record<string, boolean>>({});
  const [openTo, setOpenToMulti] = useState<Record<string, boolean>>({});

  const toggleOpenFrom = (id: string, value: boolean) => {
    setOpenFromMulti((prev) => ({ ...prev, [id]: value }));
  };

  const toggleOpenTo = (id: string, value: boolean) => {
    setOpenToMulti((prev) => ({ ...prev, [id]: value }));
  };

  const handleTripTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTripType(event.target.value);
    },
    [setTripType]
  );

  const tripTypeOptions = useMemo(
    () => [
      { value: "round-trip", label: "Round Trip" },
      { value: "one-way", label: "One Way" },
      { value: "multi-city", label: "Multi City" },
    ],
    []
  );

  const isSimpleTrip = tripType === "round-trip" || tripType === "one-way";
  const isMultiCity = tripType === "multi-city";


  return (
    <>
      <form onSubmit={onSubmit}>
        <FormControl sx={{ width: "100%" }}>
          {/* Trip Type Selection */}
          <RadioGroup
            row
            aria-labelledby="trip-type-label"
            name="trip-type"
            value={tripType}
            onChange={handleTripTypeChange}
            className="mb-8"
          >
            {tripTypeOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>

          {/* Simple Trip */}
          {isSimpleTrip && (
            <Grid container spacing={2}>
              {/* From */}
              <Grid item xs={12} md={2}>
                <Controller
                  name="from"
                  control={simpleForm.control}
                  render={({ field }) => (
                    <LocationSelector
                      id="from"
                      label="From"
                      onSelect={field.onChange}
                      isOpen={isOpenFrom}
                      anchorEl={fromAnchors.current["single"] || null}
                      setAnchorEl={(el) =>
                        (fromAnchors.current["single"] =
                          el as HTMLDivElement | null)
                      }
                      setIsOpen={setIsOpenFrom}
                      onRemoveLocation={() => field.onChange("")}
                    />
                  )}
                />
                {simpleForm.formState.errors.from && (
                  <p className="text-red-500 text-sm">
                    {simpleForm.formState.errors.from.message}
                  </p>
                )}
              </Grid>

              {/* To */}
              <Grid item xs={12} md={2}>
                <Controller
                  name="to"
                  control={simpleForm.control}
                  render={({ field }) => (
                    <LocationSelector
                      id="to"
                      label="To"
                      onSelect={field.onChange}
                      isOpen={isOpenTo}
                      anchorEl={toAnchors.current["single"] || null}
                      setAnchorEl={(el) =>
                        (toAnchors.current["single"] =
                          el as HTMLDivElement | null)
                      }
                      setIsOpen={setIsOpenTo}
                      onRemoveLocation={() => field.onChange("")}
                    />
                  )}
                />
                {simpleForm.formState.errors.to && (
                  <p className="text-red-500 text-sm">
                    {simpleForm.formState.errors.to.message}
                  </p>
                )}
              </Grid>

              {/* Date */}
              <Grid item xs={12} md={2}>
                <Controller
                  name="date"
                  control={simpleForm.control}
                  render={({ field }) => (
                    <DateSelector
                      id="departure-date"
                      label="Date"
                      disablePast
                      value={
                        field.value
                          ? field.value instanceof Date
                            ? format(field.value, "dd MMM yyyy")
                            : `${format(
                                // @ts-ignore
                                field.value.startDate,
                                "dd MMM yyyy"
                              )} - ${format(
                                // @ts-ignore
                                field.value.endDate,
                                "dd MMM yyyy"
                              )}`
                          : ""
                      }
                      onDateChange={(val) => {
                        if (val instanceof Date) {
                          field.onChange(val); // <-- stores date
                        } else if (val?.startDate && val?.endDate) {
                          field.onChange(val); // <-- store range object
                        } else {
                          field.onChange(null);
                        }
                      }}
                      range={tripType === "round-trip"}
                    />
                  )}
                />

                {simpleForm.formState.errors.date && (
                  <p className="text-red-500 text-sm">
                    {simpleForm.formState.errors.date.message}
                  </p>
                )}
              </Grid>

              {/* Passengers */}
              <Grid item xs={12} md={2}>
                <Controller
                  name="passengers"
                  control={simpleForm.control}
                  render={({ field }) => (
                    <PassengerSelector
                      id="passengers"
                      label="Passengers"
                      value={`${field.value.adults} Adult, ${field.value.children} Child, ${field.value.infants} Infant`}
                      // @ts-ignore
                      counts={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {simpleForm.formState.errors.passengers && (
                  <p className="text-red-500 text-sm">
                    {simpleForm.formState.errors.passengers.message}
                  </p>
                )}
              </Grid>

              {/* Class */}
              <Grid item xs={12} md={2}>
                <Controller
                  name="class"
                  control={simpleForm.control}
                  render={({ field }) => (
                    <ClassSelector
                      id="class"
                      label="Class"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {simpleForm.formState.errors.class && (
                  <p className="text-red-500 text-sm">
                    {simpleForm.formState.errors.class.message}
                  </p>
                )}
              </Grid>

              <Grid item xs={12} md={2} display="flex" alignItems="flex-end">
                <button
                  type="submit"
                  // disabled={!isCountryReady as boolean}
                  className="bg-[#023E8A] h-[52px] disabled:bg-zinc-700 md:max-w-[140px] w-full text-center text-white font-inter text-base rounded-[8px] cursor-pointer hover:bg-[#012a5c] transition-colors"
                >
                  Search
                </button>
              </Grid>
            </Grid>
          )}

          {/* Multi-City */}
        </FormControl>
      </form>

      <form onSubmit={onSubmitMulti}>
        {isMultiCity && (
          <div>
            <Grid container spacing={2}>
              {/* Passengers */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="passengers"
                  control={multiForm.control}
                  render={({ field }) => (
                    <PassengerSelector
                      id="passengers-multi"
                      label="Passengers"
                      value={`${field.value.adults} Adult, ${field.value.children} Child, ${field.value.infants} Infant`}
                      // @ts-ignore
                      counts={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {multiForm.formState.errors.passengers && (
                  <p className="text-red-500 text-sm mt-1">
                    {multiForm.formState.errors.passengers.message as string}
                  </p>
                )}
              </Grid>

              {/* Class */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="class"
                  control={multiForm.control}
                  render={({ field }) => (
                    <ClassSelector
                      id="class-multi"
                      label="Class"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {multiForm.formState.errors.class && (
                  <p className="text-red-500 text-sm mt-1">
                    {multiForm.formState.errors.class.message as string}
                  </p>
                )}
              </Grid>
            </Grid>

            {/* Flights */}
            {multiForm.watch("flights")?.map((_, index) => (
              <div key={index} className="mt-4">
                <label className="text-sm mb-2 block">Flight {index + 1}</label>
                <Grid container spacing={2}>
                  {/* From */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name={`flights.${index}.from`}
                      control={multiForm.control}
                      render={({ field }) => (
                        <LocationSelector
                          id={`from-${index}`}
                          label="From"
                          // @ts-ignore
                          value={field.value}
                          onSelect={field.onChange} // ✅ Pass full airport object
                          isOpen={!!openFrom[index]}
                          anchorEl={fromAnchors.current[index]}
                          setAnchorEl={(el) =>
                            (fromAnchors.current[index] =
                              el as HTMLDivElement | null)
                          }
                          setIsOpen={(val) =>
                            // @ts-ignore
                            toggleOpenFrom(index.toString(), val)
                          }
                        />
                      )}
                    />
                    {multiForm.formState.errors.flights?.[index]?.from && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          multiForm.formState.errors.flights[index]?.from
                            ?.message as string
                        }
                      </p>
                    )}
                  </Grid>

                  {/* To */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name={`flights.${index}.to`}
                      control={multiForm.control}
                      render={({ field }) => (
                        <LocationSelector
                          id={`to-${index}`}
                          label="To"
                          // @ts-ignore
                          value={field.value}
                          onSelect={field.onChange} // ✅ Pass full airport object
                          isOpen={!!openTo[index]}
                          anchorEl={toAnchors.current[index]}
                          setAnchorEl={(el) =>
                            (toAnchors.current[index] =
                              el as HTMLDivElement | null)
                          }
                          setIsOpen={(val) =>
                            // @ts-ignore
                            toggleOpenTo(index.toString(), val)
                          }
                        />
                      )}
                    />
                    {multiForm.formState.errors.flights?.[index]?.to && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          multiForm.formState.errors.flights[index]?.to
                            ?.message as string
                        }
                      </p>
                    )}
                  </Grid>

                  {/* Date */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name={`flights.${index}.date`}
                      control={multiForm.control}
                      render={({ field }) => (
                        <DateSelector
                          disablePast
                          id={`date-${index}`}
                          label="Date"
                          value={getFormattedDate(field.value as any)}
                          onDateChange={field.onChange}
                        />
                      )}
                    />
                    {multiForm.formState.errors.flights?.[index]?.date && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          multiForm.formState.errors.flights[index]?.date
                            ?.message as string
                        }
                      </p>
                    )}
                  </Grid>

                  {/* Remove button */}
                  {index > 1 && (
                    <Grid item xs={12}>
                      <IconButton
                        onClick={() =>
                          multiForm.setValue(
                            "flights",
                            multiForm
                              .getValues("flights")
                              .filter((_, i) => i !== index)
                          )
                        }
                      >
                        <CloseOutlinedIcon />
                        <span>Remove</span>
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </div>
            ))}

            {/* Buttons */}
            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              <Grid item>
                <button
                  type="button"
                  onClick={() =>
                    multiForm.setValue("flights", [
                      // @ts-ignore
                      ...multiForm.getValues("flights"),
                      // @ts-ignore
                      { from: null, to: null, date: null },
                    ])
                  }
                >
                  <AddOutlinedIcon />
                  Add Flight
                </button>
              </Grid>
              <Grid item>
                <button
                  type="submit"
                  className="bg-[#023E8A] h-[45px] w-[130px] text-white rounded-[8px]"
                >
                  Search
                </button>
              </Grid>
            </Grid>
          </div>
        )}
      </form>
    </>
  );
};

export default FlightBookingForm;
