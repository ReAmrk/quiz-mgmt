import { IBaseEntity } from "./IBaseEntity";
import { ITeam } from "./ITeam"

export interface IParticipant extends IBaseEntity {
    first_name: string;
    last_name: string;
    email: string;
    team?: ITeam;
}
