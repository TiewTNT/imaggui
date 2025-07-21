<script>
    import { ChevronLeft } from "@lucide/svelte";
    export let data;
</script>

<section class="bg-surface-900 text-surface-100 min-h-screen px-6 py-10">
    <a href="/" class="flex items-center text-primary-400 mb-6">
        <ChevronLeft class="mr-2" /> Back
    </a>

    <h1 class="text-4xl font-extrabold mb-8 text-center text-primary-400">
        Third Party Licenses
    </h1>

    <div class="space-y-8">
        {#each data.licenses as license}
          {@html license.content}
        {/each}
    </div>
</section>
