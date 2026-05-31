import { select, input, Separator } from "@inquirer/prompts";
import { api } from "../lib/api.js";

export async function invite(providedProjectId, providedUsername) {
  try {
    let projectId = providedProjectId;
    let username = providedUsername;

    // 1. If no project is provided, fetch them and show a dropdown
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
        message: "Select a project to invite a user to:",
        choices: choices,
      });

      if (projectId === "cancel") {
        console.log("Operation cancelled.");
        return;
      }
    }

    // 2. If no username is provided, prompt them to type it
    if (!username) {
      username = await input({
        message: "Enter the GitHub username to invite:",
        validate: (val) => val.trim().length > 0 || "Username is required",
      });
    }

    // 3. Send the invite request
    const res = await api("/api/projects/invite", {
      method: "POST",
      body: JSON.stringify({ projectId, username }),
    });

    if (!res.success) {
      console.log(`❌ Invite failed: ${res.message}`);
      return;
    }

    console.log(`\n✅ Invited @${username} successfully!\n`);
    console.log(`👤 Username: ${username}`);
    console.log(`🔗 Invite Token:\n${res.inviteToken}\n`);
    console.log(`⏰ Expires: ${new Date(res.expiresAt).toLocaleString()}\n`);
    console.log("Share this token with the user to join your project.\n");
  } catch (err) {
    console.error("❌ Invite failed:", err.message);
  }
}