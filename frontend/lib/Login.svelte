<script>
    export let changeLoginStatus;
    
    let username

</script>

<div class="login-screen">
  <div class="title">
      <h2 class="login-title">Enter Your Name</h2>
  </div>
  <div class="input-container">
      <input type="text" bind:value={username} name="Name" placeholder="Your name..." id="">
      <button on:click={changeLoginStatus(username)}>Enter</button>
  </div>
</div>