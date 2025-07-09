<script lang="ts">
	import { FileUpload } from "@skeletonlabs/skeleton-svelte";
	import Widget from "./Widget.svelte";
	import { dndzone } from "svelte-dnd-action";
	import { onMount } from "svelte";
	import { nanoid } from "nanoid";

	// A template is a tool configuration string
	type Template = {
		id: string;
		tool: string;
		format: string; // e.g. "$1x$2"
		template: string; // display version with types, e.g. "Resize: $1n×$2n"
		value: string[]; // user-provided values from Widget
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

	let all_templates: Template[] = [
		{
			id: nanoid(),
			tool: "resize",
			format: "$1x$2",
			template: "Resize: $1n×$2n",
			value: ["1000", "1000"],
		},
		{
			id: nanoid(),
			tool: "rotate",
			format: "$1",
			template: "Rotate by $1n degrees clockwise",
			value: ["90"],
		},
		{
			id: nanoid(),
			tool: "blur",
			format: "0x$1",
			template: "Blur $1n",
			value: ["5"],
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

	function deleteWidget(id: string) {
		templates = templates.filter((t) => t.id !== id);
	}
</script>

<section class="min-h-screen flex flex-col items-center justify-start bg-surface-900 p-0">
    <div class="w-full max-w-2xl space-y-6 p-8 bg-surface-800/80 rounded-2xl shadow-xl mt-10">
        <h1 class="text-3xl font-extrabold tracking-tight text-surface-50 mb-4">Upload your files</h1>

        <FileUpload
            name="files"
            accept="image/*"
            onFileChange={handleUpload}
            maxFiles={150}
            classes="w-full"
        />

        <div class="flex gap-3 items-center">
            <select
                bind:value={outputFormat}
                class="select select-filled-primary-500 w-fit bg-primary-950 text-surface-50 border-none focus:ring-primary-500 rounded-xl"
            >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="gif">GIF</option>
                <option value="webp">WEBP</option>
                <option value="avif">AV1</option>
            </select>

            <button
                class="btn btn-filled-primary-500 px-6 py-2 font-bold text-lg rounded-xl shadow transition disabled:opacity-40 disabled:cursor-not-allowed"
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
            }}
            on:consider={handleDndConsider}
            on:finalize={handleDndFinalize}
            class="grid gap-4"
        >
            {#each templates as t (t.id)}
                <div class="rounded-xl shadow bg-primary-950 p-3 flex items-center drag-handle gap-4">
                    <Widget bind:value={t.value} template={t.template} on:delete={() => deleteWidget(t.id)} />
                </div>
            {/each}
        </section>

        <div class="flex gap-4 justify-center mt-8">
            {#each all_templates as t}
                <button
                    class="btn btn-filled-primary-500 font-semibold px-4 py-2 rounded-xl shadow transition"
                    on:click={() => {
                        templates = [
                            ...templates,
                            structuredClone({ ...t, id: nanoid() }),
                        ];
                    }}
                >
                    {t.tool.toUpperCase()}
                </button>
            {/each}
        </div>
    </div>
</section>
