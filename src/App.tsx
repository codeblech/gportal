import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import Login from "./pages/Login";
import Attendance from "./pages/Attendance";
import Alerts from "./pages/Alerts";
import TimeTable from "./pages/TimeTable";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";

// Layout component for authenticated pages
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-14 select-none">
      <div className="sticky top-0 z-30 bg-background -mt-[2px]">
        <Header />
      </div>
      {children}
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename="/gportal">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/attendance"
              element={
                <AuthenticatedLayout>
                  <Attendance />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/alerts"
              element={
                <AuthenticatedLayout>
                  <Alerts />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/timetable"
              element={
                <AuthenticatedLayout>
                  <TimeTable />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthenticatedLayout>
                  <Profile />
                </AuthenticatedLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
