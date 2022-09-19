import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const Editor = () => {
  const isRunned = useRef(false);
  useEffect(() => {
    async function init() {
      if (!isRunned.current) {
        Codemirror.fromTextArea(document.querySelector("#editor"), {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        });
        isRunned.current = true;
      }
    }
    init();
  }, []);

  return <textarea id="editor"></textarea>;
};

export default Editor;
