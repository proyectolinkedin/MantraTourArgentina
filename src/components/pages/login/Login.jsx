import { useState, useContext } from "react";
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
  Tooltip,
  Typography,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { db, loginGoogle, onSignIn } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setUserCredentials({
      ...userCredentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await onSignIn(userCredentials);
      if (res.user) {
        const userRef = doc(db, "users", res.user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          let finallyUser = {
            email: res.user.email,
            rol: userData.rol,
            ...userData,
          };
          handleLogin(finallyUser);
          navigate("/");
        } else {
          setError("No se encontraron datos del usuario.");
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError(error.message);
    }
  };

  const googleSingIn = async () => {
    try {
      const res = await loginGoogle();
      const finallyUser = {
        email: res.user.email,
        rol: "user",
      };
      handleLogin(finallyUser);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
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
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2} justifyContent={"center"}>
          {error && (
            <Grid item xs={10} md={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          <Grid item xs={10} md={12}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              onChange={handleChange}
              value={userCredentials.email}
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Contraseña
              </InputLabel>
              <OutlinedInput
                name="password"
                onChange={handleChange}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={userCredentials.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff color="primary" />
                      ) : (
                        <Visibility color="primary" />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
              />
            </FormControl>
          </Grid>
          <Link
            to="/forgot-password"
            style={{ color: "steelblue", marginTop: "10px" }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Grid container justifyContent="center" spacing={3} mt={2}>
            <Grid item xs={10} md={5}>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  color: "white",
                  textTransform: "none",
                  textShadow: "2px 2px 2px grey",
                }}
              >
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={10} md={5}>
              <Tooltip title="Ingresar con Google">
                <Button
                  variant="contained"
                  startIcon={<GoogleIcon />}
                  onClick={googleSingIn}
                  type="button"
                  fullWidth
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                  }}
                >
                  Ingresar con Google
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={10} md={8}>
              <Typography
                color={"secondary.primary"}
                variant={"h6"}
                mt={1}
                align="center"
              >
                ¿Aún no tienes cuenta?
              </Typography>
            </Grid>
            <Grid item xs={10} md={5}>
              <Tooltip title="Registrarse">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/register")}
                  type="button"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                  }}
                >
                  Registrarse
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Login;
