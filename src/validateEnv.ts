import Joi from 'joi';

// Define the schema
const envVarsSchema = Joi.object({
     VITE_APP_API_BASE_URL: Joi.string().uri().required(),
     //VITE_API_KEY: Joi.string().required(),
}).unknown(true); 

// Access environment variables from import.meta.env
const envVars = {
     VITE_APP_API_BASE_URL: import.meta.env.VITE_APP_API_BASE_URL,
     //VITE_API_KEY: import.meta.env.VITE_API_KEY,
};

// Validate the environment variables
const { error } = envVarsSchema.validate(envVars, { abortEarly: false });

if (error) {
     throw new Error(`Config validation error: ${error.message}`);
}

export default envVars;
