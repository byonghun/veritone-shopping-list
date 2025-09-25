import { useLocation, useNavigate } from "react-router";
import { ROUTES } from "../../constants/routes";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = () => {
    if (location.pathname !== ROUTES.home) {
      navigate(ROUTES.home);
    }
  };

  return (
    <header className="flex items-center justify-between px-[30px] h-[64px] bg-brand">
      <button
        type="button"
        onClick={onClick}
        className="font-dosis text-lg font-semibold text-white leading-none tracking-[0.25px] uppercase h-full"
        aria-label="Home button"
      >
        Shopping List
      </button>
    </header>
  );
};

export default Header;
