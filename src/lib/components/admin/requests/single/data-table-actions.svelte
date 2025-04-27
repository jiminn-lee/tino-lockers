<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	let { id } = $props();
</script>

<div>
	<Button>Approve</Button>
	<Button variant="outline">Deny</Button>
</div>
