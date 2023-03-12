import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./auth/auth-context";
import Layout from "./components/Layout";
import LoginPage from "./auth/LoginPage";
import RegistrationPage from "./auth/RegistrationPage";
import RequireAuthWrapper from "./auth/RequireAuthWrapper";
import Map from "./routes/Map";
import Campaigns from "./routes/Campaigns";
import Campaign from "./routes/Campaign";
import GoogleCallback from "./auth/GoogleCallback";

function App() {
  return (
    <AuthProvider>
      <h1>Interactive map</h1>
      <Routes>
        <Route element={<Layout />}>
          <Route path="//auth/google/callback" element={<GoogleCallback />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route element={<RequireAuthWrapper />}>
            <Route path="/" element={<Navigate to="/campaign" />} />
            <Route path="/campaign" element={<Campaigns />} />
            <Route path="/campaign/:id" element={<Campaign />} />
            <Route path="/map/:id" element={<Map />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
