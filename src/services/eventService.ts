import { Party } from "../models/party";

export interface Callback {
    newEvent: (newParty: Party) => void
}

export interface EventService {
    newEvent(callback: Callback): void
    getEvents(): Promise<Array<Party>>
}

export class EventSeviceStub implements EventService {
    newEvent(callback: Callback): void {
        setTimeout(() => callback.newEvent({
            name: "Nouveau group"
        }), 5000)
    }
    getEvents(): Promise<Array<Party>> {
        return Promise.resolve([])
    }
}

