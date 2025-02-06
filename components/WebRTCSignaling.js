import { useEffect, useRef } from "react";

const useWebSocket = (peerConnection) => {
  const ws = useRef(null);
  const serverURL = "ws://YOUR_SERVER_IP:3000";

  useEffect(() => {
    ws.current = new WebSocket(serverURL);

    ws.current.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket Message Received:", data);

        if (data.type === "offer") {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          ws.current.send(JSON.stringify(answer));
        } else if (data.type === "answer") {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data)
          );
        } else if (data.type === "candidate" && data.candidate) {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        }
      } catch (error) {
        console.error("WebSocket Error:", error);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.current.onclose = (event) => {
      console.warn(
        `WebSocket Disconnected: Code ${event.code}, Reason: ${event.reason}`
      );
      setTimeout(() => {
        console.log("Reconnecting WebSocket...");
        ws.current = new WebSocket(serverURL);
      }, 3000); // Attempt reconnection after 3 seconds
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [peerConnection]); // Depend on peerConnection to prevent stale state

  return ws.current;
};

export default useWebSocket;
