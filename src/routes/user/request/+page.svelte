<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form/index';
	import * as RadioGroup from '$lib/components/ui/radio-group/index';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { Input } from '$lib/components/ui/input';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import {
		partnerLockerRequestFormSchema,
		singleLockerRequestFormSchema,
		type PartnerLockerRequestFormSchema,
		type SingleLockerRequestFormSchema
	} from '$lib/form-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageProps } from '../../$types';
	import { CircleArrowLeft } from 'lucide-svelte';

	let { data } = $props();

	const singleForm = superForm(data.singleForm, {
		validators: zodClient(singleLockerRequestFormSchema),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success('Request successfully submitted!');
			} else {
				toast.error('Please fix the errors in the form.');
			}
		},
		delayMs: 500,
		timeoutMs: 8000
	});
	const { form: singleFormData, enhance: singleEnhance, delayed } = singleForm;

	const partnerForm = superForm(data.partnerForm, {
		validators: zodClient(partnerLockerRequestFormSchema),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success('Request successfully submitted!');
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});
	const { form: partnerFormData, enhance: partnerEnhance } = partnerForm;

	$inspect($singleFormData);
</script>

<main class="mt-10 flex flex-col gap-10">
	<a href="/" class="ml-10">
		<p class="flex items-center gap-2 text-muted-foreground hover:underline">
			<CircleArrowLeft size={20} />Back
		</p>
	</a>
	<div id="request" class="flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Request a Locker</h1>
		<Tabs.Root value="single" class="mt-10 w-[400px]">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="single">Single</Tabs.Trigger>
				<Tabs.Trigger value="partner">Partner</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="single">
				<form
					method="POST"
					action="?/requestSingleLocker"
					use:singleEnhance
					class="mt-4 flex flex-col gap-y-4"
				>
					<Form.Field form={singleForm} name="name">
						<Form.Control>
							<Form.Label>Full Name</Form.Label>
							<Input bind:value={$singleFormData.name} name="name" />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Fieldset form={singleForm} name="grade">
						<Form.Legend>Grade</Form.Legend>
						<RadioGroup.Root bind:value={$singleFormData.grade} name="grade" class="flex gap-x-4">
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="9" />
									<Form.Label class="font-normal">9</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="10" />
									<Form.Label class="font-normal">10</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="11" />
									<Form.Label class="font-normal">11</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="12" />
									<Form.Label class="font-normal">12</Form.Label>
								</Form.Control>
							</div>
						</RadioGroup.Root>
						<Form.FieldErrors />
					</Form.Fieldset>
					<Form.Field form={singleForm} name="student_id">
						<Form.Control>
							<Form.Label>Student ID</Form.Label>
							<Input
								bind:value={$singleFormData.student_id}
								type="number"
								class="[&::-webkit-inner-spin-button]:appearance-none"
								name="student_id"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field form={singleForm} name="requested_locker_id">
						<Form.Control>
							<Form.Label>Choose a locker #</Form.Label>
							<ScrollArea class="h-80 rounded-md border border-input">
								<ToggleGroup.Root
									type="single"
									variant="outline"
									class="grid grid-cols-6 p-2"
									onValueChange={(v) => {
										$singleFormData.requested_locker_id = v;
									}}
								>
									{#each data.singleLockers as singleLocker}
										<ToggleGroup.Item value={singleLocker.id}>{singleLocker.id}</ToggleGroup.Item>
									{/each}
								</ToggleGroup.Root>
							</ScrollArea>
						</Form.Control>
						<Form.FieldErrors />
						<input name="requested_locker_id" hidden value={$singleFormData.requested_locker_id} />
					</Form.Field>
					<Form.Button class="ml-auto">Submit</Form.Button>
				</form>
			</Tabs.Content>
			<Tabs.Content value="partner">
				<form method="POST" use:partnerEnhance class="mt-4 flex flex-col gap-y-4">
					<Form.Field form={partnerForm} name="primary_name">
						<Form.Control>
							<Form.Label>Your Full Name</Form.Label>
							<Input bind:value={$partnerFormData.primary_name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Fieldset form={partnerForm} name="primary_grade">
						<Form.Legend>Your Grade</Form.Legend>
						<RadioGroup.Root
							bind:value={$partnerFormData.primary_grade}
							name="primary_grade"
							class="flex gap-x-4"
						>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="9" />
									<Form.Label class="font-normal">9</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="10" />
									<Form.Label class="font-normal">10</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="11" />
									<Form.Label class="font-normal">11</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="12" />
									<Form.Label class="font-normal">12</Form.Label>
								</Form.Control>
							</div>
						</RadioGroup.Root>
						<Form.FieldErrors />
					</Form.Fieldset>
					<Form.Field form={partnerForm} name="primary_student_id">
						<Form.Control>
							<Form.Label>Your Student ID</Form.Label>
							<Input bind:value={$partnerFormData.primary_student_id} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<hr />
					<Form.Field form={partnerForm} name="secondary_name">
						<Form.Control>
							<Form.Label>Partner Full Name</Form.Label>
							<Input bind:value={$partnerFormData.secondary_name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Fieldset form={partnerForm} name="secondary_grade">
						<Form.Legend>Partner Grade</Form.Legend>
						<RadioGroup.Root
							bind:value={$partnerFormData.secondary_grade}
							name="secondary_grade"
							class="flex gap-x-4"
						>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="9" />
									<Form.Label class="font-normal">9</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="10" />
									<Form.Label class="font-normal">10</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="11" />
									<Form.Label class="font-normal">11</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-x-2 space-y-0">
								<Form.Control>
									<RadioGroup.Item value="12" />
									<Form.Label class="font-normal">12</Form.Label>
								</Form.Control>
							</div>
						</RadioGroup.Root>
						<Form.FieldErrors />
					</Form.Fieldset>
					<Form.Field form={partnerForm} name="secondary_student_id">
						<Form.Control>
							<Form.Label>Partner Student ID</Form.Label>
							<Input bind:value={$partnerFormData.secondary_student_id} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					{#if $delayed}Loading...{/if}
					<Form.Button class="ml-auto">Submit</Form.Button>
				</form>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</main>
