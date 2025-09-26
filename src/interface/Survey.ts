import { IAmenity } from './Amenity';
import { ILocality } from './Locality';
import { IRating } from './Rating';

export interface ISurvey {
  name?: string;
  age: number;
  occupation: string;
  locality: ILocality;
  ratings: IRating;
  amenities: IAmenity;
  comments?: string;
  createdAt?: Date;
}
