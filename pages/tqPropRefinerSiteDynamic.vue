<script setup lang="ts">

const config = useRuntimeConfig()
const route = useRoute();

const simId = route.query.sim_id;

const res = await fetch("/api/getScenario", {
	method: "POST",
	body: JSON.stringify({
		simulationID: simId
	})
})
const body = await res.json()
const scenario = body.Scenario;

const responseIndex = Number.parseInt(route.query.response_index as any);

const response = scenario.responses[responseIndex];
const sel = response.SEL;
const tbvTimed = response.TBV_timed;
const predicates = JSON.stringify(response.predicates_info);

const src = computed(() => "http://"+config.public.tqPropRefinerDomain+":"+config.public.tqPropRefinerPort+"/requirement-refinement/dynamic?file-address=assets/simulations_results&sim_id="+simId+"&response_index="+responseIndex+"&sel="+sel+"&tbv_timed="+tbvTimed+"&predicates="+predicates)

</script>

<template>

	<!-- TODO add button style -->
  <h1 class="text-3xl">Refinement</h1>
  <br>

  <div class="flex justify-center">
    <iframe class="mainFrame"
            v-bind:src="src"
            title="SimpleTest"></iframe>
  </div>
  <br>

  <NuxtLink to="/scenariosSite">
    <UButton>Back to Scenarios</UButton>
  </NuxtLink>
</template>

<style scoped>
.mainFrame{
  width: 80%;
  height: 80vh;
  border: #3f51b5 3px solid;
}
</style>