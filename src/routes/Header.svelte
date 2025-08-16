<script lang="ts">
	import SunIcon from "@lucide/svelte/icons/sun";
  	import MoonIcon from "@lucide/svelte/icons/moon";

	import { toggleMode } from "mode-watcher";
	import { Button } from "$lib/components/ui/button/index.js";
	import { page } from "$app/stores";

		import { t } from '$lib/translations';
</script>

<header class="flex flex-row justify-between p-4">
	<div class="flex flex-row justify-center items-center">
		{#if $page.url.pathname === '/admin-dashboard'}
			<Button type="submit" class="w-full" href="/dashboard">{$t('to_time_entry')}</Button>
		{/if}
		{#if $page.url.pathname === '/dashboard' && $page.data.user?.role === 'admin'}
			<Button type="submit" class="w-full" href="/admin-dashboard">{$t('to_admin_panel')}</Button>
		{/if}
	</div>
	<div class="flex flex-row items-center justify-end gap-4">
		{#if $page.data.user}
		<form method="post" action="../?/logout" class="w-full max-w-lg mx-auto">
			<Button type="submit" class="w-full">{$t('logout')}</Button>
		</form>
		{/if}

			<Button onclick={toggleMode} variant="outline" size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
				/>
				 <span class="sr-only">{$t('toggle_theme')}</span>
			</Button>
	</div>
	
</header>

<style>
</style>
