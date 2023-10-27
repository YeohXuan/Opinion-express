import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://opinion-express-c093e-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const topicInDB = ref(database, "Topics")
const opinionInDB = ref(database, "Opinions")
const usernameInDB = ref(database, "Usernames")

const inputTopic = document.getElementById("topic")
const inputOpinion = document.getElementById("opinion-input")
const inputUsername = document.getElementById("username")
const postBtn = document.getElementById("publish-btn")
const opinionEl = document.getElementById("opinion")

postBtn.addEventListener("click", function(){
    const inputValue = inputOpinion.value
    const topicValue = inputTopic.value
    const usernameValue = inputUsername.value

    if (inputValue) {
        push(opinionInDB, capitalizeFirstLetter(inputValue))

        if (topicValue) {
            push(topicInDB, capitalizeFirstLetter(topicValue))
        } else {
            push(topicInDB, 'Random')
        }
        if (usernameValue) {
            push(usernameInDB, '- ' + capitalizeFirstLetter(usernameValue) )
        } else {
            push(usernameInDB, '- Anonymous')
        }
    }

    inputOpinion.value = ""
    inputTopic.value = ""
    inputUsername.value = ""
})

onValue(opinionInDB, function(snapshot){
    if (snapshot.exists()) {
        const opinionData = snapshot.val()
        const opinionArray = Object.entries(opinionData)

        onValue(topicInDB, function(snapshot){
            const topicData = snapshot.val()
            const topicArray = Object.entries(topicData)

            onValue(usernameInDB, function(snapshot){
                const usernameData = snapshot.val()
                const usernameArray = Object.entries(usernameData)

                opinionEl.innerHTML = ""

                for (let i = 0; i < opinionArray.length; i++) {
                    let currentTopic = topicArray[i][1]
                    let currentOpinion = opinionArray[i][1]
                    let currentUsername = usernameArray[i][1]

                    appendOpinionToComments(currentTopic, currentOpinion, currentUsername)
                }
            })
        })
    }
})

function appendOpinionToComments(topic, opinion, username){
    const newEl = document.createElement("li")
    const newH3 = document.createElement("h3")
    const newH5 = document.createElement("h4")

    newH3.innerHTML += topic
    newEl.appendChild(newH3)

    newEl.innerHTML += opinion

    newH5.innerHTML += username
    newEl.appendChild(newH5)

    opinionEl.insertBefore(newEl, opinionEl.firstChild)
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}