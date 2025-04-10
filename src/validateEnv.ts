import Joi from 'joi';

// Esquema de validación mejorado
const envVarsSchema = Joi.object({
     VITE_APP_API_BASE_URL: Joi.string()
          .uri({ scheme: ['http', 'https'] })
          .required()
          .messages({
               'string.uri': 'La URL de la API debe ser una URL válida',
               'any.required': 'La URL de la API es obligatoria'
          }),
     VITE_SITE_URL: Joi.string()
          .uri({ scheme: ['http', 'https'] })
          .default('http://localhost:3000')
}).unknown(true);

// Obtención de variables (compatible con Vite)
const envVars = {
     VITE_APP_API_BASE_URL: import.meta.env.VITE_APP_API_BASE_URL,
     VITE_SITE_URL: import.meta.env.VITE_SITE_URL
};

// Validación con mensajes detallados
const { error, value: validatedEnvVars } = envVarsSchema.validate(envVars, {
     abortEarly: false,
     stripUnknown: true
});

if (error) {
     // Mejores mensajes de error para desarrollo
     const errorMessages = error.details.map(detail => detail.message).join('\n');
     if (import.meta.env.DEV) {
          console.error('❌ Errores en variables de entorno:');
          console.error(errorMessages);
          console.error('\nAsegúrate de tener un archivo .env con estas variables:');
          console.error(`
               VITE_APP_API_BASE_URL=http://localhost:4000
               VITE_SITE_URL=http://localhost:3000
          `);
     }
     throw new Error(`Configuración inválida:\n${errorMessages}`);
}

export default validatedEnvVars;