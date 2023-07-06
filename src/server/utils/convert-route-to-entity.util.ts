const mapping: Record<string, string> = {
  organizations: 'organization',
  projects: 'project',
  tasks: 'task',
  terrains: 'terrain',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
