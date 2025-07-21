# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Promote User to Admin API

You can promote a user to admin using the following API endpoint:

**Endpoint:** `POST /api/promote-to-admin`

**Request Body:**
```json
{
  "username": "the_username",
  "password": "your_admin_promote_password"
}
```

**Example cURL:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "changeme"}' \
  http://localhost:5173/api/promote-to-admin
```

- Returns `{ "success": true }` on success.
- Returns `{ "error": "Bad request" }` with status 400 for any failure (invalid password, missing fields, or user not found).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
