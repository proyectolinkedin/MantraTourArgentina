import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, db } from "../../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });
  const [error, setError] = useState("");

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (userCredentials.password !== userCredentials.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      let res = await signUp(userCredentials);
      if (res.user.uid) {
        await setDoc(doc(db, "users", res.user.uid), {
          firstName: userCredentials.firstName,
          lastName: userCredentials.lastName,
          phoneNumber: userCredentials.phoneNumber,
          email: userCredentials.email,
          role: "user"
        });
      }
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Registro
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="firstName"
                label="Nombre"
                fullWidth
                onChange={handleChange}
                value={userCredentials.firstName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="lastName"
                label="Apellido"
                fullWidth
                onChange={handleChange}
                value={userCredentials.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phoneNumber"
                label="Número de Teléfono"
                fullWidth
                onChange={handleChange}
                value={userCredentials.phoneNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                onChange={handleChange}
                value={userCredentials.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  value={userCredentials.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Contraseña"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-confirm-password">
                  Confirmar contraseña
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-confirm-password"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  onChange={handleChange}
                  value={userCredentials.confirmPassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirmar contraseña"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  color: "white",
                  textTransform: "none",
                  mt: 2,
                  bgcolor: "primary.main",
                }}
              >
                Registrarme
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/login")}
                type="button"
                sx={{
                  mt: 1,
                }}
              >
                Regresar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default Register;
