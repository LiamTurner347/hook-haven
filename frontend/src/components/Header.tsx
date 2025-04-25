import { Link } from "react-router-dom";
const Header = () => {
  return (
    <>
      <div className="title-bar header">
        <Link to={"/"}>
          <div className="title-bar-text">Hook Haven</div>
        </Link>
      </div>
    </>
  );
};

export default Header;
