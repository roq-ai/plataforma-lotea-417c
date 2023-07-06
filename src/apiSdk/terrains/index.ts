import axios from 'axios';
import queryString from 'query-string';
import { TerrainInterface, TerrainGetQueryInterface } from 'interfaces/terrain';
import { GetQueryInterface } from '../../interfaces';

export const getTerrains = async (query?: TerrainGetQueryInterface) => {
  const response = await axios.get(`/api/terrains${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTerrain = async (terrain: TerrainInterface) => {
  const response = await axios.post('/api/terrains', terrain);
  return response.data;
};

export const updateTerrainById = async (id: string, terrain: TerrainInterface) => {
  const response = await axios.put(`/api/terrains/${id}`, terrain);
  return response.data;
};

export const getTerrainById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/terrains/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTerrainById = async (id: string) => {
  const response = await axios.delete(`/api/terrains/${id}`);
  return response.data;
};
