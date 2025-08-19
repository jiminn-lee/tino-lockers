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
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import BackButton from '$lib/components/BackButton.svelte';
	import type { PageProps } from './$types';
	import { CheckCircle, User, Users } from 'phosphor-svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { page } from '$app/state';

	let {
		data
	}: PageProps & {
		data: {
			singleForm: SuperValidated<Infer<SingleLockerRequestFormSchema>>;
			partnerForm: SuperValidated<Infer<PartnerLockerRequestFormSchema>>;
		};
	} = $props();

	$inspect(data);

	const singleForm = superForm(data.singleForm, {
		validators: zodClient(singleLockerRequestFormSchema),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success('Request successfully submitted!');
			} else if (f.errors) {
				toast.error(f.message);
			}
		},
		delayMs: 500,
		timeoutMs: 8000
	});
	const { form: singleFormData, enhance: singleEnhance, message } = singleForm;

	console.log(message);

	const partnerForm = superForm(data.partnerForm, {
		validators: zodClient(partnerLockerRequestFormSchema),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success('Request successfully submitted!');
			} else if (f.errors) {
				toast.error(f.message);
			}
		}
	});

	const { form: partnerFormData, enhance: partnerEnhance } = partnerForm;
</script>

<main class="my-10 flex flex-col gap-10">
	<BackButton class="ml-10" />
	<div class="flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Request a Locker</h1>
		<Tabs.Root value="single" class="mt-10 w-[350px]">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="single"><User weight="bold" class="mr-2" /> Single</Tabs.Trigger>
				<Tabs.Trigger value="partner"><Users weight="bold" class="mr-2" />Partner</Tabs.Trigger>
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
							<div class="flex items-center space-y-0 space-x-2">
								<Form.Control>
									<RadioGroup.Item value="9" />
									<Form.Label class="font-normal">9</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-y-0 space-x-2">
								<Form.Control>
									<RadioGroup.Item value="10" />
									<Form.Label class="font-normal">10</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-y-0 space-x-2">
								<Form.Control>
									<RadioGroup.Item value="11" />
									<Form.Label class="font-normal">11</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-y-0 space-x-2">
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
					<Separator />
					<Form.Field form={singleForm} name="requested_locker_id">
						<Form.Control>
							<Form.Label>Choose a locker #</Form.Label>
							<ScrollArea class="border-input h-80 rounded-md border">
								<ToggleGroup.Root
									type="single"
									variant="outline"
									class="grid w-full grid-cols-6 gap-2 p-2"
									onValueChange={(v) => {
										$singleFormData.requested_locker_id = v;
									}}
								>
									{#each data.lockersData.singleLockers as singleLocker}
										<ToggleGroup.Item
											value={singleLocker.id}
											disabled={!singleLocker.available}
											class="rounded-md">{singleLocker.id}</ToggleGroup.Item
										>
									{/each}
								</ToggleGroup.Root>
							</ScrollArea>
						</Form.Control>
						<Form.FieldErrors />
						<input name="requested_locker_id" hidden value={$singleFormData.requested_locker_id} />
					</Form.Field>
					{#if !data.acceptingRequestsData.accepting_responses}
						<p class="text-muted-foreground text-center">
							Sorry! We are currently not accepting locker requests. Contact an administrator if you
							need one!
						</p>
					{:else if data.myLockerData.requests?.length > 0}
						{#if data.myLockerData.requests[0].status === 'pending'}
							<p class="text-muted-foreground text-center">
								You already have a pending locker request! Please wait until your request is
								reviewed by an administrator.
							</p>
						{:else if data.myLockerData.requests[0].status === 'approved'}
							<p class="text-muted-foreground text-center">
								You already have an approved locker! Contact an administrator if you want a new one!
							</p>
						{:else}
							<Form.Button class="ml-auto"><CheckCircle weight="bold" />Submit</Form.Button>
						{/if}
					{:else}
						<Form.Button class="ml-auto"><CheckCircle weight="bold" />Submit</Form.Button>
					{/if}
				</form>
			</Tabs.Content>
			<Tabs.Content value="partner">
				<form
					method="POST"
					action="?/requestPartnerLocker"
					use:partnerEnhance
					class="mt-4 flex flex-col gap-y-4"
				>
					<Form.Field form={partnerForm} name="primary_name">
						<Form.Control>
							<Form.Label>Your Full Name</Form.Label>
							<Input bind:value={$partnerFormData.primary_name} name="primary_name" />
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
							<div class="flex items-center space-y-0 space-x-2">
								<Form.Control>
									<RadioGroup.Item value="9" />
									<Form.Label class="font-normal">9</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-y-0 space-x-2">
								<Form.Control>
									<RadioGroup.Item value="10" />
									<Form.Label class="font-normal">10</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-y-0 space-x-2">
								<Form.Control>
									<RadioGroup.Item value="11" />
									<Form.Label class="font-normal">11</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-y-0 space-x-2">
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
							<Input
								bind:value={$partnerFormData.primary_student_id}
								type="number"
								class="[&::-webkit-inner-spin-button]:appearance-none"
								name="primary_student_id"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Separator />
					<Form.Field form={partnerForm} name="secondary_name">
						<Form.Control>
							<Form.Label>Partner Full Name</Form.Label>
							<Input bind:value={$partnerFormData.secondary_name} name="secondary_name" />
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
							<div class="flex items-center space-y-0 space-x-2">
								<Form.Control>
									<RadioGroup.Item value="9" />
									<Form.Label class="font-normal">9</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-y-0 space-x-2">
								<Form.Control>
									<RadioGroup.Item value="10" />
									<Form.Label class="font-normal">10</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-y-0 space-x-2">
								<Form.Control>
									<RadioGroup.Item value="11" />
									<Form.Label class="font-normal">11</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-y-0 space-x-2">
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
							<Input
								bind:value={$partnerFormData.secondary_student_id}
								type="number"
								class="[&::-webkit-inner-spin-button]:appearance-none"
								name="secondary_student_id"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Separator />
					<Form.Field form={partnerForm} name="requested_locker_id">
						<Form.Control>
							<Form.Label>Choose a locker #</Form.Label>
							<ScrollArea class="border-input h-80 rounded-md border">
								<ToggleGroup.Root
									type="single"
									variant="outline"
									class="grid w-full grid-cols-6 gap-2 p-2"
									onValueChange={(v) => {
										$partnerFormData.requested_locker_id = v;
									}}
								>
									{#each data.lockersData.partnerLockers as partnerLocker}
										<ToggleGroup.Item
											value={partnerLocker.id}
											disabled={!partnerLocker.available}
											class="rounded-md">{partnerLocker.id}</ToggleGroup.Item
										>
									{/each}
								</ToggleGroup.Root>
							</ScrollArea>
						</Form.Control>
						<Form.FieldErrors />
						<input name="requested_locker_id" hidden value={$partnerFormData.requested_locker_id} />
					</Form.Field>
					{#if !data.acceptingRequestsData.accepting_responses}
						<p class="text-muted-foreground text-center">
							Sorry! We are currently not accepting locker requests. Contact an administrator if you
							need one!
						</p>
					{:else if data.myLockerData.requests?.length > 0}
						{#if data.myLockerData.requests[0].status === 'pending'}
							<p class="text-muted-foreground text-center">
								You already have a pending locker request! Please wait until your request is
								reviewed by an administrator.
							</p>
						{:else if data.myLockerData.requests[0].status === 'approved'}
							<p class="text-muted-foreground text-center">
								You already have an approved locker! Contact an administrator if you want a new one!
							</p>
						{:else}
							<Form.Button class="ml-auto"><CheckCircle weight="bold" />Submit</Form.Button>
						{/if}
					{:else}
						<Form.Button class="ml-auto"><CheckCircle weight="bold" />Submit</Form.Button>
					{/if}
				</form>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</main>
