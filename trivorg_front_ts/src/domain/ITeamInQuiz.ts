import { IBaseEntity } from "./IBaseEntity";
import { IQuiz } from "./IQuiz";
import { ITeam } from "./ITeam";

export interface ITeamInQuiz extends IBaseEntity {
    team: ITeam;
    quiz: IQuiz;
}