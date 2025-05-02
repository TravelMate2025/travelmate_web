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
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

// Define types for the pages and settings
type Page = "Home" | "Stays" | "Flights" | "Airport Taxi";
type Setting = "Profile" | "Account" | "Dashboard" | "Logout";
type MenuItem = {
  text: string;
  icon: React.ReactNode;
};

// URL to page mapping
const urlToPageMap: Record<string, Page> = {
  "/": "Home",
  "/stays": "Stays",
  "/flights": "Flights",
  "/airport-taxi": "Airport Taxi",
};

const Navbar: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [fromLogin, setFromLogin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<Page>("Home");
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const pages: Page[] = ["Home", "Stays", "Flights", "Airport Taxi"];
  const settings: Setting[] = ["Profile", "Account", "Dashboard", "Logout"];

  // Set active tab based on current URL
  useEffect(() => {
    const pathname = location.pathname;
    const currentPage = urlToPageMap[pathname] || "Home"; // Default to "Home" if no match
    setActiveTab(currentPage);
  }, [location.pathname]); // Re-run when URL changes

  useEffect(() => {
    const previousPage = document.referrer;
    if (previousPage.includes("/login")) {
      setFromLogin(true);
    }
  }, []);

  const toggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleTabClick = (page: Page) => {
    setActiveTab(page);
  };

  const menuItems: MenuItem[] = [
    { text: "Account", icon: <PersonOutlinedIcon /> },
    { text: "Bookings", icon: <ClassOutlinedIcon /> },
    { text: "Favorites", icon: <FavoriteBorderOutlinedIcon /> },
    { text: "Notifications", icon: <NotificationsNoneOutlinedIcon /> },
  ];

  const logout: MenuItem[] = [{ text: "Log out", icon: <LoginOutlinedIcon /> }];

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
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
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
                          margin: "0 auto",
                          height: "70%",
                          marginTop: "16%",
                          borderRadius: "12px",
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          backgroundColor: "#FFF",
                          overflow: "hidden",
                          position: "absolute",
                          left: "0px",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          backgroundColor: "#FFF",
                          height: "100vh",
                        }}
                        role="presentation"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
                          {!fromLogin ? (
                            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "20px" }}>
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
                            <div className="md:flex">
                              <Link
                                to="/create-account"
                                className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#012A5D] transition"
                              >
                                Create an Account or Login
                              </Link>
                            </div>
                          )}
                        </Box>

                        <Divider />
                        <List>
                          {pages.map((page) => (
                            <ListItem
                              key={page}
                              component={Link}
                              to={page === "Home" ? "/" : page === "Airport Taxi" ? "/airport-taxi" : `/${page.toLowerCase()}`}
                              onClick={() => {
                                toggleDrawer();
                                handleTabClick(page);
                              }}
                              sx={{
                                cursor: "pointer",
                                backgroundColor: activeTab === page ? "#CCD8E81A" : "transparent", // Highlight active page
                                color: activeTab === page ? "#023E8A" : "#000000", // Change text color for active page
                              }}
                            >
                              <ListItemText primary={page} />
                            </ListItem>
                          ))}
                        </List>

                        <Divider sx={{ marginBottom: "20px" }} />

                        {menuItems.map(({ text, icon }) => (
                          <ListItem
                            key={text}
                            component="button"
                            onClick={toggleDrawer}
                            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon sx={{ minWidth: "40px" }}>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                          </ListItem>
                        ))}

                        {logout.map(({ text, icon }) => (
                          <ListItem
                            key={text}
                            component="button"
                            onClick={toggleDrawer}
                            sx={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              marginTop: "26px",
                            }}
                            aria-label="log out"
                          >
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
        // Web view
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
              alignItems: "center",
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
                  to={page === "Home" ? "/" : page === "Airport Taxi" ? "/airport-taxi" : `/${page.toLowerCase()}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    onClick={() => {
                      handleCloseUserMenu();
                      handleTabClick(page);
                    }}
                    sx={{
                      my: 2,
                      mr: 2,
                      color: activeTab === page ? "#023E8A" : "#000000",
                      display: "block",
                      textTransform: "capitalize",
                      fontWeight: activeTab === page ? 'bold' : '',
                      backgroundColor: "transparent",
                      "&:hover": { backgroundColor: "transparent" },
                      "&:focus": { backgroundColor: "transparent" },
                      "&:active": { backgroundColor: "transparent" },
                    }}
                    className="font-black font-inter text-xl"
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>

            {/* User Account / Notifications */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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