<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let template: string = "I $1+HELLO+$2";
  import { X } from "@lucide/svelte";

  export let value: string[] = [];

  type TextPart = { type: "text"; content: string };
  type InputPart = { type: "input"; index: number; in_type: string };
  type SelectPart = {
    type: "select";
    index: number;
    options: Record<string, string>;
  };
  type Part = TextPart | InputPart | SelectPart;

  let parts: Part[] = [];

  function parseTemplate(str: string): Part[] {
    const regex = /\$[0-9]+s\{[^}]*\}|\$[0-9]+[a-zA-Z]|\+|[^$+]+/g;

    const rawTokens = str.match(regex) ?? [];

    return rawTokens.reduce<Part[]>((acc, token) => {
      const inputMatch = token.match(/^\$([0-9]+)([a-rt-zA-RT-Z])$/);
      const selectMatch = token.match(/^\$([0-9]+)s\{(.*:.*;)*\}$/);

      if (inputMatch) {
        const index = parseInt(inputMatch[1], 10) - 1;
        const inputType = inputMatch[2];
        acc.push({ type: "input", index, in_type: inputType });
      } else if (selectMatch) {
        const index = parseInt(selectMatch[1], 10) - 1;
        const optionsBlock = selectMatch[0].slice(4, -1); // remove "$n" and trailing "}"
        const options: Record<string, string> = {};

        for (const pair of optionsBlock.split(";")) {
          if (pair.includes(":")) {
            const [key, value] = pair.split(":").map((s) => s.trim());
            options[key] = value;
          }
        }

        acc.push({ type: "select", index, options });
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
<span class="flex bg-primary-700 p-5 rounded-xl shadow-lg items-center h-32">
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
    {:else if part.type === "select"}
      <select
        bind:value={value[part.index]}
        class="bg-primary-600 hover:bg-primary-500 text-primary-50 
        text-md px-2 pr-12 py-2 rounded-xl shadow-sm transition-all 
        duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400
        text-left"
      >
        {#each Object.entries(part.options) as [key, value]}
          <option {value}>{key}</option>
        {/each}
      </select>
    {/if}
  {/each}
  <button
    aria-label="Delete"
    on:click={() => dispatch("delete")}
    class="btn btn-icon btn-ghost hover:bg-primary-700 rounded-full ml-3"
    style="padding: 0.375rem;"
  >
    <X />
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
