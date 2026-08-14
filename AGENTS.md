# AGENTS.md

This file shows how to use the `@vercel/blob` package to upload a blob and how to install the package.

Install:

```bash
npm install @vercel/blob
# or
yarn add @vercel/blob
```

Usage (TypeScript example):

```ts
import { put } from "@vercel/blob";

const blob = await put('articles/blob.txt', 'Hello World!', { access: 'private' });
```

Notes:

- The `put` function uploads the provided data to the specified path and returns a blob object with metadata.
- Ensure your environment has the necessary Vercel Blob credentials configured (for example via environment variables) before calling `put`.
- If your project uses TypeScript, you may need to add/update types or include `skipLibCheck` depending on your setup.
