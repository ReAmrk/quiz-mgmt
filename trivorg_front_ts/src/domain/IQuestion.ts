import { IBaseEntity } from "./IBaseEntity";
import { ICategory } from "./ICategory"

export interface IQuestion extends IBaseEntity {
    question: string;
    answer: string;
    difficulity: string;
    points: string;
    category: ICategory
}