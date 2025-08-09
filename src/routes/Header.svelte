<script lang="ts">
	import SunIcon from "@lucide/svelte/icons/sun";
  	import MoonIcon from "@lucide/svelte/icons/moon";

	import { toggleMode } from "mode-watcher";
	import { Button } from "$lib/components/ui/button/index.js";
	import { page } from "$app/stores";
</script>

<header>
	<div class="flex flex-row items-center justify-end gap-4 p-4">
		{#if $page.data.user}
		<form method="post" action="../?/logout" class="w-full max-w-lg mx-auto">
			<Button type="submit" class="w-full">Logout</Button>
		</form>
		{/if}

		<Button onclick={toggleMode} variant="outline" size="icon">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
	
</header>

<style>
	header {
		display: flex;
		justify-content: flex-end;
	}
</style>
