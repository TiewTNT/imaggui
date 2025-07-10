<script lang="ts">
	import { FileUpload } from "@skeletonlabs/skeleton-svelte";
	import Widget from "./Widget.svelte";
	import { dndzone } from "svelte-dnd-action";
	import { onMount } from "svelte";
	import { nanoid } from "nanoid";
	import { flip } from "svelte/animate";
	import {all_templates_grouped} from "./Commands.js"

	function toTitleCase(str: string) {
		return str
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	// A template is a tool configuration string
	type Template = {
		id: string;
		tool: string;
		format: string; // e.g. "$1x$2"
		template: string; // display version with types, e.g. "Resize: $1n×$2n"
		value: string[]; // user-provided values from Widget
		name: string; // Displayed name
	};

	let templates: Template[] = [
		// {
		// 	id: nanoid(),
		// 	tool: "resize",
		// 	format: "$1x$2",
		// 	template: "Resize: $1n×$2n",
		// 	value: [],
		// },
		// {
		// 	id: nanoid(),
		// 	tool: "rotate",
		// 	format: "$1",
		// 	template: "Rotate by $1n degrees",
		// 	value: [],
		// },
	];


	

	let files: File[] = [];
	let outputFormat: string = "png";

	function handleUpload(event: any) {
		files = event.acceptedFiles;
		console.log("Picked files:", files);
	}

	function handleDndConsider(e: CustomEvent) {
		templates = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent) {
		const reordered = e.detail.items as Template[];
		// This assumes e.detail.items contains the *actual* objects, not copies
		templates = reordered;
	}

	async function upload() {
		const formData = new FormData();

		for (const file of files) {
			formData.append("files", file);
		}

		formData.append("output_format", outputFormat);

		const tools = Object.fromEntries(
			templates.map((t) => {
				const formatted = t.format.replace(/\$([0-9]+)/g, (_, i) => {
					return t.value[parseInt(i) - 1] ?? "";
				});
				return [t.tool, formatted];
			}),
		);

		formData.append("tools", JSON.stringify(tools));

		console.log("[DEBUG] FormData:", [...formData.entries()]);

		const promise = fetch("/api", {
			method: "POST",
			body: formData,
		});

		await toaster.promise(promise, {
			loading: { title: "Processing...", description: "Please wait" },
			success: {
				title: "Process successful. ",
				description: "At least I THINK so...",
			},
			error: {
				title: "An error occured.",
				description: "",
			},
		});

		const res = await promise;
		console.log(res)

		if (!res.ok) {
			let res_json = await res.json();
			console.error("Upload failed:", res_json);
			toaster.error({
				title: res_json.error,
				description: res_json.message,
			});
			return;
		}

		const blob = await res.blob();
		const url = URL.createObjectURL(blob);

		let filename = "output";
		const disposition = res.headers.get("content-disposition");
		if (disposition?.includes("filename=")) {
			const match = disposition.match(
				/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
			);
			if (match?.[1]) filename = match[1].replace(/['"]/g, "");
		}

		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	onMount(() => {
		window.addEventListener("dragover", (e) => e.preventDefault());
		window.addEventListener("drop", (e) => e.preventDefault());
	});

	function deleteWidget(id: string) {
		templates = templates.filter((t) => t.id !== id);
	}

	import { Toaster, createToaster } from "@skeletonlabs/skeleton-svelte";

	const toaster = createToaster({
		placement: "bottom-end",
	});
</script>

<Toaster {toaster}></Toaster>
<section
	class="min-h-screen flex flex-col items-center bg-surface-900 overflow-x-hidden px-4 pb-20"
>
	<div
		class="w-full max-w-5xl space-y-8 p-6 sm:p-10 bg-surface-800/90 rounded-2xl shadow-2xl mt-10"
	>
		<h1 class="text-4xl font-extrabold tracking-tight text-surface-50">
			Magick Web UI
		</h1>

		<FileUpload
			name="files"
			accept="image/*"
			onFileChange={handleUpload}
			maxFiles={150}
			classes="w-full"
			maxFileSize={1024 * 1024 * 32}
		/>

		<div class="flex flex-wrap gap-4 items-center">
			<select
				bind:value={outputFormat}
				class="select select-filled-primary-500 bg-primary-950 text-surface-50 border-none focus:ring-primary-500 rounded-xl"
			>
				<option value="png">PNG</option>
				<option value="jpg">JPG</option>
				<option value="gif">GIF</option>
				<option value="webp">WEBP</option>
				<option value="avif">AV1</option>
			</select>

			<button
				class="btn btn-filled-primary-500 px-6 py-2 font-bold text-lg rounded-xl shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
				on:click={upload}
				disabled={!files.length}
			>
				Upload
			</button>
		</div>

		<section
			use:dndzone={{
				items: templates,
				flipDurationMs: 150,
				dropTargetStyle: {
					outline: "2px dashed var(--color-primary-600)",
					background: "transparent",
					borderRadius: "0.75rem",
				},
			}}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}
			class="grid gap-4"
		>
			{#each templates as t (t.id)}
				<div
					class="rounded-xl shadow-lg bg-primary-950 p-4 flex items-center drag-handle gap-4 transition-all"
					animate:flip={{ duration: 50 }}
				>
					<Widget
						bind:value={t.value}
						template={t.template}
						on:delete={() => deleteWidget(t.id)}
					/>
				</div>
			{/each}
		</section>

		<div class="flex flex-wrap justify-center gap-3 pt-6">
			{#each all_templates_grouped as group}
				<div class="border-t border-surface-500">
					<h2 class="">{group.name}</h2>
					<div class="flex flex-wrap justify-center gap-3 pt-6">
						{#each group.commands as t}
							<button
								class="btn btn-filled-primary-500 font-medium px-5 py-2 rounded-xl shadow hover:scale-105 transition-transform"
								on:click={() => {
									templates = [
										...templates,
										structuredClone({ ...t, id: nanoid() }),
									];
								}}
							>
								{toTitleCase(t.name)}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
