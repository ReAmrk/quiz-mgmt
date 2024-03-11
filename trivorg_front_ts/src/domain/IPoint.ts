import { IBaseEntity } from "./IBaseEntity";
import { ITeam } from "./ITeam"
import { IQuiz } from "./IQuiz"

export interface IPoint extends IBaseEntity {
    points: string;
    team?: ITeam;
    quiz?: IQuiz;
}