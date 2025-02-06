import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import PublicProfile from "./components/PublicProfile"

const theme = createTheme({
  palette: {
    primary: {
      main: "#3fb8af",
    },
    secondary: {
      main: "#ff3d7f",
    },
    background: {
      default: "#2c2c2c",
    },
    text: {
      primary: "#000000",
      secondary: "#7fc7af",
    },
    error: {
      main: "#ff9e9d",
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/u/:username" element={<PublicProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

