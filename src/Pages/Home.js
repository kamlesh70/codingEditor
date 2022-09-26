import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const onCreateRoomID = (e) => {
    e.preventDefault();
    let id = uuidV4();
    setRoomId(id);
    toast.success("created a new room");
  };
  const onJoinHandler = (e) => {
    if (roomId.trim() == "" || userName.trim() == "") {
      toast.error("room id & user name required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
        roomId,
      },
    });
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img src="code-sync.png" alt="Code Editor logo" />
        <h4 className="mainLabel">Paste Invitation Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button className="btn joinBtn" onClick={onJoinHandler}>
            Join
          </button>
          <span className="createInfo">
            if you don't have an invite then create &nbsp;
            <a className="createNewBtn" href="" onClick={onCreateRoomID}>
              new room
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
