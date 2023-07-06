import { TaskInterface } from 'interfaces/task';
import { TerrainInterface } from 'interfaces/terrain';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface ProjectInterface {
  id?: string;
  name: string;
  status: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  task?: TaskInterface[];
  terrain?: TerrainInterface[];
  organization?: OrganizationInterface;
  _count?: {
    task?: number;
    terrain?: number;
  };
}

export interface ProjectGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  status?: string;
  organization_id?: string;
}
