import { civicStore } from './admin';
import { AgentAction, NotificationItem } from '../../../shared/types';

export const actionsDb = {
  logAction: (action: Omit<AgentAction, 'id' | 'timestamp'>): AgentAction => {
    const newAction: AgentAction = {
      ...action,
      id: `ACT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    };
    return civicStore.logAction(newAction);
  },
  getActions: (incidentId?: string) => civicStore.getActions(incidentId),
  logNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp'>): NotificationItem => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    };
    return civicStore.logNotification(newNotif);
  },
  getNotifications: (incidentId?: string) => civicStore.getNotifications(incidentId),
};
