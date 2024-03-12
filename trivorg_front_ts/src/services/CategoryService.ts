import axios from "axios";
import { ICategory } from "../domain/ICategory";
import { BaseEntityService } from "./BaseEntityService";

export class CategoryService extends BaseEntityService<ICategory> {
    constructor(){
        super('categories/');
    }
  }
