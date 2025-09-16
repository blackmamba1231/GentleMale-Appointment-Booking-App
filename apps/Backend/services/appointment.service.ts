import { db } from "db/client"
 
export async function bookAppointment(input:{ service: string, date: Date }, req: { user?: { id: string, role: 'CUSTOMER' | 'STYLIST' | 'ADMIN', sessionId: string }}){
    try{
        if(!req.user) throw new Error("UNAUTHENTICATED");
        if(req.user.role !== "CUSTOMER") throw new Error("FORBIDDEN");
        const user = await db.user.findUnique({ where: { id: req.user.id } });
        if(!user) throw new Error("USER_NOT_FOUND");
        const customerEmail = user.email;
        const customerPhone = user.phoneE164;
        const appointment = await db.appointment.create({
            data: {
                customerId: req.user.id,
                service: input.service,
                date: input.date,
                customerEmail: customerEmail,
                customerPhone: customerPhone
            }
        })
        return appointment;
    } catch (e){
        throw e;
    }
}