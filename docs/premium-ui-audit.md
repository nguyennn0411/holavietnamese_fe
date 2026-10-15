# Premium UI audit

## Application inventory

- 59 routed page modules covering public, authentication, learner, vocabulary, culture, AI/roleplay, quiz, profile and admin experiences.
- 54 shared and domain components.
- React Router route-level lazy loading is retained.
- Existing API services, JWT handling, authorization guards and request contracts are retained.

## Completed shared-system upgrades

- Unified heritage design tokens, typography, spacing, surfaces, buttons, cards, inputs, tables and responsive breakpoints.
- Motion route transitions, dropdown animation, content entrance and reduced-motion support.
- Lucide icon system in global navigation, feedback, pagination, audio, account and admin controls.
- Sonner application-level toast system with a separate production chunk.
- Accessible animated confirmation dialog replacing browser confirmation prompts.
- Skeleton loading and polished network error/retry states for shared async resources.
- Responsive learner navigation, admin drawer, notification center and account menu.
- Image lazy loading, aspect-ratio handling, fallbacks and hover treatment through shared media components.
- Responsive table overflow, form controls, grid collapse and touch-sized actions.
- Error boundary redesigned as a branded recovery screen.
- Google Sign-In loading/failure fallback added so its action never disappears silently.
- Guest homepage rebuilt as an immersive Vietnamese EdTech experience with a layered cultural hero, real API-backed course cards, a five-step learning journey, culture stories and a conversion section.
- Learner homepage no longer fabricates fallback streak, XP, lesson or activity data; unavailable data now renders intentional empty states.

## Technology decisions

- Motion for React, Lucide React and Sonner are used.
- Existing CSS design system is retained instead of forcing a Tailwind migration across working screens.
- Existing async resource hooks and service layer are retained instead of introducing TanStack Query without a full cache-contract migration.
- shadcn/ui is not added because the project already has shared modal, form, card, state and navigation primitives.

## Verification

- All 28 contract tests pass.
- Production build passes.
- Vendor libraries are split into React, Motion, icons, toast and HTTP chunks; no chunk exceeds the configured 500 kB warning threshold.
- No `window.alert` or `window.confirm` remains in production source.
