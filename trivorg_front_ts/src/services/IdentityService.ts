import { IJWTResponse } from "../dto/IJWTResponse";
import { ILoginData } from "../dto/ILoginData";
import { IRegisterData } from "../dto/IRegisterData";
import { BaseService } from "./BaseService";

export class IdentityService extends BaseService {
    constructor() {
        super('auth');
    }

    async register(data: IRegisterData): Promise<IJWTResponse | undefined> {
        try {
            const response = await this.axios.post<IJWTResponse>('register/', data);

            console.log('register response', response);
            if (response.status === 200) {
                return response.data;
            }
            return undefined;
        } catch (e) {
            console.log('error: ', (e as Error).message);
            return undefined;
        }
    }

    async login(data: ILoginData): Promise<IJWTResponse | undefined> {
        try {
            const response = await this.axios.post<IJWTResponse>('login/', data);

            console.log('login response', response);
            if (response.status === 200) {
                return response.data;
            }
            return undefined;
        } catch (e) {
            console.log('error: ', (e as Error).message);
            return undefined;
        }
    }

    async logout(data: IJWTResponse): Promise<true | undefined> {
        console.log(data);
        
        try {
            const response = await this.axios.post(
                'logout/', 
                data,
                {
                    headers: {
                        'Authorization': 'Bearer ' + data.access
                    }
                }
            );

            console.log('logout response', response);
            if (response.status === 200) {
                return true;
            }
            return undefined;
        } catch (e) {
            console.log('error: ', (e as Error).message);
            return undefined;
        }
    }

    async refreshToken(data: IJWTResponse): Promise<IJWTResponse | undefined> {
        console.log(data);
        
        try {
            const response = await this.axios.post<IJWTResponse>(
                'token/refresh/', 
                data
            );

            console.log('refresh token response', response);
            if (response.status === 200) {
                return response.data;
            }
            return undefined;
        } catch (e) {
            console.log('error: ', (e as Error).message);
            return undefined;
        }
    }


}
