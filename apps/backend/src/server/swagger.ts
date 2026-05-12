export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Attribution Dashboard API",
    version: "1.0.0",
    description: [
      "Marketing Attribution Dashboard — Backend API",
      "",
      "**How to test auth:**",
      "1. `POST /api/auth/login` — sign in with your credentials",
      "2. Copy the `access_token` from the response",
      "3. Click **Authorize** (lock icon) and enter `Bearer <access_token>`",
      "4. All protected routes will now work",
      "",
      "Users are created by agency admins via `POST /api/admin/users` — there is no public signup.",
    ].join("\n"),
  },
  servers: [{ url: "http://localhost:3001", description: "Local development" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Paste the access_token returned by POST /api/auth/login",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "AUTH_ERROR" },
          message: { type: "string", example: "Missing token" },
        },
      },
      Session: {
        type: "object",
        properties: {
          userId: { type: "string", example: "00000000-0000-0000-0000-000000000000" },
          clientId: { type: "string", nullable: true, example: null },
          role: {
            type: "string",
            enum: ["AGENCY_ADMIN", "CLIENT_ADMIN", "LOCATION_MANAGER", "VIEWER"],
          },
          locationIds: { type: "array", items: { type: "string" }, example: [] },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        description: "Returns DB and Redis connectivity status. No auth required.",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    db: { type: "string", enum: ["ok", "error"] },
                    cache: { type: "string", enum: ["ok", "error"] },
                    ts: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        description: "Returns a JWT `access_token`. Copy the value and click **Authorize** to authenticate all protected routes.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@agency.com" },
                  password: { type: "string", example: "Password123!" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful — copy access_token and click Authorize",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    access_token: { type: "string" },
                    token_type: { type: "string", example: "Bearer" },
                    expires_in: { type: "number", example: 3600 },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        email: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current session",
        description: "Returns the verified session. Role and clientId come from the **database**, not from the JWT payload — user_metadata is never trusted for authorization.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Session info",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Session" } } },
          },
          "401": { description: "Missing or invalid token", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout",
        description: "Invalidates the session in Supabase. The token returns 401 on all subsequent requests even before it expires.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Logged out",
            content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Logged out successfully" } } } } },
          },
          "401": { description: "Missing or invalid token", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
};
