<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { t } from '$lib/translations';

	let { form }: { form: ActionData } = $props();
</script>

<form method="post" class="flex flex-col gap-2" action="?/login" use:enhance>
	<div class="flex flex-col gap-2 max-w-md">
		<div class="flex-1">
				<Label for="username">
					 {$t('username')}
				</Label>
			<Input
				id="username"
				name="username"
				class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<div class="flex-1">
				<Label for="password">
					 {$t('password')}
				</Label>
			
			<Input
				id="password"
				type="password"
				name="password"
				class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
	</div>
	<div class="flex flex-row gap-2">
			<Button type="submit">
				 {$t('login_button')}
			</Button>
			<Button
				type="submit"
				formaction="?/register"
				 >{$t('register_button')}</Button
			>
	</div>
</form>
<p style="color: red">{form?.message ?? ''}</p>
