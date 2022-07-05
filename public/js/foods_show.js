//==============================================
// SELECT ElEMENTS
//==============================================
const upvoteBtn = document.getElementById("foods_show-upvote_btn")
const downvoteBtn = document.getElementById("foods_show-downvote_btn")


//==============================================
// ADD EVENT LISTENERS
//==============================================
upvoteBtn.addEventListener("click", async function() {
    // Build fetch options
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({vote: "up"})
    }

    // Send fetch req
    await fetch("/foods/vote", options)
    .then(data => {
        return data.json()
    })
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err))
})