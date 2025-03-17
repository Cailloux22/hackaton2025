import { Party } from "../models/party";
import { Callback, EventService } from "./eventService";

export class EventServiceAPI implements EventService {
    private currentGroup : Party |undefined
    
    async newEvent(callback: Callback): Promise<void> {
        
        setInterval(async () => {

            const raw = await fetch('localhost:8080/groups/current')
            const data : Party= await raw.json() 
            if(data!=this.currentGroup){
                callback.newEvent(data)
                this.currentGroup=data
            }
        }, 200)

    }

   async getEvents(): Promise<Array<Party>> {
        const raw = await fetch('localhost:8080/groups/')
        const data : Array<Party> = await raw.json() 
        return data
    }
}
