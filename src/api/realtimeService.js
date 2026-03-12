export function createWebSocket(onData, onError, onOpen) {

  const socket = new WebSocket(import.meta.env.VITE_REALTIME_API_URL);

  socket.onopen = () => {
    console.log("WebSocket connected");
    if (onOpen) onOpen();
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("WS DATA:", data);
    if (onData) onData(data);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    if (onError) onError("WebSocket connection failed");
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };

  return socket;
}