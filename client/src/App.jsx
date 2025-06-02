import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";

import { SocketProvider } from "./providers/Socket.jsx";

function App() {
  return (
    <div>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
