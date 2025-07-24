import swaggerJSDoc from "swagger-jsdoc";
import yaml from "js-yaml";
import { writeFileSync } from "fs";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gmail & Calendar API",
      version: "1.0.0",
      description:
        "API pour intégrer Gmail et Google Calendar avec authentification OAuth2",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        GoogleOAuth2: {
          type: "oauth2",
          flows: {
            authorizationCode: {
              authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
              tokenUrl: "https://oauth2.googleapis.com/token",
              scopes: {
                openid: "OpenID Connect",
                profile: "Profil utilisateur",
                email: "Email utilisateur",
                "https://www.googleapis.com/auth/gmail.readonly":
                  "Lecture Gmail",
                "https://www.googleapis.com/auth/calendar.readonly":
                  "Lecture Calendar",
              },
            },
          },
        },
      },
      schemas: {
        AuthResponse: {
          type: "object",
          properties: {
            authUrl: {
              type: "string",
              description: "URL d'autorisation Google",
            },
            message: {
              type: "string",
            },
          },
        },
        TokenData: {
          type: "object",
          properties: {
            access_token: {
              type: "string",
            },
            refresh_token: {
              type: "string",
            },
            expiry_date: {
              type: "number",
            },
          },
        },
        Messages: {
          type: "object",
          properties: {
            messages: {
              type: "array",
              items: {
                $ref: "#/components/schemas/MailSumarryDTO",
              },
            },
            nextPageToken: {
              type: "string",
              nullable: true,
              description: "Token de pagination pour la prochaine page",
            },
          },
        },
        MessageDetails: {
          type: "object",
          properties: {
            mailInfo: {
              $ref: "#/components/schemas/MailSumarryDTO",
            },
            processedEmail: {
              $ref: "#/components/schemas/ProcessedEmail",
            },
          },
        },
        ProcessedEmail: {
          type: "object",
          properties: {
            htmlContent: {
              type: "string",
              nullable: true,
            },
            cssStyles: {
              type: "string",
              nullable: true,
            },
            hasStyles: {
              type: "boolean",
            },
          },
        },
        MailSumarryDTO: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            from: {
              type: "string",
            },
            to: {
              type: "string",
            },
            subject: {
              type: "string",
            },
            date: {
              type: "string",
            },
            read: {
              type: "boolean",
              nullable: true,
            },
          },
        },
        MailsIds: {
          type: "object",
          properties: {
            mailIds: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        CalendarEvent: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            summary: {
              type: "string",
            },
            description: {
              type: "string",
            },
            start: {
              type: "object",
              properties: {
                dateTime: {
                  type: "string",
                },
                date: {
                  type: "string",
                },
              },
            },
            end: {
              type: "object",
              properties: {
                dateTime: {
                  type: "string",
                },
                date: {
                  type: "string",
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
            },
            needsRefresh: {
              type: "boolean",
            },
          },
        },
      },
    },
  },
  apis: ["./server.ts", "./routes/*.ts"], // Ajoutez d'autres fichiers si besoin
};

export const specs = swaggerJSDoc(options);
writeFileSync("./openapi.yaml", yaml.dump(specs));
