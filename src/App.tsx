import { Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/auth-context";
import HomePage from "./auth/HomePage";
import Layout from "./auth/Layout";
import LoginPage from "./auth/LoginPage";
import PublicPage from "./auth/PublicPage";
import RegistrationPage from "./auth/RegistrationPage";
import RequireAuthWrapper from "./auth/RequireAuthWrapper";
import Map from "./components/Canvas/Map";

function App() {
  return (
    <AuthProvider>
      <h1>Dungeons and dragons</h1>

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/public-page" element={<PublicPage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route
            path="/map"
            element={
              <RequireAuthWrapper>
                <Map />
              </RequireAuthWrapper>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
