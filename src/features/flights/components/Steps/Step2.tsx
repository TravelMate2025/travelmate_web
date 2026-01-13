"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,

  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Paper,
 
  InputAdornment,
  Box,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Grid2 from "@mui/material/Grid2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import dayjs from "dayjs";
import { useStepContext } from "./StepLayout";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { NationalitySelector } from "../NationalitySelector";
import { useLocation,  } from "react-router-dom";
import { LocationState } from "./Step1";
import {
  useCreateBookingMutation,

} from "../../api/flightApi";
import { BookingType, Passenger } from "../../types";
import toast from "react-hot-toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { DateSelector } from "../DateSelector";
import { format } from "date-fns";
import { useAppSelector } from "../../../../hooks/redux";
import { RootState } from "../../../../store";

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const today = new Date();
today.setHours(0, 0, 0, 0);

// Validation Schema for a single passenger
const passengerSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  dob: yup
    .date()
    .nullable()
    .required("Date of birth is required")
    .max(yesterday, "Date of birth cannot be today or in the future"),
  gender: yup.string().required("Gender is required"),
  passportNumber: yup
    .string()
    .required("Passport number is required")
    .max(9, "Passport must not be more than 9 characters")
    .matches(
      /^[a-zA-Z0-9]{1,9}$/,
      "Passport can only contain letters and numbers"
    ),

  passportExpiry: yup
    .date()
    .nullable()
    .required("Passport expiry is required")
    .min(today, "Passport expiry date cannot be in the past"),
  nationality: yup.string().required("Nationality is required"),
});

// Validation Schema for the entire form
const schema = yup.object().shape({
  passengers: yup.array().of(passengerSchema).required(),
  email: yup.string().email("Invalid email").required("Email is required"),
  countryCode: yup.string().required("Country code is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Must be digits only"),
});

// Styled Switch


// Shared styles
const fieldSx = {
  "& .MuiInputBase-root": {
    height: "50px",
    borderRadius: "8px",
    fontSize: "14px",
  },
};

const menuProps = {
  PaperProps: {
    sx: {
      maxHeight: 335,
      py: 0,
      m: 0,
      "& .MuiMenuItem-root": {
        py: "10px",
        "&:hover": { bgcolor: "#023E8A !important", color: "white" },
      },
      "& .MuiMenuItem-root.Mui-selected": {
        bgcolor: "#023E8A !important",
        color: "white",
      },
    },
  },
  MenuListProps: { sx: { py: 0 } },
};

