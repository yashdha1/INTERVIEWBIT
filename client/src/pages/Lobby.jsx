import { useState, useEffect } from "react";
import { useSocket } from "../providers/Socket.jsx";
import { useNavigate } from "react-router-dom";

function Lobby() {

  const [isCreating, setIsCreating] = useState(false);
  
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const [copied, setCopied] = useState(false);
  const { socket } = useSocket();

  const navigate = useNavigate();
  const handleJoinRoom = () => { 
    if (!email || !roomId) {
      alert("Please enter both email and room ID");
      return;
    } 
    console.log(`Joining room ${roomId} with email ${email}`);
    // navigate in the room
    navigate(`/room/${roomId}`, { state: { email, roomId } }); 
    socket.emit("join-room", { roomID: roomId, email: email });
  };
  const onJoinedRoom = (data) => {
    console.log("Socket joined-room callback triggered:", data);
  };

  useEffect(() => {
    socket.on("joined-room", onJoinedRoom);
    return () => {
      socket.off("joined-room", onJoinedRoom);
    };
  }, [socket, onJoinedRoom]);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2 sec
  };

  // When toggling to create, auto-fill the room ID
  const toggleMode = () => {
    if (!isCreating) {
      setRoomId(generateRoomId());
    } else {
      setRoomId("");
    }
    setIsCreating(!isCreating);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 transition-all duration-500 px-4">
      <h1 className="text-6xl font-extrabold text-white mb-6 transition-colors duration-300 hover:text-indigo-400">
        INTERVIEW <span className="text-indigo-500">BIT</span>
      </h1>
      <div className="w-full max-w-md bg-gray-800 p-8 shadow-lg transition-shadow hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-white mb-6 transition-colors hover:text-indigo-400">
          {isCreating ? "Create a Room" : "Join a Room"}
        </h1>

        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => isCreating && toggleMode()}
            className={`px-4 py-2 rounded ${
              !isCreating
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            Join
          </button>
          <button
            onClick={() => isCreating || toggleMode()}
            className={`px-4 py-2 rounded ${
              isCreating
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            Create
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <div className="relative">
            <input
              type="text"
              placeholder={
                isCreating ? "Room ID (auto-generated)" : "Enter Custom Room ID"
              }
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value.toUpperCase());
              }}
              readOnly={isCreating}
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                isCreating ? "cursor-not-allowed opacity-70 pr-12" : "pr-4"
              }`}
            />
            {isCreating && (
              <button
                onClick={copyToClipboard}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-1 text-sm focus:outline-none"
                title="Copy Room ID"
                type="button"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          <button
            onClick={handleJoinRoom}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl"
          >
            {isCreating ? "Create Room" : "Join Room"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
