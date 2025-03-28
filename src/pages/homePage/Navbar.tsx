


import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Travelmate from "../../assets/Travelmate_logo.svg";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';


const pages = ["Home", "Stays", "Flights", "Cars"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Navbar = () => {
   const [openDrawer, setOpenDrawer] = useState(false);

const toggleDrawer = () => {
    setOpenDrawer((prev) => !prev); 
  };

  const isMobile = useMediaQuery({ maxWidth: 768 });
  // const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fromLogin, setFromLogin] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem("authToken");
    // setIsAuthenticated(!!token);

    const previousPage = document.referrer;
    if (previousPage.includes("/login")) {
      setFromLogin(true);
    }
  }, []);
  // const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  // const handleCloseNavMenu = () => {
  //   setAnchorElNav(null);
  // };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [activeTab, setActiveTab] = useState("Home");
  const handleTabClick = (page: string) => {
    setActiveTab(page);
  };


  const menuItems = [
  { text: "Account", icon: <PersonOutlinedIcon /> },
  { text: "Bookings", icon: <ClassOutlinedIcon /> },
  { text: "Favorites", icon: <FavoriteBorderOutlinedIcon /> },
  { text: "Notifications", icon: <NotificationsNoneOutlinedIcon /> },
];

const logout =[
  {
    text: "Log out", icon: <LoginOutlinedIcon />
  }
]
  return (
    <div>
      {isMobile ? (
      <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#FFFFFF",
        borderBottom: "none",
        boxShadow: "none",
        height: "80px",
        color: "#000000",
        marginTop: "-10px",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            width: "100%",
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ mr: 2 }}>
              <img src={Travelmate} alt="Logo" style={{ maxWidth: "100px" }} />
            </Typography>
          </Box>

          {/* Mobile Menu Button */}
          <div className="flex">
            <div>
              <div className="mt-1 border-1 border-[#023E8A] p-[8px] text-[#023E8A] rounded-[8px]">
                <p>Open App</p>
              </div>
            </div>

            {/* Hamburger Icon */}
            <IconButton size="large" aria-label="menu" onClick={toggleDrawer} sx={{ color: "black" }}>
              <MenuIcon />
            </IconButton>

          <div className="">
            {/* Animated Drawer Menu */}
              <motion.div
                initial={{ x: "100%" }} // Start off-screen (right side)
                animate={{ x: 0 }} // Slide in
                exit={{ x: "100%" }} // Slide out when closing
                transition={{ duration: 2, ease: "easeInOut" }}
              >
            <Drawer
              anchor="right"
              open={openDrawer}
              onClose={toggleDrawer}
              hideBackdrop
              sx={{
                "& .MuiDrawer-paper": {
                  width: "90%",
                  margin:"0 auto",
                  height: "70%",
                  marginTop: "16%",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#FFF",
                  overflow: "hidden",
                  position:"absolute",
                  left:"0px",
                 

                },
              }}
            >
              {/* Motion Div for Animation */}
            
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: "#FFF",
                    height: "100vh",
                    
                  }}
                  role="presentation"
                  onClick={(e) => e.stopPropagation()}
                >
                <Box sx={{ display: "flex", justifyContent:"space-between", padding: "20px" }}>
                  {!fromLogin ? (

                 
              <div  style={{ display: "flex", justifyContent:"flex-start", marginTop:"20px" }}>
                <Avatar sx={{ bgcolor: "#023E8A" }}>E</Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography sx={{ fontWeight: "bold", color: "#181818", fontSize: "14px" }}>
                    Elvis
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", color: "#67696D", fontSize: "14px" }}>
                    Elvis@gmail.com
                  </Typography>
                </Box>
              </div>


    
        ) : (
          <>
            {/* <Tooltip title="Notifications">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: 3 }}>
                <div className="bg-[#CCD8E81A] w-[40px] h-[40px] rounded-full border border-[#023E8A] text-center">
                  <NotificationsNoneOutlinedIcon />
                </div>
              </IconButton>
            </Tooltip> */}

              <div className=" md:flex">
            <Link
              to="/create-account"
              className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#012A5D] transition"
            >
              Create an Account or Login
            </Link>

            
          </div>

          </>
        )}

        {/* User Menu */}
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
            </MenuItem>
          ))}
        </Menu>
                </Box>

                <Divider />
                  <List >
                    {["Home", "Stays", "Flights", "Cars"].map((page) => (
                      <ListItem key={page} component="button" onClick={toggleDrawer} sx={{ cursor: "pointer" }}>
                        <ListItemText primary={page} />
                      </ListItem>
                    ))}
                  </List>

                    <Divider sx={{marginBottom:"20px"}} />

                  {menuItems.map(({ text, icon }) => (
                    <ListItem key={text} component="button" onClick={toggleDrawer} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <ListItemIcon sx={{ minWidth: "40px" }}>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
               

                  {logout.map(({text, icon}) =>(
                      <ListItem key={text} component="button" onClick={toggleDrawer} sx={{ cursor: "pointer", display: "flex", alignItems: "center" , marginTop:"26px"}}>
                      <ListItemIcon sx={{ minWidth: "40px" }}>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </Box>
             
            </Drawer>
             </motion.div>

          </div>
          </div>
        </Toolbar>
      </Container>
    </AppBar>

       ) : (

        // web view

       <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#FFFFFF",
          borderBottom: "0.5px solid #DEDFE1",
          boxShadow: "0px 2px 2px #0000000F",
          height: "80px",
          color: "#000000",
        }}
      >
 
    <Toolbar 
      disableGutters 
      sx={{ 
        width: "90%", 
        margin: "auto", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center"
      }}
    >
      {/* Logo */}
      <Typography>
        <img src={Travelmate} alt="Logo" />
      </Typography>

      {/* Navigation Links */}
      <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}>
        {pages.map((page) => (
          <Link 
            key={page} 
            to={page === "Home" ? "/" : `/${page.toLowerCase()}`} 
            style={{ textDecoration: "none" }}
          >
            <Button
              onClick={() => {
                handleCloseUserMenu();
                handleTabClick(page);
              }}
              sx={{ 
                my: 2, mr: 2, 
                color: activeTab === page ? "#023E8A" : "#000000",  
                display: "block", 
                textTransform: "capitalize",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
                "&:focus": { backgroundColor: "transparent" },
                "&:active": { backgroundColor: "transparent" },
              }}
              className="font-bold font-inter text-xl"
            >
              {page}
            </Button>
          </Link>
        ))}
      </Box>

      {/* User Account / Notifications */}
      <Box sx={{ display: "flex", justifyContent:"space-between" }}>
        {!fromLogin ? (
          <div className="hidden md:flex">
            <Link
              to="/create-account"
              className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#012A5D] transition"
            >
              Create an Account or Login
            </Link>
          </div>
        ) : (
          <>
            <Tooltip title="Notifications">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: 3 }}>
                <div className="bg-[#CCD8E81A] w-[40px] h-[40px] rounded-full border border-[#023E8A] text-center">
                  <NotificationsNoneOutlinedIcon />
                </div>
              </IconButton>
            </Tooltip>

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#023E8A" }}>E</Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography sx={{ fontWeight: "bold", color: "#181818", fontSize: "14px" }}>
                    Elvis
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", color: "#67696D", fontSize: "14px" }}>
                    Elvis@gmail.com
                  </Typography>
                </Box>
              </IconButton>
            </Tooltip>
          </>
        )}

        {/* User Menu */}
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Toolbar>
    
      </AppBar>

     )}
    </div>
  );
};

export default Navbar;
