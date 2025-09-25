import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate()
  const onClick = () => navigate("/items");

  return (
    <div className="w-full">
      <div className="card-wrapper">
        <div className="card-content">
          <p className="cart-text">
            Page Not Found.
          </p>
          <Button variant="default" onClick={onClick}>
            Lets start your list.
          </Button>
        </div>
      </div>
    </div>
  )
};

export default NotFoundPage;
