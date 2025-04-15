<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import * as RadioGroup from '$lib/components/ui/radio-group/index';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/index';
	import { toast } from 'svelte-sonner';
	import {
		partnerLockerRequestFormSchema,
		singleLockerRequestFormSchema,
		type PartnerLockerRequestFormSchema,
		type SingleLockerRequestFormSchema
	} from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

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
</script>

<main class="flex h-lvh flex-col items-center justify-center gap-2">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Tino Lockers</h1>
	<p class="leading-7">One simple place to request a new locker!</p>
	<Button class="mt-4">Sign in with Google</Button>
	<Button class="mt-4" href="#request">Request a locker</Button>
</main>
<div id="request" class="flex h-lvh flex-col items-center pt-20">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Request a locker</h1>
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
				<hr />
				<Form.Field form={partnerForm} name="primary_student_id">
					<Form.Control>
						<Form.Label>Your Student ID</Form.Label>
						<Input bind:value={$partnerFormData.primary_student_id} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
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
