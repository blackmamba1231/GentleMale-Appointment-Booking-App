import { db } from "db/client"
 
export async function bookAppointment(input:{ service: String }, req: { user?: { id: string, role: 'CUSTOMER' | 'STYLIST' | 'ADMIN', sessionId: string }}){
    try{
        if(!req.user) throw new Error("UNAUTHENTICATED");
        if(req.user.role !== "CUSTOMER") throw new Error("FORBIDDEN");
        
    } catch (e){
        throw e;
    }
}