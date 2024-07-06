import { useContext, useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { getDocs, collection, query, where, doc, updateDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import UserOrders from "../pages/userOrders/UserOrders"
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Divider,
  Box,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  IconButton,
  Container,
} from "@mui/material";
import MapPinIcon from '@mui/icons-material/Room';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const ProfileComponent = () => {
  const { user, isLogged } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

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
            setUpdatedProfile({ ...userData, id: userId });

            // Habilitar el modo de edición si faltan datos
            if (!userData.firstName || !userData.lastName || !userData.phoneNumber) {
              setEditMode(true);
            }
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
            setUpdatedProfile({ ...userData, id: newDocRef.id });
            setEditMode(true);
          }
        } else {
          setError("No hay información de usuario disponible");
        }
      } catch (error) {
        setError("Error al cargar el perfil del usuario. Intenta de nuevo más tarde.");
        console.error('Error al obtener el perfil del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isLogged) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [isLogged, user]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      if (userProfile && userProfile.id) {
        const userDoc = doc(db, "users", userProfile.id);
        await updateDoc(userDoc, updatedProfile);
        setUserProfile(updatedProfile);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil del usuario:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ padding: '2rem', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
      {userProfile && (
        <Card sx={{ borderRadius: '8px', boxShadow: 3 }}>
          <CardContent>
            <Grid container spacing={4} alignItems="center">
              <Grid item>
                <Avatar sx={{ width: 64, height: 64, border: '2px solid', borderColor: '#00BF63', bgcolor:"#00BF63" }} >
                  {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs>
                {editMode ? (
                  <>
                    <TextField
                      name="firstName"
                      label="Nombre"
                      value={updatedProfile.firstName}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      name="lastName"
                      label="Apellido"
                      value={updatedProfile.lastName}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {userProfile.firstName} {userProfile.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userProfile.email}
                    </Typography>
                  </>
                )}
                <Typography variant="body2" color="textSecondary">
                  <MapPinIcon sx={{ width: '1em', height: '1em', marginRight: '0.5em' }} />
                  {userProfile.location || "San Francisco, CA"}
                </Typography>
                {editMode ? (
                  <TextField
                    name="phoneNumber"
                    label="Teléfono"
                    value={updatedProfile.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Teléfono: {userProfile.phoneNumber}
                  </Typography>
                )}
              </Grid>
              <Grid item>
                {editMode ? (
                  <IconButton color="primary" onClick={handleSaveClick}>
                    <SaveIcon />
                  </IconButton>
                ) : (
                  <IconButton color="primary" onClick={handleEditClick}>
                    <EditIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  Intereses de viaje
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {userProfile.interests?.map((interest, index) => (
                    <Chip key={index} label={interest} variant="outlined" />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  Sobre mí
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {userProfile.aboutMe}
                </Typography>
                <UserOrders/>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ProfileComponent;
