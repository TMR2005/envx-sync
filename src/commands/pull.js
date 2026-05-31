import fs from "fs";
import path from "path";
import { select, Separator } from "@inquirer/prompts";
import { api } from "../lib/api.js";

export async function pull(projectId) {
  try {
    // If no projectId → prompt the user with a dropdown
    if (!projectId) {
      const res = await api("/api/projects");
      const projects = res.projects ?? [];

      if (!projects.length) {
        console.log("📁 No projects found. Create or join a project first.");
        return;
      }

      const choices = projects.map((p) => ({
        name: p.name,
        value: p.id,
      }));

      choices.push(new Separator());
      choices.push({ name: "❌ Cancel", value: "cancel" });

      const selectedId = await select({
        message: "Select project to pull secrets from:",
        choices: choices,
      });

      if (selectedId === "cancel") {
        console.log("Operation cancelled.");
        return;
      }

      projectId = selectedId;
    }

    const res = await api(`/api/secrets/${projectId}`);

    if (!res.secrets || (typeof res.secrets === 'object' && Object.keys(res.secrets).length === 0)) {
      console.log("⚠️ No secrets found for this project.");
      return;
    }

    let envContent = res.secrets;

    // Convert JSON object back to .env format (KEY=VALUE)
    if (typeof envContent === "object" && envContent !== null) {
      envContent = Object.entries(envContent)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
    }

    const envPath = path.join(process.cwd(), ".env");
    fs.writeFileSync(envPath, envContent);

    console.log("✅ .env pulled successfully");
  } catch (err) {
    console.error("❌ Pull failed:", err.message);
  }
}