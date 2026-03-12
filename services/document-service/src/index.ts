import fastify from "./app";
import "./queue/worker"; // Start the Bull workers

const PORT = parseInt(process.env.PORT || "3002", 10);

const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Document Service running on port ${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
