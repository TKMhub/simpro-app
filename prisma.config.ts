import { defineConfig } from "prisma/config";
import fs from "fs";
import path from "path";

function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, "utf-8");
      for (const line of envFile.split("\n")) {
        // Simple parsing: KEY=VALUE
        // Ignoring comments and complex quoting for simplicity
        const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          // Remove surrounding quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    }
  } catch (e) {
    console.warn("Failed to load .env file manually:", e);
  }
}

loadEnv();

export default defineConfig({
  // Prisma スキーマファイルの場所
  schema: 'prisma/schema.prisma',

  // datasource 設定（必須）
  datasource: {
    url: process.env.DATABASE_URL!,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL!,
  },
})