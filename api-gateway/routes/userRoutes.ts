import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import axios from 'axios';
import 'dotenv/config';

//Environment variables
const USER_SERVICE_URL = process.env.USER_SERVICE_URL!

// User routes plugin
async function userRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {

  // User registration
  fastify.post('/api/users/register', async (request, reply) => {

    if (!USER_SERVICE_URL) {
      reply.code(500);
      return { error: 'USER_SERVICE_URL is not set' };
    }

    return axios.post(`${USER_SERVICE_URL}/users/register`, request.body)
    .then(response => {
      fastify.log.info('User registration response:', response.data);
      return response.data;
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
      return response.data;
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

  // Save commute preferences
  fastify.post('/api/users/commute-preferences', async (request, reply) => {
    return axios.post(`${USER_SERVICE_URL}/users/commute-preferences`, request.body)
    .then(response => {
      return response.data;
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

  // Save housing preferences
  fastify.post('/api/users/housing-preferences', async (request, reply) => {
    return axios.post(`${USER_SERVICE_URL}/users/housing-preferences`, request.body)
    .then(response => {
      return response.data;
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

  // Save amenities preferences
  fastify.post('/api/users/amenities-preferences', async (request, reply) => {
    return axios.post(`${USER_SERVICE_URL}/users/amenities-preferences`, request.body)
    .then(response => {
      return response.data;
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
      return response.data;
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
