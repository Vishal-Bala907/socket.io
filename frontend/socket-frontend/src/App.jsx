import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { connect, io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // const [count, setCount] = useState(0);
  const socket = useMemo(() => io("http://localhost:4000"), []);

  // sending message to backend
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomID, setRoomId] = useState("");
  const messages = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // sending message to a particular socket
    socket.emit("message", message);
    // send message to a particular room
    socket.emit("mgs-rec", { message, roomID });
    setMessage("");
  };

  // console.log(socket.id);
  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("message", (msg) => {
      console.log(msg);
    });

    socket.on("personal", ({ msg, room }) => {
      console.log(msg);

      // Create a container div
      const tempDiv = document.createElement("div");

      // Add the content
      tempDiv.innerHTML = `
            <div class="fw-bold">${room}</div>
            <div>${msg}</div>
          `;

      // const temp = ` <div>
      //     <div className="fw-bold">${room}</div>
      //     <div>${msg}</div>
      //   </div>`;

      console.log(room);
      messages.current.appendChild(tempDiv);
    });
  }, [socket]);
  return (
    <>
      <label htmlFor="">{socketId}</label>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomID}
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          placeholder="enter room id"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder="Enter message"
        />
        <button type="submit">Send</button>
      </form>
      <section
        ref={messages}
        className="flex justify-content-center align-items center gap-3 flex-row bg-primary"
      >
        <div>
          <div className="fw-bold">id section</div>
          <div>Messagge</div>
        </div>
      </section>
    </>
  );
}

export default App;
