<script lang="ts">
	import { cn } from '$lib/utils';
	import { CaretCircleLeft } from 'phosphor-svelte';

	let { class: className = '' } = $props();
</script>

<a href="/">
	<p class={cn('flex items-center gap-2 text-muted-foreground hover:underline', className)}>
		<CaretCircleLeft size={20} weight="bold" />Back
	</p>
</a>
