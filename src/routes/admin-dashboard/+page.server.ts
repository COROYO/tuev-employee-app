import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	// Fetch user from DB to get the role
	const userId = event.locals.user.id;
	const users = await db.select().from(table.user).where(eq(table.user.id, userId));
	const dbUser = users[0];
	if (!dbUser) {
		throw redirect(302, '/login');
	}
	if (dbUser.role !== 'admin') {
		throw redirect(302, '/dashboard');
	}
	return { user: dbUser };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);
		return redirect(302, '/login');
	}
};
