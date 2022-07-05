//==============================================
// SELECT ElEMENTS
//==============================================
const upvoteBtn = document.getElementById("foods_show-upvote_btn")
const downvoteBtn = document.getElementById("foods_show-downvote_btn")

//==============================================
// HELPER FUNCTIONS
//==============================================
const sendVote = async (voteType) => {
    // Build fetch options
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    if (voteType === "up") {
        options.body = JSON.stringify({
            voteType,
            foodId
        })
    } else if (voteType === "down") {
        options.body = JSON.stringify({
            voteType,
            foodId
        })
    } else {
        throw "voteType must be 'up' or 'down'"
    }

    // Send fetch req
    await fetch("/foods/vote", options)
    .then(data => {
        return data.json()
    })
    .then(res => {
        console.warn(res)
    })
    .catch(err => console.log(err))
}

//==============================================
// ADD EVENT LISTENERS
//==============================================
upvoteBtn.addEventListener("click", async function() {
    sendVote("up")
})

downvoteBtn.addEventListener("click", async function() {
    sendVote("down")
}) 