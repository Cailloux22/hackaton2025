import { Group } from "../models/group";

export interface Callback {
    newEvent: (newParty: Group) => void
}

export interface GroupService {
    OnNewCurrentGroup(roomId: number, onNewCurrentGroupCallback: (newParty: Group) => void): void
    getGroups(roomId: number): Promise<Array<Group>>
}
