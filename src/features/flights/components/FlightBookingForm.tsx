

import type React from "react"
import { useEffect, useCallback, useMemo } from "react"
import { FormControl, RadioGroup, FormControlLabel, Radio, Grid, IconButton } from "@mui/material"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import { useFlightBooking } from "../hooks/useFlightBooking"
import { LocationSelector } from "./LocationSelector"
import { DateSelector } from "./DateSelector"
import { PassengerSelector } from "./PassengerSelector"
import { ClassSelector } from "./ClassSelector"

export const FlightBookingForm: React.FC = () => {
  const {
    tripType,
    selectedFrom,
    selectedTo,
    selectedDate,
    selectedClass,
    passengerCounts,
    passengerText,
    dateRange,
    locations,
    flights,
    setTripType,
    setSelectedFrom,
    setSelectedTo,
    setSelectedDate,
    setSelectedClass,
    setPassengerCounts,
    setDateRange,
    fetchLocations,
    updateFlight,
    addFlight,
    removeFlight,
    handleSearch,
  } = useFlightBooking()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedFrom.trim()) {
        fetchLocations(selectedFrom)
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [selectedFrom, fetchLocations])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedTo.trim()) {
        fetchLocations(selectedTo)
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [selectedTo, fetchLocations])

  const handleRemoveLocation = useCallback((location: string) => {
    // This would typically update a locations cache/history
    console.log("Remove location:", location)
  }, [])

  const handleTripTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTripType(event.target.value)
    },
    [setTripType],
  )

  const tripTypeOptions = useMemo(
    () => [
      { value: "round-trip", label: "Round Trip" },
      { value: "one-way", label: "One Way" },
      { value: "multi-city", label: "Multi City" },
    ],
    [],
  )

  const isSimpleTrip = tripType === "round-trip" || tripType === "one-way"
  const isMultiCity = tripType === "multi-city"

  return (
    <FormControl sx={{ width: "100%" }}>
      {/* Trip Type Selection */}
      <RadioGroup
        row
        aria-labelledby="trip-type-label"
        name="trip-type"
        value={tripType}
        onChange={handleTripTypeChange}
        className="mb-8"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: { xs: "space-between", sm: "flex-start" },
        }}
      >
        {tripTypeOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: { xs: "14px", md: 16 },
              },
            }}
          />
        ))}
      </RadioGroup>

      {/* Simple Trip Form (Round Trip / One Way) */}
      {isSimpleTrip && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <LocationSelector
              id="from"
              label="From"
              value={selectedFrom}
              locations={locations}
              onChange={setSelectedFrom}
              onFetch={fetchLocations}
              onRemoveLocation={handleRemoveLocation}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <LocationSelector
              id="to"
              label="To"
              value={selectedTo}
              locations={locations}
              onChange={setSelectedTo}
              onFetch={fetchLocations}
              onRemoveLocation={handleRemoveLocation}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <DateSelector
              id="departure-date"
              label="Date"
              value={selectedDate}
              dateRange={dateRange}
              onChange={setSelectedDate}
              onDateRangeChange={setDateRange}
              showRange={tripType === "round-trip"}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <PassengerSelector
              id="passengers"
              label="Passengers"
              value={passengerText}
              counts={passengerCounts}
              onChange={setPassengerCounts}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <ClassSelector id="class" label="Class" value={selectedClass} onChange={setSelectedClass} />
          </Grid>

          <Grid item xs={12} md={2} display="flex" alignItems="flex-end">
            <button
              onClick={handleSearch}
              className="bg-[#023E8A] h-[52px] max-w-[140px] w-full text-center text-white font-inter text-base rounded-[8px] cursor-pointer hover:bg-[#012a5c] transition-colors"
            >
              Search
            </button>
          </Grid>
        </Grid>
      )}

      {/* Multi-City Form */}
      {isMultiCity && (
        <div>
          {/* Global Controls */}
          <Grid container spacing={2} sx={{ width: "100%", marginTop: "-10px" }}>
            <Grid item xs={12} sm={6}>
              <PassengerSelector
                id="passengers-multi"
                label="Passengers"
                value={passengerText}
                counts={passengerCounts}
                onChange={setPassengerCounts}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <ClassSelector id="class-multi" label="Class" value={selectedClass} onChange={setSelectedClass} />
            </Grid>
          </Grid>

          {/* Flight Segments */}
          {flights.map((flight, index) => (
            <div key={flight.id} className="mt-4">
              <label className="text-[#67696D] text-sm mb-2 block">Flight {index + 1}</label>

              <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
                <Grid item xs={12} md={4}>
                  <LocationSelector
                    id={`from-${flight.id}`}
                    label="From"
                    value={flight.from}
                    locations={locations}
                    onChange={(value) => updateFlight(flight.id, "from", value)}
                    onFetch={fetchLocations}
                    onRemoveLocation={handleRemoveLocation}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <LocationSelector
                    id={`to-${flight.id}`}
                    label="To"
                    value={flight.to}
                    locations={locations}
                    onChange={(value) => updateFlight(flight.id, "to", value)}
                    onFetch={fetchLocations}
                    onRemoveLocation={handleRemoveLocation}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DateSelector
                    id={`date-${flight.id}`}
                    label="Date"
                    value={flight.date}
                    dateRange={dateRange}
                    onChange={(value) => updateFlight(flight.id, "date", value)}
                    onDateRangeChange={setDateRange}
                    showRange={false}
                  />
                </Grid>

                {/* Remove Button */}
                {index > 1 && (
                  <Grid item xs={12}>
                    <IconButton
                      onClick={() => removeFlight(flight.id)}
                      sx={{
                        color: "#023E8A",
                        gap: "4px",
                        marginTop: "8px",
                        fontSize: "14px",
                      }}
                    >
                      <CloseOutlinedIcon />
                      <span>Remove</span>
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </div>
          ))}

          {/* Add Flight + Search */}
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
            <Grid item>
              <button
                className="flex items-center text-[#023E8A] cursor-pointer hover:text-[#012a5c] transition-colors"
                onClick={addFlight}
              >
                <AddOutlinedIcon />
                <span>Add Flight</span>
              </button>
            </Grid>
            <Grid item>
              <button
                onClick={handleSearch}
                className="bg-[#023E8A] h-[45px] w-[130px] text-center text-white font-inter text-base rounded-[8px] cursor-pointer hover:bg-[#012a5c] transition-colors"
              >
                Search
              </button>
            </Grid>
          </Grid>
        </div>
      )}
    </FormControl>
  )
}
