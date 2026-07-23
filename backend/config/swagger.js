const swaggerJSDoc = require('swagger-jsdoc');
const { port } = require('./dbConfig');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Astra CRM Enterprise API Documentation',
      version: '1.0.0',
      description: 'Production-ready modular REST API endpoints for Astra CRM',
      contact: {
        name: 'Astra CRM Platform Engineering Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
