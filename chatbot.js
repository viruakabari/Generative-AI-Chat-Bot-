let prompt = document.querySelector("#prompt1");
let chatcontainer = document.querySelector(".chat-container");
let imgbtn = document.querySelector("#img");
let img = document.querySelector("#img img");
let imageinput=document.querySelector("#img input");

const api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAbHu3Tzogk8G1AGz-6XkLnDMEsujaQCuQ" 

let user={
    message:null,//for user chat
    file:{
        mime_type:null,
          data: null
    }

}
async function generateresponse(aichat) {

    let text=aichat.querySelector(".aichat-area")

    requestOption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({"contents": [{
        "parts":[{"text": user.message},(user.file.data?[{"inline_data":user.file}]:[])

        ]
        }]
       })
    }
    try{
    let response=await fetch(api_url,requestOption)//we are already getting the responses we need to post things,a variable is created
    let data=await response.json()
    let apiresponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
    // console.log(apiresponse);
    // console.log(data)
    text.innerHTML=apiresponse
    }
    catch(error){
        console.log(error)
    }
    finally{
        chatcontainer.scrollTo({top:chatcontainer.scrollHeight,behavior:"smooth"})
        user.file={}

    }
}

function createchatbox(html, classes) {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}

function handlechatresponse(message) {
    user.message=message
    let html = `<img src="user.png" alt="" id="userimg" width="50">
            <div class="uchat-area">
            ${user.message}
            ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}"class="chooseimg"/>`:""}
            </div>`
    prompt.value = ""//erases the prompt area after submitting
    let userchatbox = createchatbox(html, "user-chatbox")//create chatboxes as the prompt goes on
    chatcontainer.appendChild(userchatbox)
    chatcontainer.scrollTo({top:chatcontainer.scrollHeight,behavior:"smooth"})

    setTimeout(() => {
        let html = ` <img src="ai.png" alt="" id="aiimg" width="4%">
            <div class="aichat-area" >
            <img src="loading-5.gif" alt="" class="load" width="50px">
        </div>`
        let aichat = createchatbox(html, "ai-chatbox")
        chatcontainer.appendChild(aichat)
        generateresponse(aichat)
    }, 1000)
}

prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        handlechatresponse(prompt.value)
    }
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file)return
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
                mime_type:file.type,
                  data: base64string                
        }

    }

    reader.readAsDataURL(file)
})


imgbtn.addEventListener("click",()=>{
    imgbtn.querySelector("input").click()
})