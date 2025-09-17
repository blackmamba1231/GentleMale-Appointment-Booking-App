import { db } from "db/client"
import { sendEmail } from "../utils/utils";
 
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
export async function getMyAppointments(req: { user?: { id: string, role: 'CUSTOMER' | 'STYLIST' | 'ADMIN', sessionId: string }}){
    try{
        if(!req.user) throw new Error("UNAUTHENTICATED");
        if(req.user.role !== "CUSTOMER") throw new Error("FORBIDDEN");
        const appointments = await db.appointment.findMany({ where: { customerId: req.user.id } });
        if(!appointments) throw new Error("APPOINTMENTS_NOT_FOUND");
        return appointments;
    } catch (e){
        throw e;
    }
}
export async function cancelAppointment(params:{ id: string },req: { user?: { id: string, role: 'CUSTOMER' | 'STYLIST' | 'ADMIN', sessionId: string }}){
    try{
        if(!req.user) throw new Error("UNAUTHENTICATED");
        if(req.user.role !== "CUSTOMER") throw new Error("FORBIDDEN");
        const appointment = await db.appointment.findUnique({ where: { customerId: req.user.id, id: params.id } });
        if(!appointment) throw new Error("APPOINTMENT_NOT_FOUND");
        await db.appointment.delete({ where: { customerId: req.user.id, id: params.id } });
        return appointment;
    } catch (e){
        throw e;
    }
}
export async function getAllAppointments(req: { user?: { id: string, role: 'CUSTOMER' | 'STYLIST' | 'ADMIN', sessionId: string }}){
    try{
        if(!req.user) throw new Error("UNAUTHENTICATED");
        if(req.user.role !== "ADMIN" && req.user.role !== "STYLIST") throw new Error("FORBIDDEN");
        const appointments = await db.appointment.findMany({ where: { expired: false } });
        return appointments;
    } catch (e){
        throw e;
    }
}
export async function confirmAppointment(params:{ id: string },req: { user?: { id: string, role: 'CUSTOMER' | 'STYLIST' | 'ADMIN', sessionId: string }}){
    try{
        if(!req.user) throw new Error("UNAUTHENTICATED");
        if(req.user.role !== "ADMIN" && req.user.role !== "STYLIST") throw new Error("FORBIDDEN");
        const appointment = await db.appointment.update({ where: { id: params.id }, data: { confirmed: true } });
        const user = await db.user.findUnique({ where: { id: appointment.customerId } });
        await sendEmail("Your appointment has been confirmed on " + appointment.date.toLocaleDateString() + " at " + appointment.date.toLocaleTimeString() + " with " + appointment.service + " service", user?.email!, "Your appointment has been confirmed");
        return appointment;
    } catch (e){
        throw e;
    }
}