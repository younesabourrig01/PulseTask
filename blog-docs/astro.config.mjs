import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "PulseTask Documentation",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/younesabourrig1ya/pulseTasks",
        },
      ],
      // Define your documentation sidebar categories here!
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { slug: "first-page", label: "first page" },
            { slug: "api-getting-started", label: "Quick Start" },
          ],
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
