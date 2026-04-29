import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { anonymousUser } from "./middleware/anonymousUser";
import { documentsRouter } from "./routes/documents";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 5000);
const isProd = process.env.NODE_ENV === "production";

async function main() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));

  // API
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/documents", anonymousUser, documentsRouter);

  if (isProd) {
    // Serve built client. In prod __dirname = dist/server, so client is ../client.
    const clientDist = path.resolve(__dirname, "../client");
    if (!fs.existsSync(clientDist)) {
      throw new Error(
        `Client build not found at ${clientDist}. Run \`npm run build\` first.`
      );
    }
    app.use(
      express.static(clientDist, {
        index: false,
        maxAge: "1h",
        setHeaders: (res, p) => {
          if (p.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache");
          }
        },
      })
    );
    // SPA fallback for any non-API GET request.
    app.use((req, res, next) => {
      if (req.method !== "GET") return next();
      if (req.path.startsWith("/api/")) return next();
      res.sendFile(path.join(clientDist, "index.html"));
    });
  } else {
    // Dev: mount Vite as middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: process.cwd(),
      server: {
        middlewareMode: true,
        host: "0.0.0.0",
        allowedHosts: true,
        hmr: { port: 5051 },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `[server] LexiGuard listening on http://0.0.0.0:${PORT} (${
        isProd ? "production" : "development"
      })`
    );
  });
}

main().catch((err) => {
  console.error("[server] fatal:", err);
  process.exit(1);
});
