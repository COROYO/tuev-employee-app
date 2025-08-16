<script lang="ts">
import { t } from '$lib/translations';
let username = '';
let password = '';
let message = '';
let loading = false;

async function promote() {
  loading = true;
  message = '';
  try {
    const res = await fetch('/api/promote-to-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      message = 'User promoted to admin!';
    } else {
      message = 'Failed: ' + (data.error || 'Unknown error');
    }
  } catch (e) {
    message = 'Request failed.';
  }
  loading = false;
}
</script>

<main style="max-width: 320px; margin: 2rem auto; padding: 2rem; border: 1px solid #ccc; border-radius: 8px;">
  <h2>{$t('promote_user_to_admin')}</h2>
  <form on:submit|preventDefault={promote}>
    <div style="margin-bottom: 1rem;">
  <label for="username">{$t('username')}</label><br />
      <input id="username" bind:value={username} required style="width: 100%;" />
    </div>
    <div style="margin-bottom: 1rem;">
  <label for="password">{$t('password')}</label><br />
      <input id="password" type="password" bind:value={password} required style="width: 100%;" />
    </div>
  <button type="submit" disabled={loading} style="width: 100%;">{loading ? $t('submitting') : $t('promote')}</button>
  </form>
  {#if message}
    <div style="margin-top: 1rem; color: {message.startsWith('User promoted') ? 'green' : 'red'};">{message}</div>
  {/if}
</main>
