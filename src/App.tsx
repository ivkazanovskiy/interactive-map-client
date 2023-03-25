import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./auth/auth-context";
import Layout from "./components/Layout";
import LoginPage from "./auth/Login";
import RegistrationPage from "./auth/Registration";
import RequireAuthWrapper from "./auth/RequireAuthWrapper";
import Map from "./routes/Map";
import Campaigns from "./routes/Campaigns";
import Campaign from "./routes/Campaign";
import GoogleCallback from "./auth/GoogleCallback";
import Home from "./routes/Home";
import Session from "./routes/Session";

function App() {
  return (
    <AuthProvider>
      <h1>Interactive map</h1>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route element={<RequireAuthWrapper />}>
            <Route path="/campaign" element={<Campaigns />} />
            <Route path="/campaign/:id" element={<Campaign />} />
            <Route path="/map/:id" element={<Map />} />
            <Route path="/session/:id" element={<Session />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
