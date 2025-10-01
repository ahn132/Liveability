import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import axios from 'axios';

interface UserServiceResponse {
  user?: {
    id: number;
    name: string;
    email: string;
  };
  error?: string;
}

//Environment variables
const USER_SERVICE_URL = process.env.USER_SERVICE_URL!

// User routes plugin
async function userRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {

  // User registration
  fastify.post('/api/users/register', async (request, reply) => {
    return axios.post(`${USER_SERVICE_URL}/users/register`, request.body)
    .then(response => {
      return response.data as UserServiceResponse;
    })
    .catch(error => {
      fastify.log.error(error);
      if (error.response) {
        reply.code(error.response.status);
        return error.response.data;
      }
      reply.code(500);
      return { error: 'Service unavailable' };
    });
  });

  // User login
  fastify.post('/api/users/login', async (request, reply) => {
    return axios.post(`${USER_SERVICE_URL}/users/login`, request.body)
    .then(response => {
      return response.data as UserServiceResponse;
    })
    .catch(error => {
      fastify.log.error(error);
      if (error.response) {
        reply.code(error.response.status);
        return error.response.data;
      }
      reply.code(500);
      return { error: 'Service unavailable' };
    });
  });

  // Get user by ID
  fastify.get('/api/users/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    return axios.get(`${USER_SERVICE_URL}/users/${id}`)
    .then(response => {
      return response.data as UserServiceResponse;
    })
    .catch(error => {
      fastify.log.error(error);
      if (error.response) {
        reply.code(error.response.status);
        return error.response.data;
      }
      reply.code(500);
      return { error: 'Service unavailable' };
    });
  });
}

export default userRoutes;
