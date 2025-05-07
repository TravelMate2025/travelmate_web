import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import { useDispatch } from "react-redux";
import { logoutUser } from "../../api/auth";
import { logout as navlogout } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";


const navItems = [
  { name: "Home", path: "/" },
  { name: "Stays", path: "/stays-search-result" },
  { name: "Flights", path: "/flights" },
  { name: "Airport Taxi", path: "/airport-taxi" }
];

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const menuItems = [
  { text: "Account", icon: <PersonOutlinedIcon />, path: "/account" },
  { text: "Bookings", icon: <ClassOutlinedIcon />, path: "/bookings" },
  { text: "Favorites", icon: <FavoriteBorderOutlinedIcon />, path: "/favorites" },
  { text: "Notifications", icon: <NotificationsNoneOutlinedIcon />, path: "/notifications" },
];


const logout = [
  { text: "Log out", icon: <LoginOutlinedIcon /> }
];

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const initials = user?.name?.charAt(0).toUpperCase() || "U";
  const isLoggedIn = Boolean(accessToken && user && user.email);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    if (!accessToken) {
      toast.error("User session expired. Login again to continue.");
      return;
    }

    setLogoutLoading(true);
    try {
      await logoutUser(accessToken);
      dispatch(navlogout());
      localStorage.clear();
      navigate("/create-account");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  const toggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavItemClick = (path: string) => {
    setOpenDrawer(false);
    navigate(path);
  };

  const handleTabClick = (page: string) => {
    setActiveTab(page);
  };

  return (
    <div>
      {logoutLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
          <div className="w-16 h-16 flex items-center justify-center bg-[#CCD8E8] rounded-full bg-opacity-50 z-50">
            <Spinner />
          </div>
        </div>
      )}


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

                <div>
                  {/* Animated Drawer Menu */}
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: openDrawer ? 0 : "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Drawer
                      anchor="right"
                      open={openDrawer}
                      onClose={toggleDrawer}
                      sx={{
                        "& .MuiDrawer-paper": {
                          width: "90%",
                          margin: "0 auto",
                          height: "70%",
                          marginTop: "16%",
                          borderRadius: "12px",
                          boxShadow: "0px 4px 10px rgba(102, 71, 71, 0.1)",
                          backgroundColor: "#FFF",
                          overflowY: "auto",
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
                          {isLoggedIn ? (
                            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "20px" }}>
                              <Avatar sx={{ bgcolor: "#023E8A" }}>
                                {user?.profileImage ? (
                                  <Avatar alt={user.name} src={user.profileImage} />
                                ) : (
                                  <Avatar sx={{ bgcolor: "#023E8A" }}>{initials}</Avatar>
                                )}
                              </Avatar>
                              <Box sx={{ ml: 2 }}>
                                <Typography sx={{ fontWeight: "bold", color: "#181818", fontSize: "14px" }}>
                                  {user?.name || "User"}
                                </Typography>
                                <Typography sx={{ fontWeight: "bold", color: "#67696D", fontSize: "14px" }}>
                                  {user?.email || ""}
                                </Typography>
                              </Box>
                            </div>
                          ) : (
                            <div className="md:flex">
                              <Link
                                to="/create-account"
                                className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#012A5D] transition"
                                onClick={toggleDrawer}
                              >
                                Create an Account or Log In
                              </Link>
                            </div>
                          )}
                        </Box>

                        <Divider />
                        <List>
                          {navItems.map((item) => (
                            <ListItem 
                              key={item.name}
                              onClick={() => handleNavItemClick(item.path)}
                              sx={{ cursor: "pointer" }}
                            >
                              <ListItemText primary={item.name} />
                            </ListItem>
                          ))}
                        </List>

                        <Divider sx={{ marginBottom: "20px" }} />

                        {menuItems.map(({ text, icon, path }) => (
                          <ListItem 
                            key={text}
                            onClick={() => handleNavItemClick(path)}
                            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon sx={{ minWidth: "40px" }}>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                          </ListItem>
                        ))}


                        {logout.map(({text, icon}) => (
                          <ListItem 
                            key={text}
                            onClick={() => {
                              toggleDrawer();
                              handleLogout();
                            }}
                            sx={{ cursor: "pointer", display: "flex", alignItems: "center", marginTop: "26px" }}
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
        // Desktop View
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
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    onClick={() => {
                      handleCloseUserMenu();
                      handleTabClick(item.name);
                    }}
                    sx={{ 
                      my: 2, 
                      mr: 2, 
                      color: activeTab === item.name ? "#023E8A" : "#000000",  
                      display: "block", 
                      textTransform: "capitalize",
                      backgroundColor: "transparent",
                      "&:hover": { backgroundColor: "transparent" },
                      "&:focus": { backgroundColor: "transparent" },
                      "&:active": { backgroundColor: "transparent" },
                    }}
                    className="font-bold font-inter text-xl"
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </Box>

            {/* User Account / Notifications */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {!isLoggedIn ? (
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
                      {user?.profileImage ? (
                        <Avatar alt={user.name} src={user.profileImage} />
                      ) : (
                        <Avatar sx={{ bgcolor: "#023E8A" }}>{initials}</Avatar>
                      )}
                      <Box sx={{ ml: 2 }}>
                        <Typography sx={{ fontWeight: "bold", color: "#181818", fontSize: "14px" }}>
                          {user?.name || "User"}
                        </Typography>
                        <Typography sx={{ fontWeight: "bold", color: "#67696D", fontSize: "14px" }}>
                          {user?.email || ""}
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
                  <MenuItem 
                    key={setting} 
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting === "Logout") {
                        handleLogout();
                      } else if (setting === "Profile") {
                        navigate("/profile-info");
                      } else {
                        navigate(`/${setting.toLowerCase()}`);
                      }
                    }}
                  >
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