import path from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { Collection, Routes, REST, SlashCommandBuilder, Interaction, ChatInputCommandInteraction } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, "commands")
const commandFiles = readdirSync(commandsPath)

export const commands = new Collection<any, any>();

for (const file of commandFiles) {
  const { command } = await import(`./commands/${file}`)
  commands.set(command.name, command)
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN)

export async function deployCommands() {
  console.log("deploying commands")

  try {
    const data: any = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      {
        body: commands.map(c => c.builder)
      })

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (e) {
    console.error(e)
  }
}

export async function handleInteractionCreate(interaction) {
  if (!interaction.isChatInputCommand())
    return

  const command = commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  await command.execute(interaction);

  return;
}

export type ServerCommand = {
  name: string,
  builder: SlashCommandBuilder,
  execute: (interaction: ChatInputCommandInteraction) => Promise<any>
}
