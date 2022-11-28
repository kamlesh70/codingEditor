import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

import ACTIONS from "../socketAction";

const Editor = ({ socketRef, roomId, codeChange }) => {
  const isRunned = useRef(false);
  const codeMirrorRef = useRef(null);

  useEffect(() => {
    async function init() {
      if (!isRunned.current) {
        codeMirrorRef.current = Codemirror.fromTextArea(
          document.querySelector("#editor"),
          {
            mode: { name: "javascript", json: true },
            theme: "dracula",
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
          }
        );

        codeMirrorRef.current.on("change", (instance, changes) => {
          let code = instance.getValue();
          codeChange(code);
          const { origin } = changes;
          if (origin !== "setValue") {
            socketRef.current.emit(ACTIONS.CODE_SYNC, { roomId, code });
          }
        });

        isRunned.current = true;
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      console.log("this is running");
      socketRef.current.on(ACTIONS.CODE_SYNC, ({ code }) => {
        console.log(code, " ------ is here");
        codeMirrorRef.current.setValue(code);
      });
    }
  }, [socketRef.current]);

  return <textarea id="editor"></textarea>;
};

export default Editor;
