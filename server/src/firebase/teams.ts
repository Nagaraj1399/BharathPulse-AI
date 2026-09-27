import { civicStore } from './admin';
import { ResponseTeam, WorkOrder } from '../../../shared/types';

export const teamsDb = {
  getAll: () => civicStore.getTeams(),
  getById: (id: string) => civicStore.getTeamById(id),
  update: (team: ResponseTeam) => civicStore.updateTeam(team),
  assignToIncident: (teamId: string, _incidentId: string) => {
    const team = civicStore.getTeamById(teamId);
    if (team) {
      team.availability = 'DISPATCHED';
      team.currentLoad += 1;
      civicStore.updateTeam(team);
    }
    return team;
  },
  releaseTeam: (teamId: string) => {
    const team = civicStore.getTeamById(teamId);
    if (team) {
      team.availability = 'AVAILABLE';
      team.currentLoad = Math.max(0, team.currentLoad - 1);
      civicStore.updateTeam(team);
    }
    return team;
  },
  createWorkOrder: (order: WorkOrder): WorkOrder => {
    return civicStore.saveWorkOrder(order);
  },
  getWorkOrders: () => civicStore.getWorkOrders(),
};
