// backend/config/middlewares.js
// 🌐 STRAPI MIDDLEWARE CONFIGURATION with CORS

module.exports = [
  'strapi::errors',
  'strapi::security',
  
  // ===============================
  // CORS CONFIGURATION
  // ===============================
  {
    name: 'strapi::cors',
    config: {
      // Erlaubte Origins (Frontend URLs)
      origin: [
        'http://localhost:3000',      // Next.js Development
        'http://127.0.0.1:3000',     // Alternative localhost
        'https://your-domain.com',   // Production Domain (anpassen!)
        'https://www.your-domain.com' // Production Domain mit www
      ],
      
      // Erlaubte HTTP Methods
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      
      // Erlaubte Headers
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'X-Requested-With',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
      ],
      
      // Credentials (Cookies, Authorization headers) erlauben
      credentials: true,
      
      // Preflight Cache Duration (in Sekunden)
      maxAge: 86400, // 24 Stunden
      
      // Expose Headers to Frontend
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      
      // Keep alive for preflight requests
      keepHeadersOnError: true,
    },
  },
  
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];