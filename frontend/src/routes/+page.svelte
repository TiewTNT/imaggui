<script lang="ts">
	import { FileUpload } from "@skeletonlabs/skeleton-svelte";
	import Widget from "./Widget.svelte";
	import { dndzone } from "svelte-dnd-action";
	import { onMount } from "svelte";

	// A template is a tool configuration string
	type Template = {
		id: number;
		tool: string;
		format: string; // e.g. "$1x$2"
		template: string; // display version with types, e.g. "Resize: $1n×$2n"
		value: string[]; // user-provided values from Widget
	};

	let templates: Template[] = [
		{
			id: 1,
			tool: "resize",
			format: "$1x$2",
			template: "Resize: $1n×$2n",
			value: [],
		},
		{
			id: 2,
			tool: "rotate",
			format: "$1",
			template: "Rotate by $1n degrees",
			value: [],
		},
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
	const reordered = e.detail.items;
	// Instead of mapping to new objects, reorder the array in place:
	templates = reordered.map((newItem) => {
		return templates.find((t) => t.id === newItem.id)!;
	});
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

		const res = await fetch("http://localhost:10000/api", {
			method: "POST",
			body: formData,
		});

		if (!res.ok) {
			console.error("Upload failed:", await res.json());
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
</script>

<section class="space-y-4 p-6">
	<h1 class="text-2xl font-bold">Upload your files</h1>

	<FileUpload
		name="files"
		accept="image/*"
		onFileChange={handleUpload}
		maxFiles={150}
		classes="w-full"
	/>

	<select
		bind:value={outputFormat}
		class="select text-base-content"
		style="background-color: var(--color-surface-950); color: var(--color-surface-50);"
	>
		<option value="png">PNG</option>
		<option value="jpg">JPG</option>
		<option value="gif">GIF</option>
		<option value="webp">WEBP</option>
		<option value="avif">AV1</option>
	</select>

	<button
		class="btn preset-filled-primary-500"
		on:click={upload}
		disabled={!files.length}
	>
		Upload
	</button>

	<section
		use:dndzone={{
			items: templates,
			flipDurationMs: 150,
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
		class="grid bg-transparent"
	>
		{#each templates as t (t.id)}
			<div class="grid p-2 bg-transparent drag-handle content-center">
				<Widget bind:value={t.value} template={t.template} />
			</div>
		{/each}
	</section>
</section>
