import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const startSendOtpConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: 'amqp',
      hostname: process.env.Rabbitmq_Host,
      port: 5672,
      username: process.env.Rabbitmq_Username,
      password: process.env.rabbitmq_Password,
    })

    const channel = await connection.createChannel();

    const queueName = "send-otp"

    await channel.assertQueue(queueName, { durable: true });

    console.log("👍👍Mail service of consumer stared, listening for otp emails");

    channel.consume(queueName, async (msg) => {
      try {
        if (msg) {
          const { to, subject, body } = JSON.parse(msg.content.toString())
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: process.env.USER,
              pass: process.env.PASSWORD,
            },
            tls: {
              rejectUnauthorized: false,
            },
          })
          await transporter.sendMail({
            from: "Chat App",
            to,
            subject,
            text: body,
          })
          console.log(`OTP mail sent to ${to}`);
          channel.ack(msg);
        }
      } catch (error) {
        console.log("Failed to send the OTP", error)
      }
    })
  } catch (error) {
    console.log("Failed")
  }
}