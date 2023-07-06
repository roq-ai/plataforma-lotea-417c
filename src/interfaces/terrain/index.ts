import { ProjectInterface } from 'interfaces/project';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TerrainInterface {
  id?: string;
  contour: string;
  map_id?: string;
  surveyor_id?: string;
  created_at?: any;
  updated_at?: any;

  project?: ProjectInterface;
  user?: UserInterface;
  _count?: {};
}

export interface TerrainGetQueryInterface extends GetQueryInterface {
  id?: string;
  contour?: string;
  map_id?: string;
  surveyor_id?: string;
}
