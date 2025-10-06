<script>
    import {sortByName, api} from "../utils";
    import CreatePoll from "./CreatePoll.svelte";
    import Poll from "./Poll.svelte";
    import { onMount } from 'svelte';
    import { CONFIG } from '../constants.js';

    export let user

    let showCreatePage = false
    let poll_list = [];
    let websocket

    function setupWebSocket(){
        const wsUrl = `ws${location.protocol.slice(4)}//${location.host}${CONFIG.WS_PATH}`
        websocket = new WebSocket(wsUrl);
        websocket.addEventListener('open', () => console.log('WS open'))
        websocket.onmessage = (event) => {
            let data = JSON.parse(event.data)
            console.log('WS message', data)
            if (data.command === CONFIG.WS_COMMANDS.POLL_CREATED) {
                const p = data.value;
                const newPoll = { id: Number(p.id), userId: p.userId, question: p.question }
                if (!poll_list.some(x => x.id === newPoll.id)) {
                    console.log('Adding poll from WS', newPoll)
                    poll_list = [...poll_list, newPoll]
                }
            } else if (data.command === CONFIG.WS_COMMANDS.POLL_DELETED) {
                const id = data.value.id;
                poll_list = poll_list.filter(p => p.id !== id);
            }
        }
        websocket.addEventListener('close', () => console.log('WS closed'))
        websocket.addEventListener('error', (e) => console.error('WS error', e))
    }

    onMount(async () => {
        poll_list = await api('api/polls');
        setupWebSocket();
    });

    function toggleCreatePage(){
        if(showCreatePage){
            showCreatePage= false
        }else{
            showCreatePage = true
        }
    }

    async function addPoll(question, answers){
        let new_poll = await api('api/polls', 'POST', {'userId': user.id, 'question': question })
        // creation will also arrive via websocket; we keep local add for responsiveness
        if (!poll_list.some(p => p.id === new_poll.id)) {
            poll_list = [...poll_list, {'id': new_poll.id, 'userId': user.id, 'question': question }]
        }
        answers = answers.filter(item => item.trim() !== '');

        for(const answer of answers){
            let new_answer= await api('api/polls/'+new_poll.id+'/answers', 'POST', {'answer': answer })
        }
        toggleCreatePage()
    }

    async function deletePoll(pollId){
        poll_list = poll_list.filter(poll => poll.id !== pollId);
        await api('api/polls/'+pollId, 'DELETE')
    }

</script>

<div class="poll-list">
    {#if showCreatePage}
        <CreatePoll {toggleCreatePage} {addPoll}/>
    {:else}
        <div class="title">
            <h2 class="login-title">Polls</h2>
        </div>
        <button on:click={toggleCreatePage}>Create poll</button>
        <div class="polls">
        {#each poll_list as poll}
            <Poll {user} {poll} {deletePoll} />
        {/each}
        </div>
    {/if}
</div>