const Step2: React.FC = () => {
  const location = useLocation() as LocationState;
  const { user,  } = useAppSelector(
    (state: RootState) => state.auth
  );


  const [useProfile, setUseProfile] = useState(false);

  const { nextStep, updateBooking } = useStepContext();
  const [createBooking] = useCreateBookingMutation();

  const handleUseProfile = async (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
 
 setUseProfile(checked)
    
  };

  // Initialize form with useFieldArray for passengers
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      passengers: Array.from({
        length:
          location.state.passengers.adults +
          location.state.passengers.children +
          location.state.passengers.infants,
      }).map(() => ({
        title: "",
        firstName: "",
        lastName: "",
        dob: undefined,
        gender: "",
        passportNumber: "",
       passportExpiry: undefined,
        nationality: "",
      })),
      email: "",
      countryCode: "+234",
      phone: "",
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "passengers",
  });

  console.log(location.state);
  

  const onSubmit = handleSubmit(async (formData) => {

    let flightIds;
    let upsellOffer;
    // Map trip type
    let tripType: BookingType = "ONE_WAY";
    if (location.state.tripType === "multi-city") {
            upsellOffer = location.state.multiCitySelections[0]?.upsell?.id || undefined;
      flightIds = [location.state.multiCitySelections[0].flight.id]
      tripType = "MULTI_CITY";
    } else if (location.state.tripType === "round-trip") {
      upsellOffer = location.state?.departureUpsell?.upsell?.id || undefined;
    
      
      flightIds = [
        location.state?.departureFlight.id,
        
      ];
      tripType = "ROUND_TRIP";
    } else {
 
      
            flightIds = [location.state?.departureFlight.id];
            upsellOffer =
              location.state?.departureUpsell?.upsell?.id || undefined;
    }

    // console.log("flightids", flightIds);
    
    // Build passengers array
    const passengers: Passenger[] = formData.passengers.map((p) => ({
      title: p.title.toUpperCase(),
      first_name: p.firstName,
      last_name: p.lastName,
      email: formData.email,
      date_of_birth: dayjs(p.dob).format("YYYY-MM-DD"),
      gender: p.gender.toUpperCase().startsWith("M") ? "M" : "F",
      passport_number: p.passportNumber,
      passport_expiry: dayjs(p.passportExpiry).format("YYYY-MM-DD"),
      nationality: p.nationality,
      phone: `${formData.countryCode}${formData.phone}`,
      address_line1: "123 Main St",
      city: "New York",
      country: p.nationality,
      postal_code: "10001",
    }));

    // Make API request
    try {
      const res = await createBooking({
        booking_type: tripType,
        flight_offer_ids: flightIds as string[],
        upsell_offer_id: upsellOffer,
        passengers,
        adults: location.state.passengers.adults,
        children: location.state.passengers.children,
        infants: location.state.passengers.infants,
      }).unwrap();
  
      if (res) {
        // @ts-ignore
    
        toast.success("success");

        // Build booking object
        const bookingData = {
          state:{...location.state},
          id: res.id,
          booking: res,
          // checkoutUrl: result.data.checkout_url,
          passengers,
          contact: {
            email: formData.email,
            phone: `${formData.countryCode}${formData.phone}`,
          },
        };

        // ✅ Save to localStorage
        localStorage.setItem("bookingData", JSON.stringify(bookingData));

        // continue with updateBooking
        // @ts-ignore
        updateBooking(bookingData);

        nextStep();
      } else {
        toast.error("Error Creating Booking")
      }
      // updateBookingId(res.id)

      // nextStep();
    } catch (err) {
   
      
      // toast.error(err?.response.data.error || "Error booking flight");
   
    }
  });

  // Group passengers by type
  const totalAdults = location.state.passengers.adults;
  const totalChildren = location.state.passengers.children;
  const totalInfants = location.state.passengers.infants;

  const adultPassengers = fields.slice(0, totalAdults);
  const childPassengers = fields.slice(
    totalAdults,
    totalAdults + totalChildren
  );
  const infantPassengers = fields.slice(totalAdults + totalChildren);
  

  
  useEffect(() => {

    if (useProfile) {
    setValue("email",user?.email as string)
    } else {
      setValue("email", "")
    }
  }, [user,useProfile]);
  // Render passenger form
  const renderPassengerForm = (passenger: any, index: number, type: string) => (
    <Paper
      key={passenger.id}
      sx={{ p: 2, border: "1px solid #CDCED1", borderRadius: 2, mb: 2 }}
      elevation={0}
    >
      <Typography fontWeight={600} variant="h6" mb={2}>
        {type} Passenger {index + 1}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        bgcolor="#CCD8E81A"
        border="1px solid #023E8A"
        borderRadius={2}
        p={1}
        mb={3}
      >
        <Icon
          icon="material-symbols:info-outline"
          className="size-[34px]"
          color="#023E8A"
        />
        <Typography fontSize={14} color="#4E4F52" ml={1}>
          Passenger names must match their government-issued ID.
        </Typography>
      </Box>

      {/* Title */}
      <Typography>Title</Typography>
      <Controller
        name={`passengers.${index}.title`}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            fullWidth
            displayEmpty
            MenuProps={menuProps}
            sx={fieldSx}
          >
            <MenuItem value="">Select Title</MenuItem>
            <MenuItem value="Mr">Mr</MenuItem>
            <MenuItem value="Mrs">Mrs</MenuItem>
            <MenuItem value="Ms">Ms</MenuItem>
          </Select>
        )}
      />
      <Typography color="error">
        {errors.passengers?.[index]?.title?.message}
      </Typography>

      {/* First & Last Name */}
      <Grid2 container spacing={2} mt={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Typography>First Name</Typography>
          <Controller
            name={`passengers.${index}.firstName`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Enter First Name"
                sx={fieldSx}
              />
            )}
          />
          <Typography color="error">
            {errors.passengers?.[index]?.firstName?.message}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Typography>Last Name</Typography>
          <Controller
            name={`passengers.${index}.lastName`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Enter Last Name"
                sx={fieldSx}
              />
            )}
          />
          <Typography color="error">
            {errors.passengers?.[index]?.lastName?.message}
          </Typography>
        </Grid2>
      </Grid2>

      {/* DOB */}
      <Typography mt={2}>Date of Birth</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={`passengers.${index}.dob`}
          control={control}
          render={({ field }) => (
            <DateSelector
              disableFuture
              id=""
              label=""
              range={false}
              value={field.value ? format(field.value, "dd MMM yyyy") : ""}
              onDateChange={(val) => {
                if (val instanceof Date) {
                  field.onChange(val); // <-- stores date
                } else if (val?.startDate && val?.endDate) {
                  field.onChange(val); // <-- store range object
                } else {
                  field.onChange(null);
                }
              }}
            />
          )}
        />
      </LocalizationProvider>
      <Typography color="error">
        {errors.passengers?.[index]?.dob?.message}
      </Typography>

      {/* Gender */}
      <Typography mt={2}>Gender</Typography>
      <Controller
        name={`passengers.${index}.gender`}
        control={control}
        render={({ field }) => (
          <RadioGroup row {...field}>
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
          </RadioGroup>
        )}
      />
      <Typography color="error">
        {errors.passengers?.[index]?.gender?.message}
      </Typography>

      {/* Passport */}
      <Grid2 container spacing={2} mt={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Typography>Passport Number</Typography>
          <Controller
            name={`passengers.${index}.passportNumber`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Enter Passport Number"
                sx={fieldSx}
              />
            )}
          />
          <Typography color="error">
            {errors.passengers?.[index]?.passportNumber?.message}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Typography>Passport Expiry Date</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name={`passengers.${index}.passportExpiry`}
              control={control}
              render={({ field }) => (
                <DateSelector
                  disablePast
                  label=""
                  value={field.value ? format(field.value, "dd MMM yyyy") : ""}
                  onDateChange={(val) => {
                    if (val instanceof Date) {
                      field.onChange(val); // <-- stores date
                    } else if (val?.startDate && val?.endDate) {
                      field.onChange(val); // <-- store range object
                    } else {
                      field.onChange(null);
                    }
                  }}
                  defaultDate={field.value}
                  range={false}
                  id="Passengers"
                />
              )}
            />
          </LocalizationProvider>
          <Typography color="error">
            {errors.passengers?.[index]?.passportExpiry?.message}
          </Typography>
        </Grid2>
      </Grid2>

      {/* Nationality */}
      <Typography mt={2}>Nationality</Typography>
      <Controller
        name={`passengers.${index}.nationality`}
        control={control}
        render={({ field }) => (
          <NationalitySelector
            value={field.value || ""}
            onChange={field.onChange}
          />
        )}
      />
      <Typography color="error">
        {errors.passengers?.[index]?.nationality?.message}
      </Typography>
    </Paper>
  );  useEffect(() => {}, [user]);

  return (
    <Box p={{ md: 4 }} component="form" onSubmit={onSubmit}>
      <Grid2 container spacing={4}>
        {/* Left Panel */}

        <Grid2 size={{ xs: 12, md: 7 }} gap={2}>
          <div className="flex justify-between mb-3 pl-3">
            <div>
              <p className="text-[16px] font-inter font-medium text-[#181818]">
                Use my Profile Information
              </p>
              <p className="text-[#4E4F52] font-normal text-[12px]">
                The fields will be automatically field based on your information
                with us
              </p>
            </div>

            <div>
              <FormControlLabel
                control={
                  <Switch
                    // checked={state.jason}
                    value={useProfile}
                    onChange={handleUseProfile}
                    name="jason"
                  />
                }
                label=""
              />
            </div>
          </div>
          <div className="space-y-4">
            {/* Adults Accordion */}
            {totalAdults > 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="adults-content"
                  id="adults-header"
                >
                  <Typography fontWeight={600} variant="h5">
                    Adult Passengers
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {adultPassengers.map((passenger, index) =>
                    renderPassengerForm(passenger, index, "Adult")
                  )}
                </AccordionDetails>
              </Accordion>
            )}

            {/* Children Accordion */}
            {totalChildren > 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="children-content"
                  id="children-header"
                >
                  <Typography fontWeight={600} variant="h5">
                    Child Passengers
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {childPassengers.map((passenger, index) =>
                    renderPassengerForm(passenger, totalAdults + index, "Child")
                  )}
                </AccordionDetails>
              </Accordion>
            )}

            {/* Infants Accordion */}
            {totalInfants > 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="infants-content"
                  id="infants-header"
                >
                  <Typography fontWeight={600} variant="h5">
                    Infant Passengers
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {infantPassengers.map((passenger, index) =>
                    renderPassengerForm(
                      passenger,
                      totalAdults + totalChildren + index,
                      "Infant"
                    )
                  )}
                </AccordionDetails>
              </Accordion>
            )}
          </div>
        </Grid2>

        {/* Right Panel */}
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Typography fontSize={18} fontWeight={500} mb={2}>
            Contact Details
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3 }}>
            {/* Email */}
            <Typography>Email Address</Typography>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="name@email.com"
                  type="email"
                  sx={fieldSx}
                />
              )}
            />
            <Typography color="error">{errors.email?.message}</Typography>

            {/* Phone */}
            <Grid2 container spacing={2} mt={2}>
              <Grid2 size={{ xs: 5 }}>
                <Typography>Country Code</Typography>
                <Controller
                  name="countryCode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      displayEmpty
                      MenuProps={menuProps}
                      sx={fieldSx}
                    >
                      <MenuItem value="+234">Nigeria +234</MenuItem>
                      <MenuItem value="+233">Ghana +233</MenuItem>
                      <MenuItem value="+1">USA +1</MenuItem>
                    </Select>
                  )}
                />
                <Typography color="error">
                  {errors.countryCode?.message}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 7 }}>
                <Typography>Phone Number</Typography>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter Phone Number"
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon
                              icon="ic:outline-phone"
                              width={24}
                              height={24}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Typography color="error">{errors.phone?.message}</Typography>
              </Grid2>
            </Grid2>
          </Paper>

          {/* Continue */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              bgcolor: "#003C96",
              py: 1.5,
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            {isSubmitting ? "Submitting..." : "Continue"}
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Step2;
