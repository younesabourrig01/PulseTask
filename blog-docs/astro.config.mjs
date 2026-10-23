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
          label: "Introduction",
          items: [
            { slug: "introduction", label: "PulseTask" },
            { slug: "installation", label: "Installation & local development" },
            { slug: "architecture", label: "Architecture & data model" },
            { slug: "operations", label: "Monitoring, jobs & realtime" },
          ],
        },
        {
          label: "API Reference",
          items: [
            { slug: "api-reference", label: "REST API" },
            { slug: "security", label: "Security & production checklist" },
          ],
        },
      ],
    }),
  ],
});
