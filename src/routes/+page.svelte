<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import * as RadioGroup from '$lib/components/ui/radio-group/index';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { CirclePlus, KeyRound, LayoutDashboard, LogIn, LogOut } from 'lucide-svelte';
	import {
		partnerLockerRequestFormSchema,
		singleLockerRequestFormSchema,
		type PartnerLockerRequestFormSchema,
		type SingleLockerRequestFormSchema
	} from '$lib/form-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { authClient } from '$lib/auth/auth-client';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Badge } from '$lib/components/ui/badge';

	const session = authClient.useSession();

	$effect(() => {
		if ($session.data) {
			console.log('session:', $session.data.user);
		}
	});

	let {
		data
	}: {
		data: {
			singleForm: SuperValidated<Infer<SingleLockerRequestFormSchema>>;
			partnerForm: SuperValidated<Infer<PartnerLockerRequestFormSchema>>;
		};
	} = $props();

	const singleForm = superForm(data.singleForm, {
		validators: zodClient(singleLockerRequestFormSchema),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success('Request successfully submitted!');
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});
	const { form: singleFormData, enhance: singleEnhance } = singleForm;

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

	$inspect(data);
</script>

<main class="flex h-lvh select-none flex-col items-center justify-center gap-2">
    {#if $session.data}
        <p class="text-muted-foreground">
            Logged in as <strong>{$session.data.user.name}</strong>
        </p>
    {/if}
    <h1 class="scroll-m-20 text-5xl font-extrabold tracking-tight">Tino Lockers</h1>
    <p class="mb-4 leading-7">
        {#if $session.data?.user?.role === 'user'}
            One simple place to request a new locker!
        {:else if $session.data?.user?.role === 'admin'}
            One simple place to manage your lockers!
        {:else}
            Welcome to Tino Lockers!
        {/if}
    </p>
    {#if $session.data}
        <div class="flex gap-2">
            {#if $session.data.user?.role === 'user'}
                <Button href="#request"><CirclePlus /> Request a locker</Button>
                <Button href="/my-locker" variant="secondary"><KeyRound /> My locker</Button>
            {:else if $session.data.user?.role === 'admin'}
                <Button href="/admin"><LayoutDashboard /> Dashboard</Button>
            {/if}
            <Button
                variant="outline"
                onclick={async () => {
                    await authClient.signOut();
                }}><LogOut /> Sign out</Button
            >
        </div>
    {:else}
        <Button
            onclick={async () => {
                await authClient.signIn.social({
                    provider: 'google'
                });
            }}><LogIn /> Sign in with Google</Button
        >
    {/if}
</main>
{#if $session.data}
	{#if $session.data.user.role === 'user'}
		<div id="request" class="flex h-lvh flex-col items-center pt-20">
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Request a locker
			</h1>
			<Tabs.Root value="single" class="mt-10 w-[400px]">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="single">Single</Tabs.Trigger>
					<Tabs.Trigger value="partner">Partner</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="single">
					<form method="POST" use:singleEnhance class="mt-4 flex flex-col gap-y-4">
						<Form.Field form={singleForm} name="name">
							<Form.Control>
								<Form.Label>Full Name</Form.Label>
								<Input bind:value={$singleFormData.name} />
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
								<Input bind:value={$singleFormData.student_id} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field form={singleForm} name="requested_locker_id">
							<Form.Control>
								<Form.Label>Choose a locker #</Form.Label>
								<ScrollArea class="h-80 rounded-md border border-input"></ScrollArea>
							</Form.Control>
							<Form.FieldErrors />
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
						<Form.Button class="ml-auto">Submit</Form.Button>
					</form>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	{/if}
{/if}
