type MissionCode = "fleet-save" | "move-to-planet" | "move-to-moon" | "collect-to-main";

type BaseMission = {
    code: MissionCode;
}

type Mission = {
    planetList: string[]
} & BaseMission;

type CollectMission = {
    code: "collect-to-main";
    destination: string; 
} & Mission;