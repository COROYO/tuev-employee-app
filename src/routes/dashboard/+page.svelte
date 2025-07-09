
<script lang="ts">
	import type { PageServerData } from './$types';
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	let { data }: { data: PageServerData } = $props();
	let formError: string | null = null;
	let formSuccess: boolean = false;
</script>

<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>

<!-- Time Entries List -->
{#if data.timeEntries && data.timeEntries.length > 0}
	<h2 class="mt-6 mb-2 text-lg font-semibold">Your Time Entries</h2>
	<ul class="mb-6">
		{#each data.timeEntries as entry (entry.id)}
			<li class="mb-2 p-2 border rounded">
				<div><strong>Date:</strong> {entry.date}</div>
				<div><strong>Time:</strong> {entry.startTime} - {entry.endTime}</div>
				<div><strong>Description:</strong> {entry.description}</div>
			</li>
		{/each}
	</ul>
{/if}

<!-- Add Time Entry Form -->
<form method="post" action="?/addTimeEntry" class="space-y-4 mb-8">
	<div>
		<Label for="date">Date</Label>
		<Input id="date" name="date" type="date" required />
	</div>
	<div class="flex gap-2">
		<div class="flex-1">
			<Label for="startTime">Start Time</Label>
			<Input id="startTime" name="startTime" type="time" required />
		</div>
		<div class="flex-1">
			<Label for="endTime">End Time</Label>
			<Input id="endTime" name="endTime" type="time" required />
		</div>
	</div>
	<div>
		<Label for="description">Description</Label>
		<Input id="description" name="description" type="text" required />
	</div>
	{#if formError}
		<div class="text-red-600">{formError}</div>
	{/if}
	{#if formSuccess}
		<div class="text-green-600">Entry added!</div>
	{/if}
	<Button type="submit">Add Time Entry</Button>
</form>

<form method="post" action="?/logout">
	<Button type="submit">
		Sign out
	</Button>
</form>
