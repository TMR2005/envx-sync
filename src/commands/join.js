import { select, Separator } from "@inquirer/prompts";
import { api } from "../lib/api.js";

export async function join(inviteToken) {
  try {
    if (inviteToken) {
      await api("/api/projects/accept-invite", {
        method: "POST",
        body: JSON.stringify({ token: inviteToken }),
      });

      console.log("✅ Joined project successfully!");
      return;
    }

    const res = await api("/api/invites");
    const invites = res.invites ?? [];

    if (!invites.length) {
      console.log("📭 No pending invites found.");
      return;
    }

    const choices = invites.map((i) => ({
      name: `${i.projectName} (@${i.username})`,
      value: i.token,
    }));

    choices.push(new Separator());
    choices.push({ name: "❌ Cancel", value: "cancel" });

    const selectedToken = await select({
      message: "Select an invite to join:",
      choices: choices,
    });

    if (selectedToken === "cancel") {
      console.log("Operation cancelled.");
      return;
    }

    await api("/api/projects/accept-invite", {
      method: "POST",
      body: JSON.stringify({ token: selectedToken }),
    });

    const project = invites.find(i => i.token === selectedToken);
    console.log(`✅ Joined ${project.projectName} successfully!`);
  } catch (err) {
    console.error("❌ Failed to join project:", err.message);
  }
}