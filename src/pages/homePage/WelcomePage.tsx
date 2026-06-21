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
import PartnerFlowPreview from "../../features/shared/booking/PartnerFlowPreview";
import PartnerStaySearchPage from "../../features/stays/pages/PartnerStaySearchPage";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";

const tabFromSearch = (search: string): string | null => {
  const params = new URLSearchParams(search);
  const tab = params.get("tab");
  if (tab === "transfers") return "3";
  if (tab === "flights") return "2";
  if (tab === "stays") return "1";
  return null;
};

const WelcomePage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();
  const [value, setValue] = React.useState<string>(() => {
    return tabFromSearch(location.search) ?? localStorage.getItem("selectedTab") ?? "1";
  });

  React.useEffect(() => {
    const tab = tabFromSearch(location.search);
    if (tab) setValue(tab);
  }, [location.search]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    localStorage.setItem("selectedTab", newValue);
  };

  return (
    <div>
      {isMobile ? (
        <div className="w-[100%] m-auto">
          <div className="mt-[100px] border-none h-[100%] rounded-[4px]">
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
                    onChange={handleChange}
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
                  <PartnerFlowPreview />
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
        <div className="w-[90%] m-auto">
          <div className="mt-[100px] border border-[#CDCED1] h-[100%] rounded-[4px]">
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
                    onChange={handleChange}
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
