import React, { useState,useEffect } from "react";
import M from "materialize-css";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image,setImage ]= useState("");
  const [url, setUrl] = useState(undefined);


  useEffect(() => {
    if (url) {
      uploadFields()
    }

  },[url])


  const uploadPic = () => {
    
    const data = new FormData();
    console.log("image -> ", image);

    data.append("file", image);

    data.append("upload_preset", "insta-clone");

    data.append("cloud_name", "vinsmokecyrus");

    fetch(`https://api.cloudinary.com/v1_1/vinsmokecyrus/image/upload`, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("datais -> ", data);
        setUrl(data.url);
      })
      .catch((err) => console.log("err->> ", err));
  }

  const uploadFields = () => {
       fetch(`/user/signup`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
          email,
          profile:url
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
            M.toast({ html: data.message, classes: "green accent-3" });
            navigate("/signin");
          }
        });
    
  }
  
  const createUser = (user) => {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      M.toast({ html: "Invalid email", classes: "red darken-3" });
    } else {

      if (image) {
        uploadPic()
      } else {
        uploadFields()
      }
   
    }
  };

  return (
    <div>
      <div className="row rowmt ">
        <div className="col  s10 m6 l4 offset-m3 offset-s1 offset-l4 ">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">SignUp</span>

              <input
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              /><div className="row ">
              <div className="file-field input-field col s12 m10 l6">
                <div className="btn">
                  <span>File</span>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      console.log("e.target.files->", e.target.files[0]);
                      setImage(e.target.files[0]);
                    }}
                  />
                </div>
                <div className="file-path-wrapper">
                  <input
                    className="file-path validate"
                    type="text"
                    placeholder="Upload profile"
                  />
                </div>
              </div>
            </div>
              <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
                onClick={createUser}
              >
                SignUp
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
