import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import plane from "../../assets/plane.svg";
import car from "../../assets/car.svg";
import stay from "../../assets/stay.svg";
import RoundTrip from "./RoundTrip";
import SearchFilter from '../../components/SearchFilter';



const WelcomePage = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleSearchSubmit = (destination: string, roomGuest: string, date: string) => {
        console.log("Search Submitted:", { destination, roomGuest, date });
        // Implement search logic here
    };

    return (
        <div>
            <div className='w-[90%] m-auto  '>
                <div className='mt-[100px] border border-[#CDCED1] h-[100%] rounded-[12px]'>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid #CDCED1' }}>
                                <TabList 
                                    onChange={handleChange} 
                                    aria-label="lab API tabs example" 
                                    sx={{
                                        '& .MuiTab-root': { 
                                            color: 'black',
                                            fontWeight: 'semi-bold',
                                            textTransform: 'capitalize',
                                            // display: 'flex',
                                            // alignItems: 'center',
                                            // gap: 1
                                        },
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: '#FF6F1E'
                                            
                                        }
                                    }}
                                >
                                        <Tab 
                                        icon={<img src={stay} alt="plane" style={{ width: 20, height: 20 }} />} 
                                        iconPosition="start"
                                        label="Stays" 
                                        value="1" 
                                    />
                                    <Tab 
                                        icon={<img src={plane} alt="stay" style={{ width: 20, height: 20 }} />} 
                                        iconPosition="start"
                                        label="Flights" 
                                        value="2" 
                                    />
                                    <Tab 
                                        icon={<img src={car} alt="car" style={{ width: 20, height: 20 }} />} 
                                        iconPosition="start"
                                        label="Cars" 
                                        value="3" 
                                    />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <SearchFilter onSubmit={handleSearchSubmit} />
                            </TabPanel>
                            <TabPanel value="2"><RoundTrip /></TabPanel>
                            <TabPanel value="3">Cars</TabPanel>
                        </TabContext>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
