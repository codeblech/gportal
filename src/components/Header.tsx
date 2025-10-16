import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeSelectorDialog } from "./theme-selector-dialog";

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
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
            className="cursor-pointer rounded-full"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
