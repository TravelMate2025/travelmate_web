import { Box, Button, Typography, Stack } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import { Link } from "react-router-dom";
import {  useCreateCheckoutSessionMutation } from "../api/flightApi";

export default function PaymentFailed() {

  const data = localStorage.getItem("bookingData") ? JSON.parse(localStorage.getItem("bookingData") || '{}') : null;
  console.log(data);
 const [createSession, {isLoading} ] = useCreateCheckoutSessionMutation();
  const handleRetry = async() => {
    try {

 
      const result = await createSession({ id: data.booking.id });

      if (result.data) {
         window.location.href = result.data.checkout_url;
      }
      
    } catch (error) {
      console.log(error);
      
    }
   
  }
  
  return (

    <div>
   <div>
        <Navbar />
      </div>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#fafafa"
      px={2}
    >
      {/* Red error icon */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "#FEE2E2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <ErrorOutlineRoundedIcon sx={{ fontSize: 48, color: "#DC2626" }} />
      </Box>

      {/* Heading */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Payment Failed!
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        maxWidth={785}
        mb={1.5}
      >
        Unfortunately, we couldn’t process your payment. This could be due to
        insufficient funds, incorrect card details, or your bank declining the
        transaction.
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        maxWidth={785}
        mb={4}
      >
        Your booking has not been confirmed. Please try again to complete your
        payment.
      </Typography>

      {/* Buttons */}
      <Stack spacing={2} width="100%" maxWidth={785}>
        <Button
            variant="contained"
            onClick={handleRetry}
            disabled={isLoading}
          sx={{
            bgcolor: "#003087",
            "&:hover": { bgcolor: "#00246b" },
            borderRadius: 2,
            textTransform: "none",
            py: 1.2,
          }}
        >
          Try Again
        </Button>
        <Button
            variant="outlined"
            component={Link}
            to="/"
          sx={{
            borderColor: "#003087",
            color: "#003087",
            borderRadius: 2,
            textTransform: "none",
            py: 1.2,
          }}
        >
          Back to home
        </Button>
      </Stack>
      </Box>
      
         <div>
              <Footer />
            </div>
    </div>
  );
}
