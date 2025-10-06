<script>
    import { onMount } from 'svelte';
    import {sortByName, api} from "../utils";

    export let toggleVotesPage
    export let answers

    let votes = []

    onMount(async () => {
        if(answers){
            for(const answer of answers){
            let result = await api('api/answer/'+answer.id+'/votes/names');
            votes.push({'answer': answer.answer, 'votes': result})
            votes = votes

        }
        console.log('votes:', votes[0])
        }
    });

</script>

<div class="modalBg">
    <div class="modal">
        <h2>Votes</h2>
        <div class="inputRow">
            <div class="question-container" style="color:black;">
                {#each votes as vote}
                    <div class="answer-text">
                        <p><b>{vote.answer}:</b></p>
                    </div>
                    <div class="votes-text">
                        {#each vote.votes as user}
                            <p>{user.name}</p>
                        {/each}
                    </div>
                {/each}
            </div>
        </div>    
        <div class="buttonRow">
            <button on:click={toggleVotesPage}>Go back</button>
        </div>
    </div>
</div>