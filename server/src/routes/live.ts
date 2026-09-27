import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { GEMINI_LIVE_SYSTEM_PROMPT } from '../agent/prompts';
import { agentToolDeclarations } from '../agent/schemas';
import { executeTool } from '../agent/orchestrator';

export const liveRouter = Router();

// POST /api/live/token - generates short-lived ephemeral token for Gemini Live WebSocket
liveRouter.post('/token', async (_req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please ensure the API key is set.',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { apiVersion: 'v1alpha' },
    });

    // 30 min max session, 5 min window to initiate WebSocket
    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const newSessionExpireTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime,
        newSessionExpireTime,
      },
    });

    res.json({
      success: true,
      token: token.name,
      model: 'gemini-3.8-live',
      systemInstruction: GEMINI_LIVE_SYSTEM_PROMPT,
      tools: agentToolDeclarations,
    });
  } catch (error: any) {
    console.error('Failed to create Gemini Live ephemeral token:', error);
    res.status(500).json({
      error: error.message || 'Failed to create Gemini Live ephemeral token',
    });
  }
});

// POST /api/live/execute-tool - secure backend tool executor for Gemini Live function calling
liveRouter.post('/execute-tool', async (req: Request, res: Response) => {
  try {
    const { toolName, args, incidentId } = req.body;
    if (!toolName) {
      return res.status(400).json({ error: 'toolName is required' });
    }

    // Whitelist check: ONLY approved BharatPulse operational tools
    const allowedTools = [
      'createIncident',
      'getIncidentStatus',
      'classifyIncident',
      'findNearbyCriticalPlaces',
      'findAvailableResponseTeams',
      'calculateResponseRoute',
      'createWorkOrder',
      'notifyResponseTeam',
      'updateIncidentStatus',
      'detectIncidentClusters',
      'requestVerification',
      'verifyResolution',
      'escalateIncident',
      'generateIncidentReport',
    ];

    if (!allowedTools.includes(toolName)) {
      return res.status(403).json({ error: `Tool "${toolName}" is not permitted.` });
    }

    const safeArgs = args && typeof args === 'object' ? args : {};
    const result = await executeTool(toolName, safeArgs, incidentId);

    res.json({
      success: true,
      tool: toolName,
      result,
    });
  } catch (error: any) {
    console.error(`Error executing Live tool ${req.body?.toolName}:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Tool execution failed',
    });
  }
});

// GET /api/live/tools - approved tool declarations
liveRouter.get('/tools', (_req: Request, res: Response) => {
  res.json({ tools: agentToolDeclarations });
});
