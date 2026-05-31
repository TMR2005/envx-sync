import http from "http";
import open from "open";
import { saveToken } from "../lib/auth.js";

const PORT = 5544;

export async function login() {
  try {
    const callbackUrl = `http://localhost:${PORT}/callback`;

    const server = http.createServer((req, res) => {
      const url = new URL(req.url, callbackUrl);

      if (url.pathname === "/callback") {
        const token = url.searchParams.get("token");

        if (!token) {
          res.writeHead(400, {
            "Content-Type": "text/html; charset=utf-8",
          });
          res.end(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Login Failed</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                  .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); text-align: center; }
                  h1 { color: #d32f2f; margin-top: 0; }
                  p { color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>❌ Login Failed</h1>
                  <p>Missing authentication token. Please try again.</p>
                </div>
              </body>
            </html>
          `);
          server.close();
          return;
        }

        saveToken(token);

        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
        });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Login Successful</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); text-align: center; }
                h1 { color: #333; margin-top: 0; }
                .emoji { font-size: 60px; margin-bottom: 20px; }
                p { color: #666; margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="emoji">✅</div>
                <h1>Login Successful!</h1>
                <p>You have been authenticated.</p>
                <p>You can now close this tab and return to your terminal.</p>
              </div>
            </body>
          </html>
        `);

        server.close(() => process.exit(0));
      }
    });

    server.listen(PORT, () => {
      console.log("🔐 Starting login...");
      console.log(`⏳ Waiting for authentication callback on port ${PORT}...\n`);
    });

    // IMPORTANT: send full callback URL in state
    const state = `cli:${callbackUrl}`;

    // ✅ Updated to point to the live Render backend
    const url = `https://envx-backend-j8nj.onrender.com/auth/github?state=${encodeURIComponent(
      state
    )}`;

    await open(url);

    console.log("🌐 Browser opened. Please complete authentication.\n");
  } catch (err) {
    console.error("❌ Login error:", err.message);
    process.exit(1);
  }
}