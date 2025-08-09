import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

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

	return { user: dbUser, users, timeEntries, selectedDate: date };
};
