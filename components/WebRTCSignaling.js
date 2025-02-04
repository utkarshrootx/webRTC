import { useEffect, useRef } from "react";

const useWebSocket = (peerConnection) => {
  const ws = useRef(new WebSocket("ws://YOUR_SERVER_IP:3000")).current;

  useEffect(() => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "offer") {
        peerConnection.setRemoteDescription(new RTCSessionDescription(data));
        peerConnection.createAnswer().then((answer) => {
          peerConnection.setLocalDescription(answer);
          ws.send(JSON.stringify(answer));
        });
      } else if (data.type === "answer") {
        peerConnection.setRemoteDescription(new RTCSessionDescription(data));
      } else if (data.type === "candidate") {
        peerConnection.addIceCandidate(data.candidate);
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };
  }, []);

  return ws;
};

export default useWebSocket;
