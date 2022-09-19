import React, { useState, useRef, useEffect } from "react";
import Client from "../Components/Client";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Editor from "../Components/Editor";
import { initSocket } from "../socket";
import Action from "../socketAction";

const EditorPage = () => {
  console.log("editor");
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    { name: location.state.userName, id: location.state.id },
  ]);

  useEffect(() => {
    async function init() {
      socketRef.current = await initSocket();
      socketRef.current.on("connect", () => {
        console.log("connected");
      });
      return () => {
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
      };
    }
    init();
  }, []); // providing empty array in second argument is very important otherwise useEffect will run for every render.

  const onLeave = (e) => {
    e.preventDefault();
    navigate("/");
    setUsers([]);
  };
  const onCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(location.state.id);
      toast.success("Copied!");
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };
  return (
    <div className="editor-page">
      <div className="aside">
        <div className="asideInner">
          <img className="logo" src="/code-sync.png" alt="Code Editor logo" />
          <h3 style={{ color: "white" }}>Connected</h3>
          <div className="allUsers">
            {users.map((user) => (
              <Client key={user.id} name={user.name} />
            ))}
          </div>
          <button className="btn copyBtn" onClick={onCopy}>
            Copy Room ID
          </button>
          <button className="btn leaveBtn" onClick={onLeave}>
            Leave
          </button>
        </div>
      </div>
      <div className="editorWrap">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
