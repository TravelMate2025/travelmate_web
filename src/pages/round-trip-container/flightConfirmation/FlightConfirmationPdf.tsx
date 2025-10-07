import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import Logo from "../../../assets/Travelmate_logo.svg"

// ========= Styles =========
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#111",
  },
  header: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
   
    paddingVertical: 4,
    marginBottom: 6,
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
    color: "#007BFF",
  },
  text: {
    marginBottom: 3,
    lineHeight: 1.3,
  },
  bold: { fontWeight: "bold" },
  footer: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 10,
    color: "#444",
  },
});

// ========= Component =========
const FlightItineraryPDF = ({ bookingData }:{bookingData:any}) => {
    const booking = bookingData.booking;
    console.log(bookingData);
    
  const passenger = bookingData.passengers[0]?.passenger;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View  style={{justifyContent:"center", flexDirection:"row"}}>
          <Image source={{ uri: `localhost:5173/logo.svg` }} />
        </View>
        <Text style={[styles.text, styles.bold]}>
          Booking Reference: {bookingData.booking_reference}
        </Text>
        <Text style={styles.text}>Status: {booking.status}</Text>

        {/* Price / Booking Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Price Details</Text>
          <Text style={styles.text}>
            Base Flight Cost: {bookingData.currency}{" "}
            {bookingData.base_flight_cost}
          </Text>
          <Text style={styles.text}>
            Service Fee: {bookingData.currency} {bookingData.service_fee}
          </Text>
          <Text style={styles.text}>
            Total Amount: {bookingData.currency}{" "}
            {bookingData.booking.total_price}
          </Text>
          <Text style={styles.text}>Payment Status: {booking.status}</Text>
          <Text style={styles.text}>
            Booking Type:{" "}
            {bookingData?.booking?.booking_type?.replace("_", " ")}
          </Text>
        </View>

        {/* Passenger Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Passenger Details</Text>
          <Text style={styles.text}>
            Name: {passenger?.title} {passenger?.first_name}{" "}
            {passenger?.last_name}
          </Text>
          <Text style={styles.text}>
            Date of Birth:{" "}
            {dayjs(passenger?.date_of_birth).format("DD/MM/YYYY")}
          </Text>
          <Text style={styles.text}>
            Gender: {passenger?.gender === "M" ? "Male" : "Female"}
          </Text>
          <Text style={styles.text}>Email: {passenger?.email}</Text>
          <Text style={styles.text}>Phone: {passenger?.phone}</Text>
          <Text style={styles.text}>
            Passport Number: {passenger?.passport_number}
          </Text>
          <Text style={styles.text}>
            Passport Expiry:{" "}
            {dayjs(passenger?.passport_expiry).format("DD/MM/YYYY")}
          </Text>
          <Text style={styles.text}>Nationality: {passenger?.nationality}</Text>
        </View>

        {/* Flights */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Flight Itinerary</Text>
          {bookingData.booking.flights.map((f: any, idx: any) => (
            <View key={f.id} style={{ marginBottom: 6 }}>
              <Text style={[styles.bold, styles.text]}>
                Segment {idx + 1}: {f.airline_code} {f.flight_number}
              </Text>
              <Text style={styles.text}>
                {f.departure_airport} ➜ {f.arrival_airport}
              </Text>
              <Text style={styles.text}>
                Departure:{" "}
                {dayjs(f.departure_datetime).format("DD MMM YYYY, HH:mm")}
              </Text>
              <Text style={styles.text}>
                Arrival:{" "}
                {dayjs(f.arrival_datetime).format("DD MMM YYYY, HH:mm")}
              </Text>
              <Text style={styles.text}>Duration: {f.duration}</Text>
              <Text style={styles.text}>Cabin Class: {f.cabin_class}</Text>
              <Text style={styles.text}>Aircraft: {f.aircraft_code}</Text>
              <Text style={styles.text}>
                Checked Bags: {f.included_checked_bags}
              </Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Contact Details</Text>
          <Text style={styles.text}>Email: {passenger?.email}</Text>
          <Text style={styles.text}>Phone: {passenger?.phone}</Text>
        </View>

        {/* Important Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Important Information</Text>
          <Text style={styles.text}>Seat selection: Not allowed</Text>
          <Text style={styles.text}>Refund policy: Non-refundable</Text>
          <Text style={styles.text}>
            E-ticket will be sent to: {passenger?.email}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © {new Date().getFullYear()} TravelMate. All rights reserved.
        </Text>
      </Page>
    </Document>
  );
};

export default FlightItineraryPDF;
