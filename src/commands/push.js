import fs from "fs";
import path from "path";
import { select, Separator } from "@inquirer/prompts";
import { api } from "../lib/api.js";

export async function push(projectId) {
  try {
    const envPath = path.join(process.cwd(), ".env");

    if (!fs.existsSync(envPath)) {
      console.log("❌ No .env file found in current directory");
      return;
    }

    // If no projectId provided, ask user to select
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
        message: "Select project to push secrets to:",
        choices: choices,
      });

      if (selectedId === "cancel") {
        console.log("Operation cancelled.");
        return;
      }

      projectId = selectedId;
    }

    const secrets = fs.readFileSync(envPath, "utf-8");

    await api("/api/secrets", {
      method: "POST",
      body: JSON.stringify({ projectId, secrets }),
    });

    console.log("✅ .env pushed successfully");
  } catch (err) {
    console.error("❌ Push failed:", err.message);
  }
}