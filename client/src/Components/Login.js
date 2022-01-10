import React from "react";

const Login = () => {
  return (
    <div>
      <div className="row rowmt ">
        <div className="col  s10 m6 l4 offset-m3 offset-s1 offset-l4 ">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">Login</span>

              <input type="email" placeholder="email" />
              <input type="text" placeholder="password" />
              <button
                className="btn waves-effect waves-light btnn"
                type="submit"
                name="action"
              >
                Login
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
