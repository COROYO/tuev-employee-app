import lang from './lang.json';

export default {
	en: {
		lang,
		menu: {
			notification:
				'You have {{count:gt; 0:{{count}} new {{count; 1:message; default:messages}}!; default:no messages...}}'
		},
		content: {
			title: 'Welcome to SvelteKit',
			info: 'You can now access all your language mutations using <code>{$l(LOCALE, TRANSLATION_KEY)}</code>:',
			text: 'Visit <a href="{{link}}">kit.svelte.dev</a> to read the documentation'
		},
		welcome: 'Welcome!',
		login_button: 'Log in',
		register_button: 'Register',
		username: 'Username',
		password: 'Password',
		submitting: 'Submitting...',
		promote: 'Promote',
		promote_user_to_admin: 'Promote user to admin',
		admin_dashboard: 'Admin Dashboard',
		overview_all_users_time_entries: 'Overview of all users and time entries',
		previous_day: 'Previous day',
		next_day: 'Next day',
		no_entries: 'No entries',
		quick_time_entry: 'Quick Time Entry',
		date: 'Date',
		from: 'From',
		to: 'To',
		description: 'Description',
		what_did_you_do: 'What did you do?',
		entry_added: 'Entry added!',
		add_time_entry: 'Add time entry',
		previous_month: 'Previous month',
		next_month: 'Next month',
		to_time_entry: 'To time entry',
		to_admin_panel: 'To admin panel',
		logout: 'Logout',
		toggle_theme: 'Toggle theme'
	},
	de: {
		lang,
		menu: {
			notification:
				'{{count:gt; 0:Sie haben {{count}} {{count:gte; 1:neue Nachricht; 2:neue Nachrichten; 5:neuen Nachrichten}}!; default:Keine Nachrichten...}}'
		},
		content: {
			title: 'Willkommen bei SvelteKit',
			info: 'Sie haben jetzt Zugriff auf alle Ihre Sprachmutationen über <code>{$l(LOCALE, TRANSLATION_KEY)}</code>:',
			text: 'Die Dokumentation finden Sie unter <a href="{{link}}">kit.svelte.dev</a>'
		},
		welcome: 'Willkommen!',
		login_button: 'Anmelden',
		register_button: 'Registrieren',
		username: 'Benutzername',
		password: 'Passwort',
		submitting: 'Wird gesendet...',
		promote: 'Befördern',
		promote_user_to_admin: 'Benutzer zum Admin befördern',
		admin_dashboard: 'Admin-Dashboard',
		overview_all_users_time_entries: 'Übersicht aller Nutzer und Zeiteinträge',
		previous_day: 'Vorheriger Tag',
		next_day: 'Nächster Tag',
		no_entries: 'Keine Einträge',
		quick_time_entry: 'Schnelle Zeiterfassung',
		date: 'Datum',
		from: 'Von',
		to: 'Bis',
		description: 'Beschreibung',
		what_did_you_do: 'Was hast du gemacht?',
		entry_added: 'Eintrag hinzugefügt!',
		add_time_entry: 'Zeiteintrag hinzufügen',
		previous_month: 'Vorheriger Monat',
		next_month: 'Nächster Monat',
		to_time_entry: 'Zur Zeiterfassung',
		to_admin_panel: 'Zum Admin-Panel',
		logout: 'Abmelden',
		toggle_theme: 'Theme wechseln'
	}
};
