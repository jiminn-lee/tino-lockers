<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	let { id } = $props();
</script>

<div class="flex gap-1">
	<Button>Approve</Button>
	<Button variant="outline">Deny</Button>
</div>
