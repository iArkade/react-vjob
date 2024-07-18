import Joi from 'joi';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define the schema
const envVarsSchema = Joi.object({
     VITE_APP_API_BASE_URL: Joi.string().uri().required(),
     //VITE_API_KEY: Joi.string().required(),
}).unknown(true); 

// Validate the environment variables
const { error, value: envVars } = envVarsSchema.validate(process.env, { abortEarly: false });

if (error) {
     throw new Error(`Config validation error: ${error.message}`);
}

export default envVars;