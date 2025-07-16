import ampq from 'amqplib';


let channel : ampq.Channel;

export const connnectRabbitMQ = async() => {
    try {
        const connection = await ampq.connect({
            protocol: 'amqp',
            hostname: process.env.Rabbitmq_Host,
            port: 5672,
            username: process.env.Rabbitmq_Username,
            password: process.env.rabbitmq_Password,
        })

        channel = await connection.createChannel();

        console.log("👍👍 connected to rabbitmq");
    } catch (error) {
        console.log("Failed to connect to rabbitmq", error);
        
    }
}