<script lang="ts">
      import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  export let template: string = "I $1+HELLO+$2";
  export let value: string[] = [];

  type TextPart = { type: "text"; content: string };
  type InputPart = { type: "input"; index: number; in_type: string };
  type Part = TextPart | InputPart;

  let parts: Part[] = [];

  function parseTemplate(str: string): Part[] {
    const regex = /\$[0-9]+[a-zA-Z]|\+|[^$+]+/g;
    const raw = str.match(regex) ?? [];

    return raw.reduce<Part[]>((acc, token) => {
      const match = token.match(/^\$([0-9]+)([a-zA-Z])$/);
      if (match) {
        const index = parseInt(match[1], 10) - 1;
        const in_type = match[2];
        acc.push({ type: "input", index, in_type });
      } else {
        acc.push({ type: "text", content: token });
      }
      return acc;
    }, []);
  }

  $: parts = parseTemplate(template);

  const input_types: Record<string, string> = {
    t: "text",
    n: "number",
    p: "password",
    d: "date",
    c: "color",
  };


</script>

<br />
<span class="flex bg-primary-950 p-5 rounded-xl shadow-lg">
  {#each parts as part}
    {#if part.type === "text"}
      {@html part.content}
    {:else if part.type === "input"}
      <input
        bind:value={value[part.index]}
        class="inline-input input input-filled input-primary"
        style="margin: 0 0.25rem;"
        type={input_types[part.in_type]}
      />
    {/if}
  {/each}
  <button
    aria-label="Delete"
    on:click={() => dispatch('delete')}
    class="btn btn-icon btn-ghost hover:bg-primary-700 rounded-full ml-3"
    style="padding: 0.375rem;"
  >
    <img src="/x.svg" alt="Cross" class="w-5 h-5" />
  </button>
</span>

<style>
  .inline-input {
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 2px 4px;
    width: 100px;
    font-size: 1rem;
  }
</style>
