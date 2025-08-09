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
	},
	updateTimeEntry: async (event) => {
		if (!event.locals.user) {
			return fail(401);
		}
		const form = await event.request.formData();
		const id = form.get('id');
		const date = form.get('date');
		const startTime = form.get('startTime');
		const endTime = form.get('endTime');
		const description = form.get('description');

		if (!id || !date || !startTime || !endTime || !description) {
			return fail(400, { message: 'All fields are required.' });
		}

		// Verify the entry belongs to the user
		const entries = await db
			.select()
			.from(timeEntry)
			.where(and(eq(timeEntry.id, String(id)), eq(timeEntry.userId, event.locals.user.id)));

		if (entries.length === 0) {
			return fail(403, { message: 'Time entry not found or access denied.' });
		}

		await db
			.update(timeEntry)
			.set({
				date: String(date),
				startTime: String(startTime),
				endTime: String(endTime),
				description: String(description)
			})
			.where(eq(timeEntry.id, String(id)));

		return { success: true };
	}
};
