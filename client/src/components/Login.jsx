import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { TextField, Button, Typography, Container, Box } from "@mui/material"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password })
      localStorage.setItem("token", response.data.token)
      navigate("/dashboard")
    } catch (error) {
        setError(error.response?.data?.message || "Error de registro")    }
  }

  return (
    //centrar el container
    <Container component="main" maxWidth="xs" style={{backgroundColor: "#333333" , borderRadius: "10px" ,alignItems: "center", display: "flex", flexDirection: "column", padding: "20px",marginTop:"10%"}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" style={{color: "white"}}>
          Iniciar sesión
        </Typography>
        {error && (
          <Typography component="p" variant="body2" color="error">
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Iniciar sesión
          </Button>
          <span style={{ display: "block", textAlign: "center" ,color: "white"}}> No tienes una cuenta? <a style={{color: "white" , textDecoration: "none" } } href="/register">Registrate</a></span>
        </Box>
      </Box>
    </Container>
  )
}

export default Login

