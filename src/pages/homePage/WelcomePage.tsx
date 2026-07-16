import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import plane from "../../assets/plane.svg";
import car from "../../assets/car.svg";
import stay from "../../assets/stay.svg";
import RoundTrip from "./Flight";
import Page from "../../features/car_rentals/carsFirstScreen/CarBookingFirstScreen";
import PartnerStaySearchPage from "../../features/stays/pages/PartnerStaySearchPage";
import { useMediaQuery } from "react-responsive";
import HomeHero from "./HomeHero";

interface WelcomePageProps {
  // Lifted to Home.tsx so the content sections rendered below this
  // component (see TransfersHomeContent vs the stays carousels) can react
  // to which vertical is active -- previously this state was fully local
  // to WelcomePage, so Home.tsx had no way to know the Transfers tab was
  // selected and kept rendering stays content underneath it regardless.
  value: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

const WelcomePage = ({ value, onChange }: WelcomePageProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div>
      <HomeHero />
      {isMobile ? (
        <div className="w-[100%] m-auto px-[16px]">
          <div id="transfers-search" className="-mt-[50px] relative bg-white shadow-[0_16px_32px_-16px_rgba(2,62,138,0.4)] h-[100%] rounded-[12px]">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    borderBottom: "1px solid #CDCED1",
                    width: "100%",
                    margin: "auto",
                  }}
                >
                  <TabList
                    onChange={onChange}
                    aria-label="lab API tabs example"
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      "& .MuiTab-root": {
                        color: "black",
                        fontWeight: "semi-bold",
                        textTransform: "capitalize",
                        minWidth: "100px",
                        flex: "1 1 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#FF6F1E",
                      },
                    }}
                  >
                    <Tab
                      icon={
                        <img
                          src={stay}
                          alt="stay"
                          style={{ width: 20, height: 20 }}
                        />
                      }
                      iconPosition="start"
                      label="Stays"
                      value="1"
                    />
                    <Tab
                      icon={
                        <img
                          src={plane}
                          alt="plane"
                          style={{ width: 20, height: 20 }}
                        />
                      }
                      iconPosition="start"
                      label="Flights"
                      value="2"
                    />
                    <Tab
                      icon={
                        <img
                          src={car}
                          alt="car"
                          style={{ width: 20, height: 20 }}
                        />
                      }
                      iconPosition="start"
                      label="Transfers"
                      value="3"
                    />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <PartnerStaySearchPage />
                </TabPanel>
                <TabPanel value="2">
                  <RoundTrip />
                </TabPanel>
                <TabPanel value="3">
                  <Page />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      ) : (
        // web view
        <div className="w-[90%] max-w-[1280px] m-auto">
          <div id="transfers-search" className="-mt-[76px] relative border border-[#E4E7EB] shadow-[0_20px_45px_-18px_rgba(2,62,138,0.35)] bg-white h-[100%] rounded-[10px]">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    borderBottom: "1px solid #CDCED1",
                  }}
                >
                  <TabList
                    onChange={onChange}
                    aria-label="lab API tabs example"
                    sx={{
                      "& .MuiTab-root": {
                        color: "black",
                        fontWeight: "semi-bold",
                        textTransform: "capitalize",
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#FF6F1E",
                      },
                    }}
                  >
                    <Tab
                      icon={
                        <img
                          src={stay}
                          alt="stay"
                          style={{ width: 20, height: 20 }}
                        />
                      }
                      iconPosition="start"
                      label="Stays"
                      value="1"
                    />
                    <Tab
                      icon={
                        <img
                          src={plane}
                          alt="flights"
                          style={{ width: 20, height: 20 }}
                        />
                      }
                      iconPosition="start"
                      label="Flights"
                      value="2"
                    />
                    <Tab
                      icon={
                        <img
                          src={car}
                          alt="car"
                          style={{ width: 20, height: 20 }}
                        />
                      }
                      iconPosition="start"
                      label="Transfers"
                      value="3"
                    />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <PartnerStaySearchPage />
                </TabPanel>
                <TabPanel value="2">
                  <RoundTrip />
                </TabPanel>
                <TabPanel value="3">
                  <Page />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
