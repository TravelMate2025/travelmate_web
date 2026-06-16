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
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const [value, setValue] = React.useState<string>(() => {
    return localStorage.getItem("selectedTab") || "1";
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    localStorage.setItem("selectedTab", newValue);
  };

  return (
    <div>
      {isMobile ? (
        <div className="w-[100%] m-auto">
          <div className="mt-[100px] border-none h-[100%] rounded-[4px]">
            <div className="mx-4 sm:mx-10 my-5 rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    New partner-aligned transfer flow
                  </h2>
                  <p className="mt-2 text-sm text-gray-700">
                    Search → detail → pricing → review
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    The current airport taxi UI stays available as fallback until the new flow is fully verified.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-md bg-[#023E8A] px-4 py-2 text-sm font-medium text-white"
                  onClick={() => navigate("/transfer-flow")}
                >
                  Open new transfer flow
                </button>
              </div>
            </div>
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
            <div className="mx-10 my-5 rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    New partner-aligned transfer flow
                  </h2>
                  <p className="mt-2 text-sm text-gray-700">
                    Search → detail → pricing → review
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    The current airport taxi UI stays available as fallback until the new flow is fully verified.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-md bg-[#023E8A] px-4 py-2 text-sm font-medium text-white"
                  onClick={() => navigate("/transfer-flow")}
                >
                  Open new transfer flow
                </button>
              </div>
            </div>
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
                          alt="plane"
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
                          alt="stay"
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
