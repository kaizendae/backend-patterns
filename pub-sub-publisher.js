const amqp = require("amqplib");

connect();

// Create a message sending function
function createMessageSender(channel) {
  return setInterval(async () => {
    // This code runs every 1000ms (1 second):
    try {
      const message = `Hello RabbitMQ! ${new Date().toISOString()}`;
      await channel.sendToQueue("jobs", Buffer.from(JSON.stringify(message)));
      console.log(`Message sent successfully: ${message}`);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, 1000);  // 1000ms = 1 second
}

// Update the connect function
async function connect() {
  let connection;
  let channel;
  let intervalId;

  try {
    console.log("Connecting to RabbitMQ server...");
    const amqpServer = "amqps://lqwqaiju:17smJMjxLIFJYTZK8cNrlwBen1Qqf5Nq@sparrow.rmq.cloudamqp.com/lqwqaiju";
    
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("jobs");

    // Start sending messages
    intervalId = createMessageSender(channel);

    // Graceful shutdown
    process.on('SIGINT', async () => {
      clearInterval(intervalId);
      await channel.close();
      await connection.close();
      console.log('\nGracefully shutting down...');
      process.exit(0);
    });

  } catch (error) {
    console.error("Connection error:", error);
    if (intervalId) clearInterval(intervalId);
    if (channel) await channel.close();
    if (connection) await connection.close();
    process.exit(1);
  }
}
