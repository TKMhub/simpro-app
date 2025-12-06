import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasources: {
    db: {
      url: {
        fromEnvVar: "DATABASE_URL",
      },
    },
  },
});


