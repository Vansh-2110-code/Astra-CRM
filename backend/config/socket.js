const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./dbConfig');

let ioInstance;

function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication Middleware inside Socket.IO
  ioInstance.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid Token'));
    }
  });

  ioInstance.on('connection', (socket) => {
    const tenantId = socket.user.tenantId;
    console.log(`🔌 Client connected to Socket.IO. User: ${socket.user.email}, Tenant: ${tenantId}`);

    // Join tenant-specific channel room for data isolation
    socket.join(tenantId);

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected from Socket.IO. User: ${socket.user.email}`);
    });
  });

  return ioInstance;
}

function getIo() {
  return ioInstance;
}

// Scoped multi-tenant event emitter helper
function emitToTenant(tenantId, event, data) {
  if (ioInstance) {
    ioInstance.to(tenantId).emit(event, data);
  }
}

module.exports = {
  initSocket,
  getIo,
  emitToTenant
};
