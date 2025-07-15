<script lang="ts">
	import { FileUpload } from "@skeletonlabs/skeleton-svelte";
	import Widget from "./Widget.svelte";
	import { dndzone } from "svelte-dnd-action";
	import { onMount } from "svelte";
	import { nanoid } from "nanoid";
	import { flip } from "svelte/animate";
	import { all_templates_grouped } from "./Commands.js";
	

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
		type: string; // The type of the flag, pre-input: pi, global: gb, after input: in, pre-output: po
		format: string | string[]; // e.g. "$1x$2"
		template: string; // display version with types, e.g. "Resize: $1n×$2n"
		value: string[]; // user-provided values from Widget
		name: string; // Displayed name
	};

	let templates: Template[] = [

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

		let tools: Record<string, Array<string>> = {
			gb: [],
			pi: [],
			in: [],
			po: []
		}
		for (let t of templates) {
			if (Array.isArray(t.format)) {
				tools[t.type].push( ...t.format.map((fmt) =>
					fmt.replace(/\$([0-9]+)/g, (_, i) => t.value[+i - 1] ?? "")
				));
			} else {
				tools[t.type].push( 
					t.format.replace(/\$([0-9]+)/g, (_, i) => t.value[+i - 1] ?? "")
				);
			}
		}

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
		console.log(res);

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
<div class="w-full overflow-x-auto">
	<section
		class="min-w-[768px] sm:min-w-[1024px] lg:min-w-[1280px] mx-auto min-h-screen flex flex-col items-center bg-surface-900 px-4 pb-20"
	>
		<div
			class="w-full max-w-5xl space-y-10 p-6 sm:p-10 bg-surface-800/90 rounded-3xl shadow-2xl mt-12"
		>
			<h1 class="text-4xl font-extrabold text-surface-50 tracking-tight">
				Magick Web UI
			</h1>

			<FileUpload
				name="files"
				accept="image/*"
				onFileChange={handleUpload}
				maxFiles={150}
				maxFileSize={1024 * 1024 * 32}
			/>

			<div class="flex flex-wrap gap-4 items-center">
				<select
					bind:value={outputFormat}
					class="bg-primary-600 hover:bg-primary-500 text-primary-50 font-semibold text-lg px-6 py-2 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
				>
					<option value="png">PNG</option>
					<option value="jpg">JPG</option>
					<option value="gif">GIF</option>
					<option value="webp">WEBP</option>
					<option value="avif">AV1</option>
				</select>

				<button
					class="btn bg-primary-600 hover:bg-primary-500 text-white font-semibold text-lg px-6 py-2 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
					on:click={upload}
					disabled={!files.length}
				>
					Upload
				</button>
				<div class="grid">
				<a href="/about" class="text-primary-200">About</a>
				<a href="/licenses" class="text-primary-200">Third Party Licenses</a>
				</div>
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
				class="grid gap-5"
			>
				{#each templates as t (t.id)}
					<div
						class="rounded-2xl shadow-md bg-primary-600 p-5 flex items-center gap-4 drag-handle transition-transform hover:scale-[1.02]"
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

			<div class="flex flex-col gap-10 pt-8">
				{#each all_templates_grouped as group}
					<div class="pt-6 border-t border-surface-600">
						<h2 class="text-xl font-bold text-surface-100 mb-4">
							{group.name}
						</h2>
						<div class="flex flex-wrap justify-center gap-4">
							{#each group.commands as t}
								<button
									class="btn bg-primary-700 hover:bg-primary-600 text-white font-medium px-5 py-2 rounded-xl shadow-md transition-transform hover:scale-105"
									on:click={() => {
										templates = [
											...templates,
											structuredClone({
												...t,
												id: nanoid(),
											}),
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
</div>

<div
	class="sticky bottom-4 left-4 text-primary-50 text-xs px-3 py-1 rounded-md bg-surface-700/80 backdrop-blur-md z-50 select-none opacity-60 m-4 w-auto"
>
	1.3.7β
</div>
