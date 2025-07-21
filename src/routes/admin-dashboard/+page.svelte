<script lang="ts">
import { Button } from "$lib/components/ui/button/index.js";
import { enhance } from '$app/forms';
</script>

<section class="w-full max-w-lg mx-auto mt-8 mb-8">
  <h1 class="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
  <p class="mb-6 text-center">Welcome, admin! Here you can manage users and view admin-only data.</p>
  <!-- Add admin-specific content here -->
  <form method="POST" action="?/logout" use:enhance class="w-full max-w-lg mx-auto mb-8">
    <Button type="submit" class="w-full">Logout</Button>
  </form>
</section>
