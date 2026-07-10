import app from "./app.ts";
import { config } from "./config/config.ts";
import { httpResponse } from "./utils/httpResponse.ts";
import { SUCCESS_MESSAGES } from "./constants/messages.ts";
import logger from "./utils/logger.ts";
import { attachExecutionSocket } from "./ws/executionSocket.ts";
import "./workers/VerificationMailworker.ts";
import "./workers/WorkflowExecutionWorker.ts";

const server = app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});

attachExecutionSocket(server);

app.get("/health", (req, res) => {
  return httpResponse(res, req, 200, SUCCESS_MESSAGES.SERVER_RUNNING);
});
