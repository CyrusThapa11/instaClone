
import React, { useEffect, useState, useContext } from "react";
import M from "materialize-css";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";

const Profile = () => {
    const navigate = useNavigate();
  const [image,setImage ]= useState("");
  const [url, setUrl] = useState(null);


  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(userContext);

  console.log('the profile state is ', state);
  
  
  useEffect(() => {
    fetch("/posts/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result -> ", result);
        setPics(result);
      });
  }, []);

  useEffect(() => {
    console.log('running use Effect !');
    if(image)
    updatePhoto()

  }, [image])
  
  const updateInDb = () => {
    if (url !== null && url !== undefined) {

      console.log('updating in db');
        fetch(`/user/updateprofile`, {
        method: 'put',
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer '+localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          profile:url
        })
      }).then((res) => res.json())
        .then((result) => {
        console.log(' result ',result);
      })
    }
    
  }

  const updatePhoto = () => {
     

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
        console.log("image data  -> ", data);
        if (data) {
          setUrl(data.url);
          console.log('data is', data);
          localStorage.setItem("user", JSON.stringify({ ...state, profile: data.url }))
          dispatch({ type: "UPDATEPIC", payload: data.url })
          if(url !== null && url !== undefined)
            updateInDb()

        }
      })
      .catch((err) => console.log("err->> ", err));
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          // justifyContent: "space-around",
          margin: "18px",
          borderBottom: "1px solid gray",
          paddingBottom: "20px",
        }}
      >
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection:"column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={state?state.profile:""}
            alt=""
            style={{
              width: "150px",
              borderRadius: "50%",
              height: "150px",
            }}
          />
          <div className="file-field input-field col s12 m10 l6">
                <div className="btn">
                  <span>Upload</span>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      console.log("e.target.files->", e.target.files[0]);
                      setImage(e.target.files[0]);
                    }}
                  />
                </div>
              </div>
        </div>
        <div style={{ flex: "2" }}>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <h3> {state ? state.name : "Anonyoumous"} </h3>
            <h3>{state ? state.email : "xyz@gmail.com"} </h3>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="div">
              <h5> {mypics && mypics.length} Posts</h5>
            </div>
            <div>
              <h5>{state && state.followers.length} Followers</h5>
              <button className="btn btn-primary ">Follow</button>
            </div>
            <div>
              <h5>{state && state.following.length} following</h5>
              <button className="btn btn-primary ">UnFollow</button>
            </div>
          </div>
        </div>
      </div>

      <div className="gallery">
        {mypics.map((pic_) => {
          return (
            <img
              key={pic_._id}
              src={pic_.photo}
              alt={pic_.title}
              className="galleryImg"
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
