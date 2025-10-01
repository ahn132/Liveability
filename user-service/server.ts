import Fastify from 'fastify';
import cors from '@fastify/cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

// Environment variables
const PORT = process.env.PORT || '3001';
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 12;

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
    // Validate input
    if (!name || !email || !password) {
      reply.code(400);
      return { error: 'Name, email, and password are required' };
    }
    
    if (password.length < 6) {
      reply.code(400);
      return { error: 'Password must be at least 6 characters long' };
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      reply.code(400);
      return { error: 'User with this email already exists' };
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return { 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      },
      token
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
    // Validate input
    if (!email || !password) {
      reply.code(400);
      return { error: 'Email and password are required' };
    }
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      reply.code(401);
      return { error: 'Invalid credentials' };
    }
    
    // Compare hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      reply.code(401);
      return { error: 'Invalid credentials' };
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return { 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      },
      token
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
    await fastify.listen({ port: parseInt(PORT), host: HOST });
    console.log(`User service listening on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
