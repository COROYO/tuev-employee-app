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
	const users = await db.select().from(table.user);
	const dbUser = users.find((u) => u.id === userId);
	if (!dbUser) {
		throw redirect(302, '/login');
	}
	if (dbUser.role !== 'admin') {
		throw redirect(302, '/dashboard');
	}

	// Get date from query params, default to today
	const url = event.url;
	let date = url.searchParams.get('date');
	if (!date) {
		date = new Date().toISOString().split('T')[0];
	}

	// Fetch only time entries for the selected date
	const timeEntries = await db.select().from(table.timeEntry).where(eq(table.timeEntry.date, date));

	return { users, timeEntries, selectedDate: date };
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
