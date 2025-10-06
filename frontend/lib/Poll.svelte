<script>
    import { onMount } from 'svelte';
    import {sortByName, api} from "../utils";
    import Answer from './Answer.svelte';
    import Votes from './Votes.svelte';
    import { CONFIG } from '../constants.js';

    export let user
    export let poll
    export let deletePoll

    let answers = []
    let total_vote_count = 0
    let showVotesPage = false

    async function loadAnswersAndVotes(){
        const data = await api('api/polls/'+poll.id+'/votes');
        answers = data;
        total_vote_count = data.reduce((sum, a) => sum + (a.votes?.length || 0), 0);
    }

    let websocket
    function setupWebSocket(){
        const wsUrl = `ws${location.protocol.slice(4)}//${location.host}${CONFIG.WS_PATH}`
        websocket = new WebSocket(wsUrl);
        websocket.onmessage = (event) => {
            let data = JSON.parse(event.data)
            if (data.command === CONFIG.WS_COMMANDS.ANSWER_CREATED) {
                const a = data.value;
                if (a.pollId === poll.id) {
                    if (!answers.some(x => x.id === a.id)) {
                        answers = [...answers, { id: Number(a.id), pollId: Number(a.pollId), answer: a.answer, votes: a.votes || [] }]
                    }
                }
            }
        }
    }

    onMount(() => {
        loadAnswersAndVotes();
        // extra catch-up in case answers are created right after poll broadcast
        setTimeout(loadAnswersAndVotes, 1000);
        setupWebSocket();
    });

    function toggleVotesPage(){
        if(showVotesPage){
            showVotesPage= false
        }else{
            showVotesPage = true
        }
    }

</script>


{#if answers}
    <div class="poll">
        <div class="top">
            <p>{poll.question}</p>
            <i class="material-icons" role="button" tabindex="0" on:click={deletePoll(poll.id)} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && deletePoll(poll.id)}>delete</i>
        </div>
        <div class="answers">
            {#if answers.length === 0}
                <p>No answers yet</p>
            {:else}
                {#each answers as answer (answer.id)}
                    <Answer {user} {answer} bind:total_vote_count={total_vote_count} />
                {/each}
            {/if}
        </div>
        <div class="see-votes-container">
            <button on:click={toggleVotesPage} disabled={answers.length === 0}>See votes</button>
        </div>
        {#if showVotesPage}
            <Votes {answers} {toggleVotesPage}/>
        {/if}
    </div>
{/if}

