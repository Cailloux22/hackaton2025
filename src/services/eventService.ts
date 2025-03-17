import { Group } from "../models/group";

export interface Callback {
    newEvent: (newParty: Group) => void
}

export interface EventService {
    newEvent(callback: Callback): void
    getEvents(): Promise<Array<Group>>
}
