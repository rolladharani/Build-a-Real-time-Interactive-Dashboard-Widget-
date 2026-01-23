export function createWebSocket(onMessage) {
  const socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("WS DATA:", data);
    onMessage(data);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };

  return socket;
}
