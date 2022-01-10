import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App";

const Navbar = () => {
  const { state, dispatch } = useContext(userContext);

  const renderList = () => {
    if (!state) {
      return [
        <li>
          <Link to="/signin">SignIn</Link>
        </li>,
        <li>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/createpost">Create</Link>
        </li>,
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/myfollowingposts">Following posts</Link>
        </li>,
        <li>
          <Link
            to="/signup"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
            }}
          >
            Logout
          </Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white ">
        <Link to={`${state ? "/" : "/signin"}`} className="brand-logo left">
          Insta
        </Link>
        <ul id="nav-mobile" className="right hide-on-small-only">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
