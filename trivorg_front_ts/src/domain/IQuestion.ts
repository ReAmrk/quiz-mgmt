import { IBaseEntity } from "./IBaseEntity";
import { ICategory } from "./ICategory"

export interface IQuestion extends IBaseEntity {
    question: string;
    answer: string;
    difficulty: string;
    points: string;
    categoryId: string;
}