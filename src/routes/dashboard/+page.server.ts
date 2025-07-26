import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, gte, lte } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { timeEntry, user as userTable } from '$lib/server/db/schema';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	// Get month from query params, default to current month
	const url = event.url;
	let month = url.searchParams.get('month');
	let year: number, monthNum: number;
	if (!month) {
		const now = new Date();
		year = now.getFullYear();
		monthNum = now.getMonth() + 1;
		month = `${year}-${String(monthNum).padStart(2, '0')}`;
	} else {
		[year, monthNum] = month.split('-').map(Number);
	}

	// Calculate first and last day of the month
	const firstDay = `${year}-${String(monthNum).padStart(2, '0')}-01`;
	const lastDay = new Date(year, monthNum, 0).toISOString().split('T')[0];

	// Fetch user from DB
	const users = await db.select().from(userTable).where(eq(userTable.id, event.locals.user.id));
	const dbUser = users[0];
	if (!dbUser) {
		throw redirect(302, '/login');
	}

	// Fetch only time entries for the user and month
	const timeEntries = await db
		.select()
		.from(timeEntry)
		.where(
			and(
				eq(timeEntry.userId, event.locals.user.id),
				gte(timeEntry.date, firstDay),
				lte(timeEntry.date, lastDay)
			)
		);

	return { user: dbUser, timeEntries, selectedMonth: month };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);
		return redirect(302, '/login');
	},
	addTimeEntry: async (event) => {
		if (!event.locals.user) {
			return fail(401);
		}
		const form = await event.request.formData();
		const date = form.get('date');
		const startTime = form.get('startTime');
		const endTime = form.get('endTime');
		const description = form.get('description');
		if (!date || !startTime || !endTime || !description) {
			return fail(400, { message: 'All fields are required.' });
		}
		await db.insert(timeEntry).values({
			id: randomUUID(),
			userId: event.locals.user.id,
			date: String(date),
			startTime: String(startTime),
			endTime: String(endTime),
			description: String(description)
		});
		return { success: true };
	}
};
