import { Link } from "react-router";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-[30px] h-[64px] bg-brand">
      <Link
        to="/"
        className="font-dosis text-lg font-semibold text-white leading-none tracking-[0.25px] uppercase"
      >
        Shopping List
      </Link>
    </header>
  );
};

export default Header;
