<script lang="ts">
	import type { PageServerData } from './$types';
	import { Button } from "$lib/components/ui/button/index.js";

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>
<form method="post" action="?/logout">
	<Button type="submit">
        Sign out
    </Button>
</form>
