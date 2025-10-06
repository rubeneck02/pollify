<script>
    import { onMount, onDestroy } from 'svelte';
    import {sortByName, api} from "../utils";

    export let user
    export let answer
    export let total_vote_count

    let websocket
    let votes = []

    function setupWebSocket() {
        let wsUrl = `ws${location.protocol.slice(4)}//${location.host}/api`

        websocket = new WebSocket(wsUrl);

        websocket.onmessage = (event) => {
            let data = JSON.parse(event.data)
            if (data.command === 'setVoteAdd') {
                if(data.value.answerId == answer.id){
                    votes.push(data.value);
                    votes = votes
                    total_vote_count +=1
                }
            }

            if (data.command === 'setVoteDelete') {
                if(data.value.answerId == answer.id){
                    votes = votes.filter(vote => !(vote.answerId == data.value.answerId && vote.userId == data.value.userId));
                    total_vote_count -= 1
                }
            }

        }

        websocket.addEventListener('close', () => {
            hideTextarea();
            setTimeout(setupWebSocket, 2000);
        });
    }

    onMount(async () => {
        if(answer.id){
            let result = await api('api/answer/'+answer.id+'/votes');
            votes = result
            total_vote_count += votes.length
        }
    });

    // Keep global total consistent when this component is removed (e.g., toggling views)
    onDestroy(() => {
        if (votes && votes.length) {
            total_vote_count -= votes.length;
        }
    });

    async function voteAnswer(answerId){
        // Find whether current user has a vote for this answer
        let foundIndex = votes.findIndex(vote => vote.answerId == answerId && vote.userId == user.id)
        if(foundIndex == -1){
            votes.push({'answerId':answerId, 'userId': user.id})
            votes = votes
            total_vote_count += 1
            websocket.send(JSON.stringify({ command: 'addVote', value: {'answerId': answerId, 'userId':user.id} }));
            await api('api/answer/'+answerId+'/votes', 'POST', {'userId': user.id});
        }
        else{
            votes = votes.filter(vote => !(vote.userId === user.id && vote.answerId === answerId));
            total_vote_count -= 1
            websocket.send(JSON.stringify({ command: 'deleteVote', value: {'answerId': answerId, 'userId':user.id} }));
            await api('api/answer/'+answerId+'/votes/'+user.id, 'DELETE');

        }
    }

    setupWebSocket()

</script>

<div class="answer">
    <div class="left">
        {#if votes.some(vote => vote.answerId == answer.id && vote.userId === user.id)}
            <input type="checkbox" name="answers" id="{`answer_${answer.id}`}" checked on:click={() => voteAnswer(answer.id)}>
        {:else}
            <input type="checkbox" name="answers" id="{`answer_${answer.id}`}" on:click={() => voteAnswer(answer.id)}>
        {/if}
    </div>
    <div class="right">
        <div class="text-container">
            <div class="answer-text">
                <label for="{`answer_${answer.id}`}">{answer.answer}</label>
            </div>
            <div class="votes-text">
                <label for="{`answer_${answer.id}`}">votes: {votes.length}</label>
            </div>
        </div>
        <div class="bar" style="width: {total_vote_count === 0 ? 0 : 100 * votes.length / total_vote_count}%">
        </div>
    </div>
</div>
