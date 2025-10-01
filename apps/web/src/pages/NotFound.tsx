import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const onClick = () => navigate("/items");

  return (
    <div id="not-found-page" className="w-full">
      <div className="card-wrapper mt-[110px]">
        <div className="card-content">
          <p className="card-text text-primaryFont">Page Not Found.</p>
          <Button variant="default" onClick={onClick}>
            Lets start your list
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
