const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let eventId = 0;

wss.on("connection", (ws) => {
  console.log("Client connected");

  const interval = setInterval(() => {
    const data = {
      id: eventId++,
      type: ["metric", "log", "alert"][Math.floor(Math.random() * 3)],
      severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      timestamp: new Date().toISOString(),
      value: Math.floor(Math.random() * 1000),
      message: `Event ${eventId} occurred`,
    };

    ws.send(JSON.stringify(data));
  }, 2000);

  ws.on("close", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log("Mock WebSocket server started on port 8080");
