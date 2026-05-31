import { select, Separator } from "@inquirer/prompts";
import { api } from "../lib/api.js";

export async function projects(nameOrId) {
  try {
    const res = await api("/api/projects");
    const projectsList = res.projects ?? [];

    if (!projectsList.length) {
      console.log("📁 No projects found. Create one or get an invite!");
      return;
    }

    // Safety check: ensure nameOrId is actually a string, not a Commander object
    if (nameOrId && typeof nameOrId === "string") {
      const project = projectsList.find(
        (p) => p.name.toLowerCase() === nameOrId.toLowerCase() || p.id === nameOrId
      );

      if (project) {
        console.log(`✅ Selected Project: ${project.name}`);
        return project.id;
      } else {
        console.log(`❌ Project "${nameOrId}" not found.`);
        return;
      }
    }

    // No valid string argument provided → show dropdown
    const choices = projectsList.map((p) => ({
      name: p.name,
      value: p.id,
    }));

    choices.push(new Separator());
    choices.push({ name: "❌ Cancel", value: "cancel" });

    const selectedId = await select({
      message: "Select a project:",
      choices: choices,
    });

    if (selectedId === "cancel") {
      console.log("Operation cancelled.");
      return;
    }

    const selected = projectsList.find(p => p.id === selectedId);
    console.log(`✅ Selected: ${selected.name}`);
    return selectedId;
  } catch (err) {
    console.error("❌ Failed to fetch projects:", err.message);
  }
}