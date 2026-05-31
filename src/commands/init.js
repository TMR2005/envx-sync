import fs from "fs";
import path from "path";
import { api } from "../lib/api.js";
import { select, Separator } from "@inquirer/prompts";

export async function init(providedProjectId) {
  try {
    let projectId = providedProjectId;

    if (!projectId) {
      const res = await api("/api/projects");
      const projects = res.projects ?? [];

      if (!projects.length) {
        console.log("📭 You don't have any projects yet.");
        return;
      }

      const choices = projects.map((p) => ({
        name: p.name,
        value: p.id,
      }));

      choices.push(new Separator());
      choices.push({ name: "❌ Cancel", value: "cancel" });

      projectId = await select({
        message: "Select a project to initialize .env.example for:",
        choices: choices,
      });

      if (projectId === "cancel") {
        console.log("Operation cancelled.");
        return;
      }
    }

    const res = await api(`/api/secrets/${projectId}`);
    const secrets = res.secrets;

    if (!secrets || Object.keys(secrets).length === 0) {
      console.log("⚠️ No secrets found to create a template from.");
      return;
    }

    let envExample = "";

    if (typeof secrets === "object" && secrets !== null) {
      envExample = Object.keys(secrets)
        .map((key) => `${key}=`)
        .join("\n");
    } else if (typeof secrets === "string") {
      envExample = secrets
        .split("\n")
        .map((line) => {
          const [key] = line.split("=");
          return `${key}=`;
        })
        .join("\n");
    }

    fs.writeFileSync(path.join(process.cwd(), ".env.example"), envExample);
    console.log("🧾 .env.example created successfully!");
  } catch (err) {
    console.error("❌ Init failed:", err.message);
  }
}