import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import Admin from "./routes/Admin";
import AdminGuard from "./guards/AdminGuard";
import { ConfirmProvider } from "material-ui-confirm";
import Dashboard from "./routes/Dashboard";
import Login from "./routes/Login";
import Panel from "./routes/Panel";

export default function App() {
  return (
    <ConfirmProvider>
      <Router>
        <Routes>
          <Route element={<AdminGuard expectedAuth={false} />}>
            {/* React-router dropped support for Regex */}
            <Route path="/auth/log-in" element={<Login />} />
            <Route path="/auth/create-account" element={<Login />} />
            <Route path="/auth/reset-password" element={<Login />} />
            <Route path="/auth" element={<Navigate to="/auth/login" />} />
          </Route>

          <Route element={<AdminGuard expectedAuth={true} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/panel/:panelId" element={<Panel />} />
          </Route>

          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ConfirmProvider>
  );
}
