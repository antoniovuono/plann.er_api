import fastify from 'fastify';
import { createTrip } from './routes/create-trip';
import cors from "@fastify/cors";

import { serializerCompiler, validatorCompiler} from "fastify-type-provider-zod";
import { confirmTrip } from './routes/confirm-trip';

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)
app.register(confirmTrip)

app.listen({ port: 3333}).then(() => {
    console.log('Server is running on port 3333')
}) 