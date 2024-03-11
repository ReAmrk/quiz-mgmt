import axios from "axios";
import { IParticipant } from "../domain/IParticipant";
import { BaseEntityService } from "./BaseEntityService";

export class ParticipantService extends BaseEntityService<IParticipant> {
    constructor(){
        super('/participants');
    }
  }
