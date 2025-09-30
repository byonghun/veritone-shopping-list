import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";

const HomePage = () => {
  const navigate = useNavigate()
  const onClick = () => navigate("/items");

  return (
    <div id="home-page" className="w-full">
      <div className="card-wrapper mt-[110px]">
        <div className="card-content">
          <p className="card-text text-primaryFont">
            Home Page
          </p>
          <Button variant="default" onClick={onClick}>
            Lets start your list
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
