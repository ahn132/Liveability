import Fastify from 'fastify';
import cors from '@fastify/cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './database.js';
import 'dotenv/config';

interface User {
  id: number;
  email: string;
  password: string;
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  location: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface CommutePreferencesRequest {
  commutePreferences: {
    workLocation: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    maxCommuteTime: number;
    transportationMethod: string;
  };
}

interface HousingPreferencesRequest {
  housingPreferences: {
    homeType: string;
    rentOrBuy: string;
    rentPriceMin: number;
    rentPriceMax: number;
    buyPriceMin: number;
    buyPriceMax: number;
    bedrooms: number;
    bathrooms: number;
    parking: string;
  };
}

interface AmenitiesPreferencesRequest {
  amenitiesPreferences: {
    interests: string[];
    location: string;
    lifestyle: string[];
    goodSchoolDistrict: boolean;
    proximityToAmenities: string;
  };
}

// Environment variables
const PORT = process.env.PORT!
const HOST = process.env.HOST!
const JWT_SECRET = process.env.JWT_SECRET!
const SALT_ROUNDS = 12;

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
  const { email, password } = request.body as RegisterRequest;

  console.log('Register request:', request.body);
  
  try {
    // Validate input
    if (!email || !password) {
      reply.code(400);
      return { error: 'Email and password are required' };
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
      data: { email, password: hashedPassword}
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
        email: user.email,
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
      user,
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
      select: { id: true, email: true}
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

// Save commute preferences
fastify.post('/users/commute-preferences', async (request, reply) => {
  const { commutePreferences } = request.body as CommutePreferencesRequest;
  
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.code(401);
      return { error: 'Authorization token required' };
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify and decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    
    // Update user with commute preferences
    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: { 
        street: commutePreferences.workLocation.street,
        city: commutePreferences.workLocation.city,
        state: commutePreferences.workLocation.state,
        zipCode: commutePreferences.workLocation.zipCode,
        maxCommuteTime: commutePreferences.maxCommuteTime,
        transportationMethod: commutePreferences.transportationMethod
      }
    });
    
    return { success: true, user: { id: user.id, email: user.email } };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      reply.code(401);
      return { error: 'Invalid token' };
    }
    fastify.log.error(error);
    reply.code(500);
    return { error: 'Failed to save commute preferences' };
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
