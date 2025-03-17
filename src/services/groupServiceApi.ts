import { Group } from "../models/group";
import { GroupService } from "./groupService";
import { GroupServiceApiConstants } from "./groupService.constants";

export class GroupServiceAPI implements GroupService {
    private currentGroup: Group | undefined

    async OnNewCurrentGroup(roomId: number, onNewCurrentGroupCallback: (newParty: Group) => void): Promise<void> {
        this.getNewCurrentGroup(roomId, onNewCurrentGroupCallback)
        setInterval(async () => this.getNewCurrentGroup(roomId, onNewCurrentGroupCallback), GroupServiceApiConstants.onNewCurrentGroupDelay)
    }

    private async getNewCurrentGroup(roomId: number, onNewCurrentGroupCallback: (newParty: Group) => void) {
        const raw = await fetch(`${GroupServiceApiConstants.baseApiUrl}${GroupServiceApiConstants.onNewCurrentGroupEndpoint}?${GroupServiceApiConstants.roomQueryParamKey}=${roomId}`)
        const data: Group = await raw.json()
        if (data != this.currentGroup) {
            onNewCurrentGroupCallback(data)
            this.currentGroup = data
        }
    }

    async getGroups(roomId: number): Promise<Array<Group>> {
        const raw = await fetch(`${GroupServiceApiConstants.baseApiUrl}${GroupServiceApiConstants.getGroupsEndpoint}?${GroupServiceApiConstants.roomQueryParamKey}=${roomId}`)
        const data: Array<Group> = await raw.json()
        return data
    }
}
