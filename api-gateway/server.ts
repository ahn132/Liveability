import cors from '@fastify/cors';
import Fastify, { FastifyInstance, FastifyPluginOptions } from 'fastify';
import userRoutes from './routes/userRoutes.js';

//Environment variables
const PORT = process.env.PORT!
const HOST = process.env.HOST!
const FRONTEND_URL = process.env.FRONTEND_URL!
const FRONTEND_DEV_URL = process.env.FRONTEND_DEV_URL!

//Root Plugin Function
async function rootPlugin(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
  // Register CORS plugin
  await fastify.register(cors, {
    origin: [FRONTEND_URL, FRONTEND_DEV_URL],
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
      level: 'info'
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
