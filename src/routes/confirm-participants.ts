import { FastifyInstance } from "fastify";
import {  ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import 'dayjs/locale/pt-br'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";

dayjs.locale('pt-br')
dayjs.extend(localizedFormat)

export async function confirmParticipants(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId/confirm', {
        schema: {
           params: z.object({
                participantId: z.string().uuid()
           })
        }
    }, async  (request, reply) => {
        const { participantId } = request.params

        const participant = await prisma.participant.findUnique({
            where: {
                id: participantId
            }
        })
        
        if(!participant) {
            throw new Error('Participant not found')
        }

        if(participant.is_confirmed) {
            throw new Error('Participant already confirmed')
        }

        await prisma.participant.update({
            where: {
                id: participantId
            },
            data: {
                is_confirmed: true
            }
        })
     
        return reply.status(204).send({ message: 'Trip confirmed' })
    })
}