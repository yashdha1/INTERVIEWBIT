import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSocket } from "../providers/Socket.jsx";
import ReactPlayer from "react-player";
import peer from "../service/peer.js";
import { Socket } from "socket.io-client";
import { use } from "react";

function Room() {
  const { socket } = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const sentStreams = () => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  };


  const handleUserJoined = (data) => {
    const { email, roomID, socketId } = data;
    console.log("Data from the backend for the socket conencctions :-> ", data);
    setRemoteSocketId(socketId);
    console.log(` new user ${email} has joined the room ${roomID}`); // for now
  };
  const handleBrodcast = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const offer = await peer.getOffer();
    await peer.peer.setLocalDescription(offer);
    socket.emit("user:broadcast", { to: remoteSocketId, offer });
    setMyStream(stream);
    // const videoTrack = stream.getVideoTracks()[0];
    // const audioTrack = stream.getAudioTracks()[0];
    // socket.emit("broadcast", { videoTrack, audioTrack });
  }; // handleBrodcast
  const handleIncommingCall = async (data) => {
    setRemoteSocketId(data.from);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
    const { from, offer } = data;
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
    console.log(`Incoming call from ${from} and offer is :-> `, offer);
    // Here you would typically set the remote description and create an answer
  };
  const handleCallAccepted = async (data) => {
    const { from, ans } = data;
    await peer.peer.setRemoteDescription(new RTCSessionDescription(ans));
    // call accepted:
    sentStreams();

    console.log(`Call accepted by ${from} with answer:`, ans);
  };
  const handleNegotiationIncomming = async (data) => {
    const { from, offer } = data;
    console.log(`Negotiation request from ${from} with offer:`, offer);
    // Here you would typically set the remote description and create an answer
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:negotiation:done", { to: from, ans });
  };
  const handleNegotiationFinal = async (data) => {
    const { ans } = data;
    await peer.peer.setRemoteDescription(new RTCSessionDescription(ans));
    console.log(`Negotiation finalized`);
  };

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:negotiation", handleNegotiationIncomming);
    socket.on("peer:negotiation:final", handleNegotiationFinal);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:negotiation", handleNegotiationIncomming);
      socket.off("peer:negotiation:final", handleNegotiationFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegotiationFinal,
  ]);

  const handleNegotiation = async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:negotiation", { to: remoteSocketId, offer });
  };
  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [handleNegotiation]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (event) => {
      const remoteStream = event.streams;
      console.log("GOT TRACKS!!!!!")
      console.log(`MY Stream: ${myStream} | Remote Stream: ${remoteStream}`);
      setRemoteStream(remoteStream[0]);
      console.log("Remote stream received:", remoteStream);
      // Here you can set the remote stream to a video element or ReactPlayer
      // For example, you can set it to a state variable to render it
    });
  }, [remoteSocketId]);
  return (
    <div>
      <h1>hello Room PAGE</h1>
      <h3>{remoteSocketId ? "Connected" : "Not Connected"}</h3>
      <h4>Room ID: {remoteSocketId}</h4>
      <button onClick={handleBrodcast}>
        Connect [enables the vid and audio]
      </button>
      {myStream && <button onClick={sentStreams}>Send Stream and Audio</button>}
      {myStream && (
        <>
          <h2>MY STREAM</h2>
          <ReactPlayer
            url={myStream}
            playing={true}
            controls={true}
            width="300px"
            height="150px"
            pip={true}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h2>REMOTE STREAM </h2>
          <ReactPlayer
            url={remoteStream}
            playing={true}
            controls={true}
            width="300px"
            height="150px"
            pip={true}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
          />
        </>
      )}
    </div>
  );
}
export default Room;
