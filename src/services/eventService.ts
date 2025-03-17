import { Party } from "../models/party";


export abstract class EventSeviceStub {
    constructor(
        private readonly partys: Party[] = [],
        private readonly statusSwitchFunction: (updatedParty: Party) => void
    ) {
        setTimeout(() => statusSwitchFunction({
            date: new Date(),
            inProgress: true,
            name: "test"
        }), 3000)
    }

    getPartys(): Party[] {
        return this.partys;
    }
}