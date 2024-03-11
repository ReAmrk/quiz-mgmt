import { IBaseEntity } from "./IBaseEntity";
import { IQuestion } from "./IQuestion";
import { IQuiz } from "./IQuiz";

export interface IQuestionInQuiz extends IBaseEntity {
    question: IQuestion;
    quiz: IQuiz;
}