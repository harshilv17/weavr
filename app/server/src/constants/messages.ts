export const ERROR_MESSAGES = {
  // Auth
  USER_ALREADY_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",
  INVALID_PASSWORD: "Username or password is incorrect",

  // Validation
  USERNAME_EMAIL_PASSWORD_REQUIRED: "Username, email and password are required",
  EMAIL_PASSWORD_REQUIRED: "Email and password are required",

  // Auth middleware
  UNAUTHORIZED: "Access token missing",
  INVALID_OR_EXPIRED_TOKEN: "Access token is invalid or expired",

  // Workflow
  WORKFLOW_NOT_FOUND: "Workflow not found",
  WORKFLOW_MISSING_FIELDS: "Name and description are required",
  WORKFLOW_INVALID_ID: "Invalid workflow ID",
  WORKFLOW_FORBIDDEN: "You do not have permission to delete this workflow",
  WORKFLOW_UPDATE_FORBIDDEN: "You do not have permission to update this workflow",
  WORKFLOW_GRAPH_INVALID: "graphJson with nodes and edges arrays is required",
  WORKFLOW_TOO_MANY_NODES: "Workflow exceeds the maximum allowed number of nodes",
  WORKFLOW_GRAPH_INVALID_EDGES:
    "Each node may have at most one incoming and one outgoing connection, and trigger nodes cannot have incoming connections",

  // Server
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  RATE_LIMIT_EXCEEDED: "Too many requests. Please try again later.",

  //verification code
  VERIFICATION_CODE_EXPIRED: "Verification code has expired",
  INVALID_VERIFICATION_CODE: "Invalid verification code",

  // Schedule
  SCHEDULE_INTERVAL_TOO_SHORT: "Interval must be a whole number of seconds, minimum 60",

  // Webhook
  WEBHOOK_NOT_FOUND: "Webhook not found",

  // CSRF
  CSRF_TOKEN_INVALID: "Invalid or missing CSRF token",
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: "User created successfully",
  USER_SIGNED_IN: "User signed in successfully",
  USER_SIGNED_OUT: "User signed out successfully",
  SERVER_RUNNING: "Server is up and running",

  // Workflow
  WORKFLOWS_RETRIEVED: "Workflows retrieved successfully",
  WORKFLOW_RETRIEVED: "Workflow retrieved successfully",
  WORKFLOW_CREATED: "Workflow created successfully",
  WORKFLOW_DELETED: "Workflow deleted successfully",
  WORKFLOW_SAVED: "Workflow saved successfully",
  WORKFLOW_RUN_STARTED: "Workflow run started successfully",

  // Execution
  EXECUTIONS_RETRIEVED: "Executions retrieved successfully",
  EXECUTION_RETRIEVED: "Execution retrieved successfully",
  LATEST_EXECUTION_RETRIEVED: "Latest execution retrieved successfully",

  // Schedule
  SCHEDULE_STARTED: "Workflow schedule started successfully",
  SCHEDULE_STOPPED: "Workflow schedule stopped successfully",

  // Webhook
  WEBHOOK_TRIGGERED: "Webhook received, workflow run queued",

  // Triggers
  WORKFLOW_TRIGGERS_RETRIEVED: "Workflow triggers retrieved successfully",
} as const;
