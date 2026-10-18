import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "PulseTask Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/username/repo",
        },
        { icon: "discord", label: "Discord", href: "https://discord.gg/..." },
      ],
      // Define your documentation sidebar categories here!
      sidebar: [
        {
          label: "Getting Started",
          items: [{ slug: "api-getting-started", label: "Quick Start" }],
        },
        {
          label: "API Reference",
          items: [
            // Add more markdown files here as you create them
          ],
        },
      ],
    }),
  ],
});
