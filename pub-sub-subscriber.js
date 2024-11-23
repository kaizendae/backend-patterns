const amqp = require("amqplib");

const msg = { message: `Hello RabbitMQ!  ${new Date().toISOString()}` };

connect();

async function connect() {
  try {
    console.log("Connecting to RabbitMQ server...");
    const amqpServer =
      "amqps://lqwqaiju:17smJMjxLIFJYTZK8cNrlwBen1Qqf5Nq@sparrow.rmq.cloudamqp.com/lqwqaiju";
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();

    connection.on("error", (err) => {
      console.error("Connection error:", err.message);
    });

    channel.on("error", (err) => {
      console.error("Channel error:", err.message);
    });

    await channel.assertQueue("jobs", {
      durable: true,
    });

    console.log(`waiting for messages...`);

    await channel.consume("jobs", async (msg) => {
      if (!msg) {
        console.warn("Received null message");
        return;
      }

      try {
        const content = JSON.parse(msg.content.toString());
        console.log("Received job: ", content);

        // Process message here
        console.log("Processed job: ", content);

        // Acknowledge message
        channel.ack(msg);
      } catch (error) {
        console.error("Error processing message: ", error);
        // Reject message and requeue if processing fails
        channel.nack(msg, false, true);
      }
    });


  } catch (error) {
    console.error(error);
  }
}
