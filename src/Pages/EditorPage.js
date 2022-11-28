import React, { useState, useRef, useEffect } from "react";
import Client from "../Components/Client";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Editor from "../Components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../socketAction";

const EditorPage = () => {
  const socketRef = useRef(null);
  const ran = useRef(true); // take care of this re-rendering issue
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  // return to home page if user name is not provided in

  const codeRef = useRef("");

  const onCodeChange = (code) => {
    codeRef.current = code;
  };

  useEffect(() => {
    async function init() {
      if (
        !location.state ||
        !location.state.userName ||
        !location.state.roomId
      ) {
        navigate("/");
      }
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        navigate("/");
      }

      socketRef.current.on("connect", () => {
        console.log("connected");
      });
      socketRef.current.emit(ACTIONS.JOIN, {
        userName: location.state.userName,
        roomId: location.state.roomId,
      });
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, socket_id, user_name }) => {
          setUsers(clients);
          if (socketRef.current.id != socket_id) {
            toast.success(`${user_name} joined`);
            socketRef.current.emit(ACTIONS.FIRST_CONNECT, {
              code: codeRef.current,
              socket_id,
            });
          }
        }
      );
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socket_id, user_name }) => {
        setUsers((prev) => {
          return prev.filter((user) => user.socket_id !== socket_id);
        });
        toast.error(`${user_name} is disconnected`);
      });
      return () => {
        socketRef.current.off("connect");
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.off("disconnect");
      };
    }
    if (ran.current) {
      ran.current = false;
      init();
    }
  }, []); // providing empty array in second argument is very important otherwise useEffect will run for every render.

  console.log(users);

  const onLeave = (e) => {
    e.preventDefault();
    socketRef.current.emit(ACTIONS.LEAVE, {
      userName: location.state.userName,
      roomId: location.state.roomId,
    });
    socketRef.current.disconnect();
    setUsers([]);
    navigate("/");
  };
  const onCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(location.state.roomId);
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
              <Client key={user.socket_id} name={user.user_name} />
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
        <Editor
          socketRef={socketRef}
          roomId={location.state.roomId}
          codeChange={onCodeChange}
        />
      </div>
    </div>
  );
};

export default EditorPage;
