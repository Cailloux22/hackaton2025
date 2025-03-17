import { Group } from "../models/group";
import { Callback, EventService } from "./eventService";

export class EventServiceAPI implements EventService {
    private currentGroup: Group | undefined

    async newEvent(callback: Callback): Promise<void> {

        setInterval(async () => {
            const raw = await fetch('localhost:8080/groups/current')
            const data: Group = await raw.json()
            if (data != this.currentGroup) {
                callback.newEvent(data)
                this.currentGroup = data
            }
        }, 200)

    }

    async getEvents(): Promise<Array<Group>> {
        const raw = await fetch('localhost:8080/groups/')
        const data: Array<Group> = await raw.json()
        return data
    }
}
