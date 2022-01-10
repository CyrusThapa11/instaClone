import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

const CreatePosts = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    if (!imageURL) return;
    else {
      fetch(`/posts/createpost`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          photo: imageURL,
        }),
      })
        // .then((res) => {
        //   console.log("res-> ", res);

        //   // console.log("res.sjon -> ", res.json());
        //   return res.json();
        // })
        .then((data) => {
          console.log("data", data);
          if (data.error) {
            M.toast({ html: data.error, classes: "red darken-3" });
          } else {
            M.toast({
              html: "Created a post successfully !",
              classes: "green accent-3",
            });
            navigate("/");
          }
        });
    }
  }, [imageURL]);

  const postDetails = () => {
    // create a image and store it first

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
        setImageURL(data.url);
      })
      .catch((err) => console.log("err->> ", err));

    /// ACTUALLY CREATE A POST :
  };

  return (
    <div className="container">
      <div className="row">
        <div className="card col m8 offset-m2 l6 offset-l3">
          <h2>Create POsts</h2>

          <div className="card-content">
            <input
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            <div className="row ">
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
                    placeholder="Upload files"
                  />
                </div>
              </div>
            </div>
            <div className="row col offset-s3 offset-m4">
              <button
                onClick={postDetails}
                className="waves-effect waves-light  btn"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePosts;
