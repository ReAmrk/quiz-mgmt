import { IBaseEntity } from "./IBaseEntity";

export interface ICategory extends IBaseEntity {
    category_name: string;
    description: string;
}
