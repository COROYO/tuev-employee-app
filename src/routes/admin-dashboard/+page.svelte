<script lang="ts">
import { Button } from "$lib/components/ui/button/index.js";
import { enhance } from '$app/forms';
import type { User, TimeEntry } from "$lib/server/db/schema";

export let data: { users: User[]; timeEntries: TimeEntry[]; selectedDate: string };

import { goto } from '$app/navigation';

// Helper to format date as yyyy-mm-dd
function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}


const today = new Date();


function setDate(newDate: string) {
  // Update the URL with the new date, triggering a reload
  const url = new URL(window.location.href);
  url.searchParams.set('date', newDate);
  goto(url.pathname + url.search);
}

function changeDay(offset: number) {
  const d = new Date(data.selectedDate);
  d.setDate(d.getDate() + offset);
  setDate(formatDate(d));
}

function onDateInput(e: Event) {
  const input = e.target as HTMLInputElement;
  setDate(input.value);
}

function entriesByUserForSelectedDate() {
  const result: Record<string, TimeEntry[]> = {};
  for (const user of data.users) {
    result[user.id] = data.timeEntries.filter(e => e.userId === user.id);
  }
  return result;
}
</script>
  <section class="w-full max-w-6xl mx-auto mt-8 mb-8">
    <h1 class="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
    <p class="mb-6 text-center">Overview of all users' time entries for a specific day.</p>
    <div class="flex items-center justify-center gap-2 mb-6">
      <Button type="button" on:click={() => changeDay(-1)} aria-label="Previous day">←</Button>
      <input
        type="date"
        value={data.selectedDate}
        on:input={onDateInput}
        class="border rounded px-2 py-1"
        max={formatDate(today)}
      />
      <Button type="button" on:click={() => changeDay(1)} aria-label="Next day">→</Button>
    </div>
    <div class="flex gap-6 overflow-x-auto">
      {#each data.users as user}
        <div class="flex-1 min-w-[220px]">
          <h2 class="text-lg font-semibold mb-2 text-center">{user.username}</h2>
          <div class="flex flex-col gap-2">
            {#each entriesByUserForSelectedDate()[user.id] as entry (entry.id)}
              <div class="bg-blue-500/30 border border-blue-500 rounded p-2 text-xs mb-1 relative">
                <div class="font-bold">{entry.date} {entry.startTime}–{entry.endTime}</div>
                <div>{entry.description}</div>
              </div>
            {:else}
              <div class="text-xs text-gray-400 text-center">No entries</div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>
