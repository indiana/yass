# Gemini CLI Project Notes

## TDD & Development Workflow

- When adding a new behavior, implement the logic against the `IGameContext` interface first, write a test for it, and then hook it up to the Phaser prefab.

## Post-Change Actions

- Always run `npm run lint` after making code changes to ensure linting standards are maintained.
- When implementing a new feature, always run the tests (`npm test`) at the end and fix any issues.
