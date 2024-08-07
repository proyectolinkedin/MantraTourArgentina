import { useState, useContext, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './Navbar.css';
import LogoutIcon from '@mui/icons-material/Logout';
import { menuItems } from '../../../router/navigation';
import { logOut } from '../../../firebaseConfig';
import { AuthContext } from '../../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { db } from '../../../firebaseConfig';
import { getDocs, collection, query, where, doc, setDoc } from 'firebase/firestore';

const drawerWidth = 200;
const settings = ['Profile', 'Logout'];

const Navbar = (props) => {
  const { logOutContext, user, isLogged } = useContext(AuthContext);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const navigate = useNavigate();
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user && user.email) {
          const usersCollection = collection(db, "users");
          const usersQuery = query(usersCollection, where("email", "==", user.email));
          const querySnapshot = await getDocs(usersQuery);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const userId = querySnapshot.docs[0].id;  // Obtener el ID del documento
            setUserProfile({ ...userData, id: userId });
          } else {
            // Si no se encuentra el usuario en Firestore, crear un nuevo documento
            const userData = {
              email: user.email,
              firstName: user.displayName ? user.displayName.split(' ')[0] : '',
              lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
              phoneNumber: ''
            };
            const newDocRef = await setDoc(doc(usersCollection), userData);
            setUserProfile({ ...userData, id: newDocRef.id });
          }
        }
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    if (isLogged) {
      fetchUserProfile();
    }
  }, [isLogged, user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogOut = async () => {
    try {
      console.log("Intentando cerrar sesión...");
      await logOut();
      console.log("Sesión cerrada en Firebase.");
      logOutContext();
      console.log("Contexto de sesión cerrado.");
      navigate('/login');
      console.log("Navegando a /login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenuClick = (setting) => {
    switch (setting) {
      case 'Profile':
        navigate('/profile');
        break;
      case 'Account':
        navigate('/account');
        break;
      case 'Dashboard':
        navigate('/dashboard');
        break;
      case 'Logout':
        handleLogOut();
        break;
      default:
        break;
    }
    handleCloseUserMenu();
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map(({ id, path, title, Icon }) => (
          <Link key={id} to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary={title} sx={{ color: '#ffffff' }} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
        {user && user.rol === rolAdmin && (
          <Link to={'/dashboard'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} sx={{ color: '#ffffff' }} />
              </ListItemButton>
            </ListItem>
          </Link>
        )}
        <ListItem disablePadding onClick={handleLogOut}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText primary={'Cerrar sesión'} sx={{ color: '#ffffff' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: '100%' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, marginRight: '8px' }}>
              <Link to="/"> 
              <img
                src="https://firebasestorage.googleapis.com/v0/b/mantratour-37a6e.appspot.com/o/logo%20mantra.png?alt=media&token=add80bfd-737e-4d8f-a001-c0a2a43493fc"
                alt="logo"
                style={{ height: '30px' }}
              />
              </Link>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, marginRight: '8px' }}>
              <Link to="/">
              <img
                src='https://firebasestorage.googleapis.com/v0/b/mantratour-37a6e.appspot.com/o/logo%20mantra.png?alt=media&token=add80bfd-737e-4d8f-a001-c0a2a43493fc'
                alt="logo"
                style={{ height: '30px' }}
              />
              </Link>
            </Box>
            
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
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
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {menuItems.map(({ id, path, title }) => (
                  <MenuItem key={id} component={Link} to={path} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Mantra
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {menuItems.map(({ id, path, title }) => (
                <Button
                  key={id}
                  component={Link}
                  to={path}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {title}
                </Button>
              ))}
              {user && user.rol === rolAdmin && (
                <Button
                  component={Link}
                  to={'/dashboard'}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Dashboard
                </Button>
              )}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={`${userProfile?.firstName || 'U'} ${userProfile?.lastName || 'U'}`}
                    src={userProfile?.avatarUrl}
                    sx={{
                      bgcolor: userProfile?.avatarUrl ? 'transparent' : '#00BF63',
                      color: 'white',
                      width: 64,
                      height: 64,
                      border:"2px solid",
                      borderColor: "#00BF63",
                    }}
                  >
                    {!userProfile?.avatarUrl && `${userProfile?.firstName?.charAt(0) || 'U'}${userProfile?.lastName?.charAt(0) || 'U'}`}
                  </Avatar>
                </IconButton>
              </Tooltip>
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
                  <MenuItem key={setting} onClick={() => handleUserMenuClick(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav" aria-label="mailbox folders">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          anchor={'right'}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1976d2',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          width: '100%',
          minHeight: '100vh',
          px: 2,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Navbar;
