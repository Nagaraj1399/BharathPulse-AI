import { Router, Request, Response } from 'express';
import { runAgentOrchestration, executeTool } from '../agent/orchestrator';
import { civicStore } from '../firebase/admin';

export const agentRouter = Router();

// POST /api/agent/run
agentRouter.post('/run', async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.body;
    if (!incidentId) {
      return res.status(400).json({ error: 'incidentId is required' });
    }

    const result = await runAgentOrchestration(incidentId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/agent/tool
agentRouter.post('/tool', async (req: Request, res: Response) => {
  try {
    const { tool, args, incidentId } = req.body;
    if (!tool) {
      return res.status(400).json({ error: 'Tool name is required' });
    }

    const result = await executeTool(tool, args || {}, incidentId);
    res.json({
      success: true,
      tool,
      result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/agent/actions
agentRouter.get('/actions', (req: Request, res: Response) => {
  const incidentId = req.query.incidentId as string | undefined;
  const actions = civicStore.getActions(incidentId);
  res.json(actions);
});

// GET /api/agent/notifications
agentRouter.get('/notifications', (req: Request, res: Response) => {
  const incidentId = req.query.incidentId as string | undefined;
  const notifs = civicStore.getNotifications(incidentId);
  res.json(notifs);
});
