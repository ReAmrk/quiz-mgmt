import axios from "axios";
import { IQuestion } from "../domain/IQuestion";
import { BaseEntityService } from "./BaseEntityService";

export class QuestionService extends BaseEntityService<IQuestion> {
    constructor(){
        super('questions/');
    }
  }
