<script lang="ts">
	import { t } from '$lib/translations';
</script>

<main style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh;">
		<h1>{$t('welcome')}</h1>
		<a href="/login">
			<button style="padding: 0.75em 2em; font-size: 1.2em; border-radius: 0.5em; background: #2563eb; color: white; border: none; cursor: pointer;">{$t('login_button')}</button>
		</a>
</main>
