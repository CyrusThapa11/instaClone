import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../App.js";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [comment_, setComment_] = useState({});
  const { state, dispatch } = useContext(userContext);

  useEffect(() => {
    fetch("/posts/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result -> ", result);
        setData(result);
      });
  }, []);

  const likePost = (id) => {
    fetch("/posts/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      // this will give the updated post
      // whose like would have been increased by 1
      .then((updatedPost) => {
        // console.log("res-----", res);

        const newData = data.map((post_) => {
          if (post_._id === updatedPost._id) {
            // return the new post whose like is increased otherwise it will show the old post and the likes would not have increased !
            return updatedPost;
          } else return post_;
        });
        setData(newData);
      });
  };
  const unlikePost = (id) => {
    fetch("/posts/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        console.log("updatedPost", updatedPost);
        const newData = data.map((post_) => {
          if (post_._id === updatedPost._id) {
            return updatedPost;
          } else return post_;
        });
        setData(newData);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/posts/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((res_) => {
        console.log("res_ -- ", res_);
        const newData = data.map((post_) => {
          if (post_._id === res_._id) {
            return res_;
          } else return post_;
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const deletePost = (postid) => {
    fetch(`/posts/deletepost/${postid}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Beared " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result--", result);
        const newData = data.filter((post) => {
          return post._id !== result.id._id;
        });
        setData(newData);
      });
  };

  return (
    <div className=" container home">
      <h2>Home</h2>

      {data &&
        data.map((post_) => {
          return (
            <div className="row" key={post_._id}>
              <div className="card home-card">
                {/* <div className="row"> */}
                <Link
                  to={
                    post_.postedBy._id !== state._id
                      ? "/profile/" + `${post_.postedBy._id}`
                      : "/profile"
                  }
                >
                  <h4 style={{ display: "inline" }}> {post_.postedBy.name} </h4>
                </Link>
                {post_.postedBy._id === state._id && (
                  <i
                    class="material-icons "
                    style={{ float: "right" }}
                    onClick={() => deletePost(post_._id)}
                  >
                    delete{" "}
                  </i>
                )}
                {/* </div> */}
                <div className="card-image">
                  <img src={post_.photo ? post_.photo : ""} alt="" />
                </div>
                <div className="card-content">
                  {post_.likes.includes(state._id) ? (
                    <>
                      <i className="material-icons" style={{ color: "red" }}>
                        favorite
                      </i>
                      <i
                        className="material-icons"
                        onClick={() => unlikePost(post_._id)}
                      >
                        thumb_down
                      </i>
                    </>
                  ) : (
                    <i
                      className="material-icons"
                      onClick={() => likePost(post_._id)}
                    >
                      thumb_up
                    </i>
                  )}

                  <h5> {post_.likes.length} - likes </h5>
                  <h4>- {post_.title}</h4>
                  <p>{post_.body}</p>
                  {post_.comments.map((comment) => {
                    return (
                      <h6 key={comment._id}>
                        {" "}
                        <span style={{ fontWeight: "bold" }}>
                          {comment.postedBy.name}{" "}
                        </span>{" "}
                        {comment.text}
                      </h6>
                    );
                  })}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // console.log(e.target[0].value);
                      // setComment_(e.target[0].value, post_._id);
                      makeComment(e.target[0].value, post_._id);
                    }}
                  >
                    <input type="text" placeholder="Add a comment" />
                  </form>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Home;
