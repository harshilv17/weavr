import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Weavr API",
      version: "1.0.0",
      description: "Weavr workflow automation backend API",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
      schemas: {
        Execution: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            workflowId: { type: "integer", example: 1 },
            triggerId: { type: "integer", example: 1 },
            status: {
              type: "string",
              enum: ["pending", "running", "completed", "failed"],
              example: "completed",
            },
            startedAt: { type: "string", format: "date-time", nullable: true },
            completedAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        NodeExecution: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            executionId: { type: "integer", example: 1 },
            nodeId: { type: "string", example: "node-1" },
            nodeType: { type: "string", example: "http" },
            status: {
              type: "string",
              enum: ["pending", "running", "completed", "failed"],
              example: "completed",
            },
            inputJson: { type: "object", nullable: true },
            outputJson: { type: "object", nullable: true },
            startedAt: { type: "string", format: "date-time", nullable: true },
            completedAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Workflow: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 42 },
            name: { type: "string", example: "My Workflow" },
            description: { type: "string", example: "Automates data processing" },
            graphJson: { type: "object", nullable: true },
            status: { type: "string", enum: ["draft", "active", "completed"], example: "draft" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateWorkflowRequest: {
          type: "object",
          required: ["name", "description"],
          properties: {
            name: { type: "string", example: "My Workflow" },
            description: { type: "string", example: "Automates data processing" },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "johndoe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", format: "password", example: "secret123" },
          },
        },
        SigninRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", format: "password", example: "secret123" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            status: { type: "integer", example: 200 },
            message: { type: "string" },
            request: {
              type: "object",
              properties: {
                ip: { type: "string" },
                method: { type: "string" },
                url: { type: "string" },
              },
            },
            data: { type: "object", nullable: true },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            status: { type: "integer" },
            message: { type: "string" },
            request: {
              type: "object",
              properties: {
                ip: { type: "string" },
                method: { type: "string" },
                url: { type: "string" },
              },
            },
            data: { type: "object", nullable: true },
            trace: { type: "object", nullable: true },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.route.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
