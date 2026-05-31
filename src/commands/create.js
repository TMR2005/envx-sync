// commands/create.js
import { input } from "@inquirer/prompts";
import { api } from "../lib/api.js";

export async function create() {
  try {
    const name = await input({
      message: "Enter the name for your new project:",
      validate: (value) => {
        if (value.trim().length === 0) return "Project name cannot be empty.";
        return true;
      },
    });

    const res = await api("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    if (res.success && res.project) {
      console.log(`\n✅ Project '${res.project.name}' created successfully!`);
      console.log(`🔑 Project ID: ${res.project.id}\n`);
      
      console.log(`Next steps:`);
      console.log(`  1. Run 'envx init ${res.project.id}' to create a local .env.example`);
      console.log(`  2. Add your secrets to your local .env file`);
      console.log(`  3. Run 'envx push ${res.project.id}' to upload them to the cloud`);
      
      return res.project.id;
    } else {
      console.log(`❌ Failed to create project: ${res.message || "Unknown error"}`);
    }
  } catch (err) {
    console.error("❌ Error creating project:", err.message);
  }
}