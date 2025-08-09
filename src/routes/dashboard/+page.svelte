<script lang="ts">
import type { PageData } from './$types';
import { Button } from "$lib/components/ui/button/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { Label } from "$lib/components/ui/label/index.js";
import * as Dialog from "$lib/components/ui/dialog";
import { goto } from '$app/navigation';
import { formatDateToGerman, formatMonthYearToGerman } from '$lib/utils';

export let data: PageData;
let formError: string | null = null;
let formSuccess: boolean = false;

// Edit modal state
let showEditModal = false;
let editingEntry: typeof data.timeEntries[number] | null = null;

function openEditModal(entry: typeof data.timeEntries[number]) {
  editingEntry = { ...entry };
  showEditModal = true;
  formError = null;
  formSuccess = false;
}

function closeEditModal() {
  showEditModal = false;
  editingEntry = null;
  formError = null;
  formSuccess = false;
}

// Handle form submission
async function handleSubmit(event: SubmitEvent) {
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
	
    if (result.status === 200) {
      formSuccess = true;
      closeEditModal();
      // Refresh the page to show updated data
      window.location.reload();
    } else {
      formError = result.message || 'Failed to update time entry';
    }
  } catch (error) {
    formError = 'An error occurred while updating the time entry';
  }
}

// Month navigation logic
function getMonthName(month: string) {
  return formatMonthYearToGerman(month);
}

function changeMonth(offset: number) {
  const [year, monthNum] = data.selectedMonth.split('-').map(Number);
  const d = new Date(year, monthNum - 1 + offset);
  const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const url = new URL(window.location.href);
  url.searchParams.set('month', newMonth);
  goto(url.pathname + url.search);
}
</script>

<!-- Quick Time Entry Form (Mobile-First, prominent) -->
<section class="w-full max-w-lg mx-auto mt-4 mb-8">
	<h1 class="text-2xl font-bold mb-2 text-center">Quick Time Entry</h1>
	<form method="post" action="?/addTimeEntry" class="rounded-lg shadow p-4 flex flex-col gap-4 sticky-form" autocomplete="off">
		<div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
			<div class="flex-1">
				<Label for="date">📅 Date</Label>
				<Input id="date" name="date" type="date" required value={new Date().toISOString().slice(0, 10)} autofocus class="w-full" />
			</div>
			<div class="flex-1">
				<Label for="startTime">⏰ From</Label>
				<Input id="startTime" name="startTime" type="time" required class="w-full" />
			</div>
			<div class="flex-1">
				<Label for="endTime">⏱️ To</Label>
				<Input id="endTime" name="endTime" type="time" required class="w-full" />
			</div>
		</div>
		<div>
			<Label for="description">📝 Description</Label>
			<Input id="description" name="description" type="text" required class="w-full" placeholder="What did you do?" maxlength={100} />
		</div>
		{#if formError}
			<div class="text-red-600 text-sm">{formError}</div>
		{/if}
		{#if formSuccess}
			<div class="text-green-600 text-sm">Entry added!</div>
		{/if}
		<Button type="submit" class="w-full py-3 text-lg font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-md sticky-btn">Add Time Entry</Button>
	</form>
</section>

<!-- Month Navigation -->
<div class="w-full max-w-lg mx-auto flex items-center justify-center gap-2 mt-4 mb-4">
  <Button type="button" on:click={() => changeMonth(-1)} aria-label="Previous month">←</Button>
  <span class="font-semibold">{getMonthName(data.selectedMonth)}</span>
  <Button type="button" on:click={() => changeMonth(1)} aria-label="Next month">→</Button>
</div>

<!-- Time Entries List (below form, mobile-friendly) -->
{#if data.timeEntries && data.timeEntries.length > 0}
	<section class="w-full max-w-lg mx-auto">
		<h2 class="mt-2 mb-2 text-lg font-semibold text-center">Your Time Entries</h2>
		{#each Object.entries(data.timeEntries.reduce((acc, entry) => {
			const date = entry.date;
			if (!acc[date]) acc[date] = [];
			acc[date].push(entry);
			return acc;
		}, {} as Record<string, typeof data.timeEntries>)).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) as [date, entries], i}
			<div class="mb-4">
				<h3 class="text-md font-semibold mb-2">{formatDateToGerman(date)}</h3>
				<ul class="space-y-2">
					{#each entries as entry (entry.id)}
						<li class="p-3 border rounded">
							<div class="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full items-start sm:items-center">
								<div>
									<span class="block text-xs text-gray-500">From</span>
									<span>{entry.startTime}</span>
								</div>
								<div>
									<span class="block text-xs text-gray-500">To</span>
									<span>{entry.endTime}</span>
								</div>
								<div class="flex-1 min-w-0">
									<span class="block text-xs text-gray-500">Description</span>
									<span class="truncate">{entry.description}</span>
								</div>
								<div class="flex-shrink-0">
									<Button 
										variant="outline"
										on:click={() => openEditModal(entry)}
									>
										Edit
									</Button>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</section>
{/if}

<style>
@media (max-width: 640px) {
  .sticky-btn {
	position: sticky;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 10;
	border-radius: 0 0 0.75rem 0.75rem;
  }
  .sticky-form {
	padding-bottom: 5rem;
  }
}

</style>

<Dialog.Root bind:open={showEditModal}>
	{#if editingEntry}
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Edit Time Entry</Dialog.Title>
				<Dialog.Description>
					Make changes to your time entry.
				</Dialog.Description>
			</Dialog.Header>

			<form 
				method="post" 
				action="?/updateTimeEntry" 
				class="flex flex-col gap-4" 
				on:submit|preventDefault={handleSubmit}
			>
				<input type="hidden" name="id" value={editingEntry.id} />
				{#if formError}
					<div class="text-red-600 text-sm">{formError}</div>
				{/if}
				
				<div>
					<Label for="edit-date">Date</Label>
					<Input 
						id="edit-date" 
						name="date" 
						type="date" 
						required 
						value={editingEntry.date} 
					/>
				</div>

				<div class="flex gap-4">
					<div class="flex-1">
						<Label for="edit-startTime">From</Label>
						<Input 
							id="edit-startTime" 
							name="startTime" 
							type="time" 
							required 
							value={editingEntry.startTime} 
						/>
					</div>
					<div class="flex-1">
						<Label for="edit-endTime">To</Label>
						<Input 
							id="edit-endTime" 
							name="endTime" 
							type="time" 
							required 
							value={editingEntry.endTime} 
						/>
					</div>
				</div>

				<div>
					<Label for="edit-description">Description</Label>
					<Input 
						id="edit-description" 
						name="description" 
						type="text" 
						required 
						value={editingEntry.description} 
						maxlength={100} 
					/>
				</div>

				<Dialog.Footer class="gap-2">
					<Dialog.Close>
						<Button type="reset" variant="outline">Cancel</Button>
					</Dialog.Close>
					<Button type="submit" variant="default">Save Changes</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	{/if}
</Dialog.Root>
