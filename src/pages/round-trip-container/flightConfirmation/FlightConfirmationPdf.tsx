
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  // Font,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { LocalState } from "./FlightConfirmationPage";
import Logo from "../../../assets/logo.png"

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
const FlightItineraryPDF = ({ bookingData }:{bookingData:LocalState}) => {

    const booking = bookingData.booking;
 
    
  const passenger = bookingData.passengers[0];


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          <Image src={Logo} style={{ width: 100, height: 80,  }} />
        </View>
        <Text style={[styles.text, styles.bold]}>
          Booking Reference: {bookingData.booking.amadeus_reference}
        </Text>
        <Text style={styles.text}>Status: {booking.booking.total_price}</Text>

        {/* Price / Booking Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Price Details</Text>
          <Text style={styles.text}>
            Base Flight Cost: {bookingData.booking.currency}{" "}
            {bookingData.booking.base_flight_cost}
          </Text>
          <Text style={styles.text}>
            Service Fee: {bookingData.booking.currency}{" "}
            {bookingData.booking.service_fee}
          </Text>
          <Text style={styles.text}>
            Total Amount: {bookingData.booking.currency}{" "}
            {bookingData.booking.total_price}
          </Text>
          <Text style={styles.text}>
            Payment Status: {booking.booking.status}
          </Text>
          <Text style={styles.text}>
            Booking Type:{" "}
            {bookingData?.booking?.booking_type?.replace("_", " ")}
          </Text>
        </View>

        {/* Passenger Info */}

        {bookingData.booking.passenger_bookings.map((p, i) => {
          return (
            <View style={styles.section} key={i}>
              <Text style={styles.sectionHeader}>Passenger Details</Text>
              <Text style={styles.text}>
                Name: {p.passenger?.title} {p.passenger?.first_name}{" "}
                {p.passenger?.last_name}
              </Text>
              <Text style={styles.text}>
                Date of Birth:{" "}
                {dayjs(p.passenger?.date_of_birth).format("DD/MM/YYYY")}
              </Text>
              <Text style={styles.text}>
                Gender: {p.passenger?.gender === "M" ? "Male" : "Female"}
              </Text>
              <Text style={styles.text}>Email: {p.passenger?.email}</Text>
              <Text style={styles.text}>Phone: {p.passenger?.phone}</Text>
              <Text style={styles.text}>
                Passport Number: {p.passenger?.passport_number}
              </Text>
              <Text style={styles.text}>
                Passport Expiry:{" "}
                {dayjs(p.passenger?.passport_expiry).format("DD/MM/YYYY")}
              </Text>
              <Text style={styles.text}>
                Nationality: {p.passenger?.nationality}
              </Text>
            </View>
          );
        })}

        {/* Flights */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Flight Itinerary</Text>
          {bookingData.booking.flights.map((f: any, idx: any) => (
            <View key={f.id} style={{ marginBottom: 6 }}>
              <Text style={[styles.bold, styles.text]}>
                Segment {idx + 1}: {f.airline_code} {f.flight_number}
              </Text>
              <Text style={styles.text}>
                {f.departure_airport} to {f.arrival_airport}
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
          <Text style={styles.text}>Email: {bookingData.contact?.email}</Text>
          <Text style={styles.text}>Phone: {bookingData.contact?.phone}</Text>
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
      </Page>
    </Document>
  );
};

export default FlightItineraryPDF;
