// to run this example, open two terminal windows
// in the first terminal window run `node server-sent-events.js`
// in the second terminal window run `curl -X GET http://localhost:3000/events`
// OPTIONAL: you can open the borwser and navigate to `http://localhost:3000/` to see the real-time updates
// what matters is that the server is sending real-time updates to the client wether it is terminal or browser

const express = require("express");
const app = express();

// SSE middleware
app.get("/events", (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-open");

  // Function to send events
  const sendEvent = (data) => {
    // this is the format the data should be sent to be parsed by the browser
    // format: data: --data here-- \n\n
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Simulate periodic updates
  const intervalId = setInterval(() => {
    sendEvent({
      timestamp: new Date().toISOString(),
      message: "Real-time update",
      randomValue: Math.random(),
    });
  }, 2000);

  // Clean up on client disconnect
  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

// Serve HTML client
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <body>
      <div id="events"></div>
      <script>
        const eventSource = new EventSource('/events');
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const eventsDiv = document.getElementById('events');
          eventsDiv.innerHTML += \`
            <p>Timestamp: \${data.timestamp}<br>
            Message: \${data.message}<br>
            Random Value: \${data.randomValue}</p>
          \`;
        };
      </script>
    </body>
    </html>
  `);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
