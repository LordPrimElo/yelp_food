//==============================================
// SELECT ElEMENTS
//==============================================
const upvoteBtn = document.getElementById("foods_show-upvote_btn")
const downvoteBtn = document.getElementById("foods_show-downvote_btn")
const score = document.getElementById("food_show-vote_score")
const saveBtn = document.getElementById("save-btn")
const unsaveBtn = document.getElementById("unsave-btn")

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
        handleScore(res.score, res.code)
        

    })
    .catch(err => console.log(err))
}


const handleScore = (newScore, code) => {
    score.innerText = newScore
    if (code === 0) {
        upvoteBtn.classList.remove("btn-success")
        upvoteBtn.classList.add("btn-outline-success")
        downvoteBtn.classList.remove("btn-danger")
        downvoteBtn.classList.add("btn-outline-danger")
    } else if (code === 1) {
        upvoteBtn.classList.add("btn-success")
        upvoteBtn.classList.remove("btn-outline-success")
        downvoteBtn.classList.remove("btn-danger")
        downvoteBtn.classList.add("btn-outline-danger")
    } else if (code === -1) {
        upvoteBtn.classList.remove("btn-success")
        upvoteBtn.classList.add("btn-outline-success")
        downvoteBtn.classList.add("btn-danger")
        downvoteBtn.classList.remove("btn-outline-danger")
    } else {
        res.send("bruh, how the frick did you get here?")
    }
}

const save = async () => {
    const options = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({foodId})
    }

    await fetch(`/foods/${foodId}/save`, options)
    .then(data => data.json())
    .then(res => console.log(res))
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

saveBtn.addEventListener("click", async function() {
    save()
})

unsaveBtn.addEventListener("click", async function() {
    save()
})