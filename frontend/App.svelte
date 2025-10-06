<script>
    import Login from './lib/Login.svelte';
    import PollList from './lib/PollList.svelte'
    import {api} from './utils'
    import { CONFIG } from './constants.js'
    let user = {id: undefined, name: undefined}

    async function changeLoginStatus(username){        
        if (!username || username.trim() === '') {
            alert("Please enter a valid username");
            return;
        }

        let userDB = await api('api/users/'+username);
        if(userDB.length != 0){
            // User exists, log them in
            user.id = userDB.id
            user.name = username
            localStorage.setItem(CONFIG.STORAGE.USER_NAME, user.name)
            localStorage.setItem(CONFIG.STORAGE.USER_ID, user.id)
        }
        else{
            // User doesn't exist, create new user
            try {
                const newItem = await api(`api/users`, "POST", {'name': username});
                user.id = newItem.id
                user.name = username
                localStorage.setItem(CONFIG.STORAGE.USER_NAME, user.name)
                localStorage.setItem(CONFIG.STORAGE.USER_ID, user.id)
            } catch (error) {
                if (error.error === 'Username already exists') {
                    alert("This username is already taken. Please choose another one.");
                } else {
                    alert("Failed to create account. Please try again.");
                }
            }
        }        
    }
  // easier testing if disabled
//   if(localStorage.getItem("name")){
//     user.id = localStorage.getItem("id")
//     user.name = localStorage.getItem("name")
//   }
  



</script>

<main>
    <h1>Pollify</h1>
    {#if user.id}
        <PollList {user} />
    {:else}
        <Login {changeLoginStatus}/>
        <!-- <Game/> -->
    {/if}
</main>

<style>
</style>