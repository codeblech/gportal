import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeSelectorDialog } from "./theme-selector-dialog";

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate("/login");
  };

  return (
    <>
      <header className="bg-background mx-auto px-3 pt-4 pb-2">
        <div className="container-fluid flex justify-between items-center">
          <h1 className="text-foreground text-2xl font-bold lg:text-3xl font-sans">
            GPortal
          </h1>
          <div className="flex items-center gap-1">
            <ThemeSelectorDialog />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer rounded-full"
            >
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Logging out...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
