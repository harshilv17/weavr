import router from "express";
import { triggerWebhookController } from "./webhook.controller.ts";

export const webhookRouter = router.Router();

/**
 * @openapi
 * /api/v1/webhooks/{token}:
 *   post:
 *     tags:
 *       - Webhooks
 *     summary: Trigger a workflow run via its webhook token
 *     description: Public endpoint (no authentication required). Resolves the webhook token to a workflow and queues a run, passing the request body, query, and headers as trigger override data.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Webhook token associated with a workflow trigger
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       202:
 *         description: Webhook received, workflow run queued
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: queued
 *       404:
 *         description: Webhook not found
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
webhookRouter.post("/:token", triggerWebhookController);
