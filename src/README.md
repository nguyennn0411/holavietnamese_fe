# Source structure

The frontend follows a conventional layered React structure. Dependencies should
flow from pages toward reusable modules; lower-level modules must not import pages.

```text
src/
├── app/          # application composition, providers, and router
├── api/          # HTTP clients and API-level configuration
├── assets/       # images and other bundled static assets
├── components/   # reusable UI grouped by domain
├── config/       # application configuration
├── constants/    # shared immutable values and route names
├── contexts/     # global React contexts
├── features/     # self-contained feature modules
├── hooks/        # reusable React hooks
├── i18n/         # localization setup and resources
├── layouts/      # route layouts
├── models/       # data normalization and domain models
├── pages/        # route-level components grouped by area
├── services/     # backend operations grouped by domain
├── styles/       # global design-system and layout styles
├── types/        # shared TypeScript types
└── utils/        # framework-independent helpers
```

## Import rules

- Use the `@/` alias for cross-folder imports.
- Use relative imports only inside the same small module.
- Pages compose components and hooks; reusable components never import pages.
- Services own backend calls and use clients from `api/`.
- Global providers are registered only in `app/providers/AppProviders.jsx`.
- Routes are registered only in `app/router/AppRouter.jsx`.

Feature-specific assets, styles, components, and services may stay together under
`features/<feature>` when they are not shared elsewhere.
