import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { userContext } from "../App";

const SignIn = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { state, dispatch } = useContext(userContext);

  console.log("SignIn");
  const createUser = (user) => {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      M.toast({ html: "Invalid email", classes: "red darken-3" });
    } else {
      fetch(`/user/signin`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
          email,
        }),
      })
        .then((res) => {
          console.log("res-> ", res);

          // console.log("res.sjon -> ", res.json());
          return res.json();
        })
        .then((data) => {
          console.log("data", data);
          if (data.error) {
            M.toast({ html: data.error, classes: "red darken-3" });
          } else {
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch({ type: "USER", payload: data.user });
            M.toast({
              html: "Successfully signed In !",
              classes: "green accent-3",
            });
            navigate("/");
          }
        });
    }
  };

  console.log("rendering signin");
  return (
    <div>
      <div className="row rowmt ">
        <div className="col  s10 m6 l4 offset-m3 offset-s1 offset-l4 ">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">SignIn</span>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
                onClick={createUser}
              >
                SignIn
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
