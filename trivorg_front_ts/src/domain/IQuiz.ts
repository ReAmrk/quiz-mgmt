import { IBaseEntity } from "./IBaseEntity";
import { ICategory } from "./ICategory";

export interface IQuiz extends IBaseEntity {
    quiz_name: string;
    description: string;
    category: ICategory
}