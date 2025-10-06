<script>
    let question = "";
    let answers = [""]
    
    export let toggleCreatePage
    export let addPoll;

    function addAnswer(){
        if(answers.length<6){
            answers = [...answers, ""]
        }
    }

</script>

<div class="modalBg">
    <div class="modal">
        <h2>Create poll</h2>
        <div class="inputRow">
            <div class="question-container">
                <input type="text" placeholder="Question" bind:value={question} autofocus="autofocus">
            </div>
            <div class="answer-container">
                {#each answers as answer, i}
                    <input type="text" placeholder="Answer" bind:value={answers[i]}>
                {/each}
                <button on:click={addAnswer} >Add answer</button>
            </div>
        </div>
        <div class="buttonRow">
            <button on:click={toggleCreatePage}>Cancel</button>
            <button class="primary" on:click={addPoll(question, answers)}>Save</button>
        </div>
    </div>
</div>
