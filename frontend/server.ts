import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3001;

  // Middlewares to resolve CORS and framing security errors in development/local IP access
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    // Allow the site to be loaded in frames/previews
    res.header("X-Frame-Options", "ALLOWALL");
    res.header("Content-Security-Policy", "frame-ancestors *");
    
    next();
  });

  // API routes
  // Polled by the Docker HEALTHCHECK and by deploy/deploy.sh after each swap.
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    app.use("/proxy-api", express.raw({ type: "*/*" }), async (req, res) => {
      try {
        const apiUrl = new URL(
          req.originalUrl.slice("/proxy-api".length).replace(/^\/+/, ""),
          "https://api.eteatr.uz/api/",
        );
        const headers: Record<string, string> = {};
        const theater = req.header("Theater");
        const contentType = req.header("Content-Type");
        if (theater) headers.Theater = theater;
        if (contentType) headers["Content-Type"] = contentType;

        const response = await fetch(apiUrl, {
          method: req.method,
          headers,
          body: req.body?.length ? req.body.toString() : undefined,
        });
        res.status(response.status);
        const responseType = response.headers.get("content-type");
        if (responseType) res.type(responseType);
        res.send(Buffer.from(await response.arrayBuffer()));
      } catch (error) {
        console.error("Theatre API proxy failed:", error);
        res.status(502).json({ error: "Theatre API is unavailable" });
      }
    });

    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  if (vite) {
    server.on("upgrade", (req, socket, head) => {
      vite.handleUpgrade(req, socket, head);
    });
  }
}

startServer();
