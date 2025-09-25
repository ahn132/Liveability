import cors from '@fastify/cors';
import Fastify, { FastifyInstance, FastifyPluginOptions } from 'fastify';

interface ApiResponse {
  message: string;
  timestamp: string;
}

interface UserServiceResponse {
  user?: {
    id: number;
    name: string;
    email: string;
  };
  error?: string;
}

// Plugin function
async function routes(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
  // Register CORS
  await fastify.register(cors, {
    origin: ["http://localhost:3002", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  });

  // Health check
  fastify.get<{ Reply: ApiResponse }>('/', async (request, reply): Promise<ApiResponse> => {
    return { 
      message: "API Gateway is running", 
      timestamp: new Date().toISOString() 
    };
  });

  // User service routes
  fastify.register(async function (fastify) {
    // User registration
    fastify.post('/api/users/register', async (request, reply) => {
      try {
        const response = await fetch('http://localhost:3001/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request.body)
        });
        
        const data = await response.json() as UserServiceResponse;
        
        if (!response.ok) {
          reply.code(response.status);
          return data;
        }
        
        return data;
      } catch (error) {
        fastify.log.error(error);
        reply.code(500);
        return { error: 'Service unavailable' };
      }
    });

    // User login
    fastify.post('/api/users/login', async (request, reply) => {
      try {
        const response = await fetch('http://localhost:3001/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request.body)
        });
        
        const data = await response.json() as UserServiceResponse;
        
        if (!response.ok) {
          reply.code(response.status);
          return data;
        }
        
        return data;
      } catch (error) {
        fastify.log.error(error);
        reply.code(500);
        return { error: 'Service unavailable' };
      }
    });

    // Get user by ID
    fastify.get('/api/users/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      
      try {
        const response = await fetch(`http://localhost:3001/users/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json() as UserServiceResponse;
        
        if (!response.ok) {
          reply.code(response.status);
          return data;
        }
        
        return data;
      } catch (error) {
        fastify.log.error(error);
        reply.code(500);
        return { error: 'Service unavailable' };
      }
    });
  });
}

// Create and start server
async function start() {
  const fastify = Fastify({
    logger: {
      level: 'info'
    }
  });
  
  // Register routes
  await fastify.register(routes);
  
  // Start server
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('API Gateway listening on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
