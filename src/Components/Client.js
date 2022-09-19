import React from "react";
import Avatar from "react-avatar";

const Client = ({ name }) => {
  return (
    <div className="user">
      <Avatar name={name} size={40} round="8px" />
      <span style={{ color: "white" }}>{name}</span>
    </div>
  );
};

export default Client;
