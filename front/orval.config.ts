import { defineConfig } from 'orval';

export default defineConfig({
  googleAuth: {
    input: './openapi.yaml',
    output: {
      mode: 'split',
      target: './src/types/api.ts',
    },
  },
});
