import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

const ADMIN_PASSWORD = process.env.ADMIN_PROMOTE_PASSWORD || 'romanderhundebein123';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { username, password } = body;

	if (!username || !password || password !== ADMIN_PASSWORD) {
		return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
	}

	const users = await db.select().from(userTable).where(eq(userTable.username, username));
	if (users.length === 0) {
		return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
	}

	await db.update(userTable).set({ role: 'admin' }).where(eq(userTable.username, username));
	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
