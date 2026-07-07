import router from "express";
import {
  getWorkflowExecutionsController,
  getExecutionDetailController,
  getLatestExecutionController,
} from "./execution.controller.ts";

export const executionRouter = router.Router();

/**
 * @openapi
 * /api/v1/workflows/workflows/{workflowId}/executions:
 *   get:
 *     tags:
 *       - Executions
 *     summary: Get all executions for a workflow
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the workflow
 *     responses:
 *       200:
 *         description: Executions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Execution'
 *       400:
 *         description: Invalid workflow ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Workflow not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
executionRouter.get("/workflows/:workflowId/executions", getWorkflowExecutionsController);

/**
 * @openapi
 * /api/v1/workflows/workflows/{workflowId}/executions/latest:
 *   get:
 *     tags:
 *       - Executions
 *     summary: Get the latest execution for a workflow
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the workflow
 *     responses:
 *       200:
 *         description: Latest execution retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Execution'
 *       400:
 *         description: Invalid workflow ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Workflow not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
executionRouter.get("/workflows/:workflowId/executions/latest", getLatestExecutionController);

/**
 * @openapi
 * /api/v1/workflows/workflows/{workflowId}/executions/{executionId}:
 *   get:
 *     tags:
 *       - Executions
 *     summary: Get node-level execution detail for a specific execution
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the workflow
 *       - in: path
 *         name: executionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the execution
 *     responses:
 *       200:
 *         description: Execution detail retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/NodeExecution'
 *       400:
 *         description: Invalid workflow or execution ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Workflow not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
executionRouter.get("/workflows/:workflowId/executions/:executionId", getExecutionDetailController);
