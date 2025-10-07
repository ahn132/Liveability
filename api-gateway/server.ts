import cors from '@fastify/cors';
import Fastify, { FastifyInstance, FastifyPluginOptions } from 'fastify';
import userRoutes from './routes/userRoutes.js';
import 'dotenv/config';

//Environment variables
const PORT = process.env.PORT!
const HOST = process.env.HOST!
const FRONTEND_URL = process.env.FRONTEND_URL!

//Root Plugin Function
async function rootPlugin(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
  // Register CORS plugin
  await fastify.register(cors, {
    origin: [FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  });

  // Health check route
  fastify.get('/', async (request, reply) => {
    return { 
      message: "API Gateway is running", 
      timestamp: new Date().toISOString() 
    };
  });

  // Register user routes plugin
  await fastify.register(userRoutes);
}

// Create and start server
async function start() {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',  // Makes logs colorful and readable
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname'
        }
      }
    }
  });
  
  // Register routes
  await fastify.register(rootPlugin);
  
  // Start server
  try {
    await fastify.listen({ port: parseInt(PORT), host: HOST });
    console.log(`API Gateway listening on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
