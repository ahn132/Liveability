'use strict'

import cors from '@fastify/cors'

export default async function (fastify, opts) {

  //register CORS
  await fastify.register(cors, {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })

  //define routes
  fastify.get('/', async (request, reply) => {
    return { message: "server says hello again" }
  })
}