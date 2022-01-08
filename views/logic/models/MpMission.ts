import { MpFleetMissionType } from "./MpFleetMission"

type MpPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

type MpType = 1 | 2 | 3

export class MpMission {
    galaxy?: number
    system?: number
    position?: MpPosition
    type?: MpType

    planetId?: string
    mission?: MpFleetMissionType 

    constructor(
        public velocity: number = 0
    ){}

    getDestinationCoords() {
        return [this.galaxy, this.system, this.position].some(x => !x )
            ? '[-:-:-]'
            : `[${this.galaxy}:${this.system}:${this.position}]`
    }

}