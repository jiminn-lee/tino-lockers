<script>
	import { Button } from '$lib/components/ui/button';
	import { CirclePlus } from 'lucide-svelte';
</script>

<main class="flex h-lvh select-none flex-col items-center justify-center gap-2">
	<h1 class="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		You don't have a locker yet...
	</h1>
	<Button href="/#request"><CirclePlus /> Request a locker</Button>
</main>
