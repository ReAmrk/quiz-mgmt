import { IBaseEntity } from "../domain/IBaseEntity";
import { BaseService } from "./BaseService";

export abstract class BaseEntityService<TEntity extends IBaseEntity> extends BaseService {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async getAll(jwt: string): Promise<TEntity[] | undefined> {
        try {
            const response = await this.axios.get<TEntity[]>('',
                {
                    headers: {
                        'Authorization': 'Bearer ' + jwt
                    }
                }
            );

            console.log('response', response);
            if (response.status === 200) {
                return response.data;
            }
            return undefined;
        } catch (e) {
            console.log('error: ', (e as Error).message);
            return undefined;
        }
    }

    async create(jwt: string, entity: TEntity): Promise<TEntity | undefined> {
        try {
            const response = await this.axios.post('', entity, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            console.log('response', response);
            return response.data as TEntity;
        } catch (e) {
            console.log('error: ', (e as Error).message);
            return undefined;
        }
    }

    async delete(jwt: string, id: string) {
        try {
            await this.axios.delete(`${id}`, {
                headers: { Authorization: `Bearer ${jwt}`}
            })
        } catch (e) {
            console.log('error: ', (e as Error).message);
        }
    }

    async update(jwt: string, id: string, entity: TEntity): Promise<TEntity | undefined> {
        try {
            const response = await this.axios.put(`${id}`, entity, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            console.log('response', response);
            return response.data as TEntity;
        } catch (e) {
            console.log('error: ', (e as Error).message);
            return undefined;
        }
    }
}
