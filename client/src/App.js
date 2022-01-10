import "./App.css";
import Navbar from "./Components/Navbar";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";
import CreatePosts from "./Components/CreatePosts";
import SignIn from "./Components/SignIn";
import { createContext, useEffect, useReducer, useContext } from "react";
import { reducer, initialState } from "./reducer/userReducer";
import UserProfile from "./Components/UserProfile";
import FollowingPosts from "./Components/FollowingPosts";

export const userContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(userContext);

  console.log("routing");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user is ", user);
    if (user) {
      dispatch({ type: "USER", payload: user });
      // navigate("/");
    } else {
      navigate("/signin");
    }
  }, []);

  return (
    <Routes>
      {" "}
      <Route exact path="/" element={<Home />} />
      <Route exact path="/signin" element={<SignIn />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/createpost" element={<CreatePosts />} />
      <Route exact path="/myfollowingposts" element={<FollowingPosts />} />
      <Route exact path="/profile/:userid" element={<UserProfile />} />
    </Routes>
  );
};
function App() {
  console.log("app js");
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("rendering appjs");
  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
