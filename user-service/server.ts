import Fastify from 'fastify';
import cors from '@fastify/cors';
import prisma from './database.js';

interface User {
  id: number;
  email: string;
  name: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

const fastify = Fastify({
  logger: true
});

// Register CORS
await fastify.register(cors, {
  origin: true,
  credentials: true
});

// Health check
fastify.get('/health', async (request, reply) => {
  return { 
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  };
});

// User registration
fastify.post('/users/register', async (request, reply) => {
  const { name, email, password } = request.body as RegisterRequest;
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      reply.code(400);
      return { error: 'User with this email already exists' };
    }
    
    const user = await prisma.user.create({
      data: { name, email, password }
    });
    
    return { 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    };
  } catch (error) {
    fastify.log.error(error);
    reply.code(500);
    return { error: 'User creation failed' };
  }
});

// User login
fastify.post('/users/login', async (request, reply) => {
  const { email, password } = request.body as LoginRequest;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || user.password !== password) {
      reply.code(401);
      return { error: 'Invalid credentials' };
    }
    
    return { 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    };
  } catch (error) {
    fastify.log.error(error);
    reply.code(500);
    return { error: 'Login failed' };
  }
});

// Get user by ID
fastify.get('/users/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    
    if (!user) {
      reply.code(404);
      return { error: 'User not found' };
    }
    
    return { user };
  } catch (error) {
    fastify.log.error(error);
    reply.code(500);
    return { error: 'Failed to fetch user' };
  }
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('User service listening on port 3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
