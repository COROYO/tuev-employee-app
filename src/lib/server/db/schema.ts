import { datetime, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	age: int('age'),
	username: varchar('username', { length: 32 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	role: varchar('role', { length: 32 }).notNull().default('user') // 'user' or 'admin'
});

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull()
});

// Time tracking table
export const timeEntry = mysqlTable('time_entry', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	date: varchar('date', { length: 10 }).notNull(), // ISO date string (YYYY-MM-DD)
	startTime: varchar('start_time', { length: 5 }).notNull(), // HH:mm
	endTime: varchar('end_time', { length: 5 }).notNull(), // HH:mm
	description: varchar('description', { length: 255 }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
export type UserRole = 'user' | 'admin';

export type TimeEntry = typeof timeEntry.$inferSelect;
