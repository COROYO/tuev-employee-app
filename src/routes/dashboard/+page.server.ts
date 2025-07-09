import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { timeEntry } from '$lib/server/db/schema';
import { randomUUID } from 'crypto';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	// Fetch time entries for the logged-in user, newest first
	const entries = await db
		.select()
		.from(timeEntry)
		.where(eq(timeEntry.userId, event.locals.user.id))
		.orderBy(desc(timeEntry.date), desc(timeEntry.startTime));
	return {
		user: event.locals.user,
		timeEntries: entries
	};
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
