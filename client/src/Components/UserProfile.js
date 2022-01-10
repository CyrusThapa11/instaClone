import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../App";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { state, dispatch } = useContext(userContext);
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState( state ? !state.following.includes(userid):true);
  const [userProfile, setuserProfile] = useState(null);
  
  console.log("userProfile --- ", userProfile);
  console.log("state --- ", state);

  useEffect(() => {
    console.log("fetching");
    fetch(`/user/showuser/${userid}`, {
      headers: {
        // "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result --> ", result);
        // setPics(result);
        // dispatch({  });
        setuserProfile(result);
      });
  }, []);

  const follow = () => {
    setShowFollow(false);
    fetch(`/user/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followedId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setuserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
      });
  };

  const unfollow = () => {
    setShowFollow(true);
    fetch(`/user/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowedId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setuserProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (ppl) => ppl !== data._id
          );

          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
      });
  };

  return (
    <>
      {!userProfile ? (
        <h2>Loading....</h2>
      ) : (
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
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={userProfile?userProfile.profile:'Loading...'}
                alt=""
                style={{
                  width: "150px",
                  borderRadius: "50%",
                  height: "150px",
                }}
              />
            </div>
            <div style={{ flex: "2" }}>
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <h3> {userProfile ? userProfile.user.name : "Anonyoumous"} </h3>
                <h3>
                  {" "}
                  {userProfile ? userProfile.user.email : "Anonyoumous"}{" "}
                </h3>
              </div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div className="div">
                  <h5> {userProfile ? userProfile.posts.length : 0} Posts</h5>
                </div>
                <div>
                  <h5>{userProfile.user.followers.length} Followers</h5>
                  {showfollow ? (
                    <button
                      onClick={() => follow()}
                      className="btn btn-primary "
                    >
                      Follow
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <h5>{userProfile.user.following.length} following</h5>
                  {showfollow ? (
                    ""
                  ) : (
                    <button onClick={unfollow} className="btn btn-primary ">
                      UnFollow
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="gallery">
            {userProfile
              ? userProfile.posts.map((pic_) => {
                  return (
                    <img
                      key={pic_._id}
                      src={pic_.photo}
                      alt={pic_.title}
                      className="galleryImg"
                    />
                  );
                })
              : ""}
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
