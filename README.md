### Try [Gritize](https://gritize.vercel.app) and we will appreciate your feedback

# Gritize

## General Information

Gritize is a technical interview preparation platform focused on algorithms, data structures, and coding patterns. It provides structured programs, problem sets, and tools for developers to practice and improve their problem-solving skills.

## Technologies Used

- **Next.js** (App Router, SSR)
- **TailwindCss**
- **Shadcn** (Used for `FAQ` Accordion)
- **TypeScript**
- **Appwrite** (for database and authentication)
- **Zod** (for schema validation)
- **pnpm** (package manager)

## File Structure

```
.
├── .env.local                # Environment variables
├── .gitignore
├── components.json           # Shadcn Component registry/config
├── package.json
├── ...
├── public/                   # Static assets (icons, images)
├── src/
│   ├── app/                  # Next.js app directory (api, pages, etc.)
|   ├── config/               # Appwrite configurations
│   ├── models/               # Data models (e.g., problems.ts, users.ts)
│   ├── utils/                # Utility functions (e.g., assistant-tools)
│   └── ...                   # Other source files
├── Data/                     # Problems Development data dump, secrets, etc.
└── README.md                 # Project documentation
```

## Further Information

- **Problem Models:** Problems are defined in [`src/models/problems.ts`](src/models/problems.ts) and use schemas for validation.
- **Assistant Tools:** Utilities for program and problem generation are in [`src/utils/assistant-tools/program-generator-tools.ts`](src/utils/assistant-tools/program-generator-tools.ts).
- **Appwrite Integration:** Database actions and DTOs are used for problem management.
- **Testing:** (Add info here if you have tests or a test script.)
- **Contributing:** (Add guidelines if you accept contributions.)

---

If you have questions about setup, usage, or contributing, please open an issue or contact the maintainer.

---
