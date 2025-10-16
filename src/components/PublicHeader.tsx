import { ThemeSelectorDialog } from "./theme-selector-dialog";
import { Button } from "./ui/button";
import { ChartNoAxesCombined, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PublicHeader = ({ showStatsButton = false, showBackButton = false }) => {
  return (
    <header className="bg-background mx-auto px-3 pt-4 pb-2">
      <div className="container-fluid flex justify-between items-center">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Link to="/">
              <Button variant="ghost" size="icon" className="cursor-pointer rounded-full">
                <ArrowLeft />
              </Button>
            </Link>
          )}
          <h1 className="text-foreground text-2xl font-bold lg:text-3xl font-sans">GPortal</h1>
        </div>
        <div className="flex items-center gap-1">
          {showStatsButton && (
            <Link to="/stats">
              <Button variant="ghost" size="icon" className="cursor-pointer rounded-full">
                <ChartNoAxesCombined />
              </Button>
            </Link>
          )}
          <ThemeSelectorDialog />
          {/* Empty div to maintain theme selector position - matches logout button size */}
          <div className="w-10 h-10"></div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
