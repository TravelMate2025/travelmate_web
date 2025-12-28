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
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logoutUser } from "../../features/account/api/auth";
import { logout as navlogout } from "../../features/account/slices/authSlice";
import toast from "react-hot-toast";
import Spinner from "../../features/account/components/Spinner";
import { FaBell } from "react-icons/fa";
import Travelmate from "../../assets/Travelmate_logo.svg";
import { useNotifications } from "../../features/account/components/notifications/NotificationProvider";

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
  { text: "Notifications", icon: <FaBell />, path: "/notifications" },
];

const logout = [{ text: "Log out", icon: <LoginOutlinedIcon /> }];

const Navbar: React.FC = () => {
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

  // NEW: Notifications
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const hasNewNotification = unreadCount > 0;
  const latestNotification = notifications[0];

  const handleNotificationClick = () => {
    if (latestNotification) markAsRead(latestNotification.id);
    navigate("/notification");
  };

  const handleLogout = async () => {
    if (!accessToken) {
      toast.error("User session expired. Login again to continue.");
      return;
    }
    setLogoutLoading(true);
    try {
      await logoutUser(accessToken);
      localStorage.clear();
      localStorage.setItem("logout_reason", "account_deleted");
      dispatch(navlogout());
      navigate("/create-account");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  const toggleDrawer = () => setOpenDrawer(prev => !prev);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleNavItemClick = (path: string) => {
    setOpenDrawer(false);
    navigate(path);
  };
  const handleTabClick = (page: string) => setActiveTab(page);

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
            <Toolbar disableGutters sx={{ width: "100%", margin: "auto", display: "flex", justifyContent: "space-between", marginTop: "10px", alignItems: "center" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ mr: 2 }}>
                  <img src={Travelmate} alt="Logo" style={{ maxWidth: "100px" }} />
                </Typography>
              </Box>

              <div className="flex">
                <div>
                  <div className="mt-1 border-1 border-[#023E8A] p-[8px] text-[#023E8A] rounded-[8px]">
                    <p>Open App</p>
                  </div>
                </div>

                {isLoggedIn && (
                  <div className="relative ml-4">
                    <IconButton onClick={handleNotificationClick} sx={{ color: "black", mt: 1 }}>
                      <FaBell className="h-6 w-6" />
                      {hasNewNotification && (
                        <span className="absolute top-1 right-1 block h-3 w-3 rounded-full ring-2 ring-white bg-red-700"></span>
                      )}
                    </IconButton>
                  </div>
                )}

                <IconButton size="large" aria-label="menu" onClick={toggleDrawer} sx={{ color: "black" }}>
                  <MenuIcon />
                </IconButton>

                <motion.div initial={{ x: "100%" }} animate={{ x: openDrawer ? 0 : "100%" }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                  <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer} sx={{ "& .MuiDrawer-paper": { width: "90%", margin: "0 auto", height: "70%", marginTop: "16%", borderRadius: "12px", boxShadow: "0px 4px 10px rgba(102, 71, 71, 0.1)", backgroundColor: "#FFF", overflowY: "auto", position: "absolute", left: "0px" } }}>
                    <Box sx={{ width: "100%", backgroundColor: "#FFF", height: "100vh" }} role="presentation" onClick={e => e.stopPropagation()}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
                        {isLoggedIn ? (
                          <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "20px" }}>
                            <Avatar sx={{ bgcolor: "#023E8A" }}>{initials}</Avatar>
                            <Box sx={{ ml: 2 }}>
                              <Typography sx={{ fontWeight: "bold", color: "#181818", fontSize: "14px" }}>{user?.name || "User"}</Typography>
                              <Typography sx={{ fontWeight: "bold", color: "#67696D", fontSize: "14px" }}>{user?.email || ""}</Typography>
                            </Box>
                          </div>
                        ) : (
                          <Link to="/create-account" className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#012A5D] transition" onClick={toggleDrawer}>
                            Create an Account or Log In
                          </Link>
                        )}
                      </Box>

                      <Divider />
                      <List>
                        {navItems.map(item => (
                          <ListItem key={item.name} onClick={() => handleNavItemClick(item.path)} sx={{ cursor: "pointer" }}>
                            <ListItemText primary={item.name} />
                          </ListItem>
                        ))}
                      </List>

                      <Divider sx={{ marginBottom: "20px" }} />

                      {menuItems.map(({ text, icon, path }) => (
                        <ListItem key={text} onClick={() => handleNavItemClick(path)} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                          {text === "Notifications" ? (
                            <div className="flex items-center">
                              <ListItemIcon sx={{ minWidth: "40px" }}>{icon}</ListItemIcon>
                              <ListItemText primary={text} />
                              {hasNewNotification && <span className="ml-2 h-2.5 w-2.5 rounded-full bg-red-700 block"></span>}
                            </div>
                          ) : (
                            <>
                              <ListItemIcon sx={{ minWidth: "40px" }}>{icon}</ListItemIcon>
                              <ListItemText primary={text} />
                            </>
                          )}
                        </ListItem>
                      ))}

                      {logout.map(({ text, icon }) => (
                        <ListItem key={text} onClick={() => { toggleDrawer(); handleLogout(); }} sx={{ cursor: "pointer", display: "flex", alignItems: "center", marginTop: "26px" }}>
                          <ListItemIcon sx={{ minWidth: "40px" }}>{icon}</ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItem>
                      ))}
                    </Box>
                  </Drawer>
                </motion.div>
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      ) : (
        // Desktop View
        <AppBar position="fixed" sx={{ backgroundColor: "#FFFFFF", borderBottom: "0.5px solid #DEDFE1", boxShadow: "0px 2px 2px #0000000F", height: "80px", color: "#000000" }}>
          <Toolbar disableGutters sx={{ width: "90%", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography><img src={Travelmate} alt="Logo" /></Typography>

            <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}>
              {navItems.map(item => (
                <Link key={item.name} to={item.path} style={{ textDecoration: "none" }}>
                  <Button onClick={() => { handleCloseUserMenu(); handleTabClick(item.name); }} sx={{ my: 2, mr: 2, color: activeTab === item.name ? "#023E8A" : "#000000", display: "block", textTransform: "capitalize", backgroundColor: "transparent", "&:hover": { backgroundColor: "transparent" } }} className="font-bold font-inter text-xl">
                    {item.name}
                  </Button>
                </Link>
              ))}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {!isLoggedIn ? (
                <div className="hidden md:flex">
                  <Link to="/create-account" className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#012A5D] transition">
                    Create an Account or Login
                  </Link>
                </div>
              ) : (
                <>
                  {/* Notification Bell */}
                  <div className="relative mr-4">
                    <Tooltip title="Notifications">
                      <IconButton onClick={handleNotificationClick} sx={{ p: 0 }}>
                        <div className="bg-[#CCD8E81A] w-[40px] h-[40px] rounded-full border border-[#023E8A] flex items-center justify-center relative">
                          <FaBell className="h-6 w-6 text-[#023E8A]" />
                          {hasNewNotification && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-700"></span>}
                        </div>
                      </IconButton>
                    </Tooltip>
                  </div>

                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, display: "flex", alignItems: "center" }}>
                      {user?.profileImage ? <Avatar alt={user.name} src={user.profileImage} /> : <Avatar sx={{ bgcolor: "#023E8A" }}>{initials}</Avatar>}
                      <Box sx={{ ml: 2 }}>
                        <Typography sx={{ fontWeight: "bold", color: "#181818", fontSize: "14px" }}>{user?.name || "User"}</Typography>
                        <Typography sx={{ fontWeight: "bold", color: "#67696D", fontSize: "14px" }}>{user?.email || ""}</Typography>
                      </Box>
                    </IconButton>
                  </Tooltip>
                </>
              )}

              <Menu sx={{ mt: "45px" }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: "top", horizontal: "right" }} keepMounted transformOrigin={{ vertical: "top", horizontal: "right" }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                {settings.map(setting => (
                  <MenuItem key={setting} onClick={() => { handleCloseUserMenu(); if (setting === "Logout") handleLogout(); else if (setting === "Profile") navigate("/profile-info"); else navigate(`/${setting.toLowerCase()}`); }}>
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
