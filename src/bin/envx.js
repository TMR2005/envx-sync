#!/usr/bin/env node

import { Command } from "commander";
import { login } from "../commands/login.js";
import { projects } from "../commands/projects.js";
import { pull } from "../commands/pull.js";
import { push } from "../commands/push.js";
import { join } from "../commands/join.js";
import { invite } from "../commands/invite.js";
import { create } from "../commands/create.js"; 
import { init } from "../commands/init.js";

const program = new Command();

program.name("envx").description("envx CLI").version("1.0.0");

program.command("login").action(login);

program
  .command("create")
  .description("Create a new project space")
  .action(create);

program.command("projects [nameOrId]").action(projects);

program.command("pull [projectId]").action(pull);

program.command("push [projectId]").action(push);

// Note: If you want 'join' to accept an optional token right from the command line, 
// you can change this to "join [token]" as well!
program.command("join [token]").action(join);

program
  .command("invite [projectId] [username]") // <--- Use square brackets here!
  .description("Invite a user to a project via their GitHub username")
  .action(invite);

// ✅ Changed from <projectId> to [projectId] to make it optional
program
  .command("init [projectId]")
  .description("Generate a safe .env.example template for the project")
  .action(init);

program.parseAsync(process.argv).catch((err) => {
  console.error("❌ CLI Error:", err.message);
  process.exit(1);
});