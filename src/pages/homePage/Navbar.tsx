import  React, {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Travelmate from "../../assets/Travelmate_logo.svg";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
const pages = ['Home', 'Stays', 'Flights', 'Cars'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
import { Link } from 'react-router-dom';


const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
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

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

   const [activeTab, setActiveTab] = useState('Home');
     const handleTabClick = (page: string) => {
    setActiveTab(page);
  };
  return (
     <AppBar position="fixed"  
     sx={{
        backgroundColor: "#FFFFFF",
        borderBottom: "0.5px solid #DEDFE1",
        boxShadow: "0px 2px 2px #0000000F",
        height:"80px",
        color: "#000000",
        marginTop: "-10px",
        
      }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{width:"93%", margin:"auto"}}>

      
          <Typography
            // variant="h6"
            // noWrap
            // component="a"
            // href=""
            sx={{
              mr: 12,
            }}
          >
            <img src={Travelmate} alt='' />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              
            >
              <MenuIcon />
            </IconButton>
        
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' }}}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} >
                  <Typography sx={{ textAlign: 'center', color: "#000000" }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} >
            {pages.map((page) => (
              <Button
                key={page}
                // onClick={}
                onClick={() => {
                handleCloseNavMenu();
                handleTabClick(page);
            }}
                sx={{ 
                    my: 2, mr: 2, 
                    color: activeTab === page ? "#023E8A" : "#000000",  
                    display: 'block', textTransform:'capitalize',
                    backgroundColor: "transparent",
                    "&:hover": {
                    backgroundColor: "transparent",
                    },
                    "&:focus": {
                    backgroundColor: "transparent",
                    },
                    "&:active": {
                    backgroundColor: "transparent",
                    },
                }}
                className='font-bold font-inter text-xl'
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
          {/* {!isAuthenticated ? (
              <div className="hidden md:flex">
                <Link to="/create-account" className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#012A5D] transition">
                  Create an Account or Login
                </Link>
              </div>
            ) : ( */}

            {!fromLogin ? (
                <div className="hidden md:flex">
                  <Link to="/create-account" className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#012A5D] transition">
                    Create an Account or Login
                  </Link>
                </div>
              ) : (
                <>
                <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <div className='bg-[#CCD8E81A] w-[40px] h-[40px]  rounded-full border border-[#023E8A] text-center mr-[40px]'>
                  <NotificationsNoneOutlinedIcon/>
                </div>
              </IconButton>
            </Tooltip>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "#023E8A" }}>E</Avatar>
                <div className='text-left font-semibold text-[#181818] text-[14px] font-inter ml-[12px]'>
                    <p>Elivis</p>
                    <p className='text-left font-semibold text-[#67696D] text-[14px] font-inter'>Elvis@gmail.com</p>
                </div>
              
              </IconButton>

             
            </Tooltip>
            </>

            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
       
               
        </Toolbar>
      </Container>
    </AppBar>
  );

}

export default Navbar