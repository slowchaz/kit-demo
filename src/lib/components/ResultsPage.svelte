<script lang="ts">
	import { media } from '$lib/api';
	import type { MovieListResult } from '$lib/types';
	import { createEventDispatcher, onMount } from 'svelte';

	export let movies: MovieListResult[];
	export let next: string | null;

	const dispatch = createEventDispatcher();

	let viewport: HTMLDivElement;
	let results: HTMLDivElement;
	let itemWidth: number;
	let itemHeight: number;
	let numColumns = 4;

	let a = 0;
	let b = movies.length;
	let paddingTop = 0;
	let paddingBottom = 0;

	function handleResize() {
		const first = results.firstChild as HTMLAnchorElement;

		itemWidth = first.offsetWidth;
		itemHeight = first.offsetHeight;
		numColumns = 4;

		handleScroll();
	}

	function handleScroll() {
		const remaining = viewport.scrollHeight - (viewport.scrollTop + viewport.clientHeight);

		if (remaining < 400) {
			dispatch('end');
		}

		a = Math.floor(viewport.scrollTop / itemHeight) * numColumns;
		b = Math.ceil((viewport.scrollTop + viewport.clientHeight) / itemHeight) * numColumns;

		paddingTop = Math.floor(a / numColumns) * itemHeight;
		paddingBottom = Math.floor((movies.length - b) / numColumns) * itemHeight;
	}

	onMount(handleResize);
</script>

<svelte:window on:resize={handleResize} />

<p>showing items {a} - {b}</p>

<div bind:this={viewport} class="viewport" on:scroll={handleScroll}>
	<div
		bind:this={results}
		class="results"
		style:padding-top="{paddingTop}px"
		style:padding-bottom="{paddingBottom}px"
	>
		{#each movies.slice(a, b) as movie}
			<a href="/movies/{movie.id}">
				<img alt={movie.title} src={media(movie.poster_path, 500)} />
			</a>
		{/each}
	</div>

	{#if next}
		<a href={next}>next page</a>
	{/if}
</div>

<style>
	.viewport {
		overflow-y: auto;
	}
	.results {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		width: 100%;
	}
	a {
		width: 100%;
		aspect-ratio: 2/3;
		height: auto;
		padding: 0.5rem;
	}

	img {
		width: 100%;
	}
</style>
