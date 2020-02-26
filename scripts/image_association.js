// Dom Elements
const eleBlanks = document.getElementById('fillBlanks'),
    eleShuffledArray = document.getElementById('shuffledArray'),
    eleNextStageButton = document.getElementById('nextStageButton'),
    eleCssHead = document.getElementById('cssHead'),
    eleResetButton = document.getElementById('resetButton'),
    eleImage = document.getElementById('question_image'),
    elefirst=document.getElementById('firh'),
    elethird=document.getElementById('thirh');


var startBtnClickCount = 0;
// const eleImageCaption = document.getElementById('captionImage')


// audio looping elements
var audio_sources;
var firstQuestion = true;
var cbfnc;

var api_token;

// static elements
const domainName = APP_URL
let getURL = "http://15.206.80.44/api/v2/english/8/1/get_data"
let postURL = domainName + "/api/v2/english/" + module_id + "/1/post_user_response"
let currentData,
    startTime, correctAnswer, userAnswer, questionId, status, isAnswerCorrect = false;

api_token = getCookie('api_token');

const makeElement = (type, elementID, elementClass, value = "", text = "", width = null)=>{
    let element = document.createElement(type)
    element.id = elementID
    element.className = elementClass
    element.value = value
    element.innerText = text
    if(width != null){
        element.width = width
    }
    return element
}

const updateInput = (event) =>{
    // console.log('fired updateInput');
    let input = eleBlanks.getElementsByTagName('input')[0]
    input.value = event.target.innerText
	userAnswer = input.value
}

const setModule = () =>{

    eleBlanks.innerHTML = ""
    eleShuffledArray.innerHTML=""

    // const question = currentData.question
    correctAnswer = currentData.answer.toString()
    correctAnswer = correctAnswer.toLowerCase()
    const optionsArray = currentData.shuffled

    eleImage.setAttribute("src",currentData.asset)
    elefirst.append(currentData.question[0].value);
    elethird.append(currentData.question[2].value);

    const requiredAnswer = makeElement('input', `question`, 'col-auto blank-input')
    // requiredAnswer.addEventListener('change', speakWord)
    eleBlanks.append(requiredAnswer)

    for (let i = 0; i < optionsArray.length; i++) {
        const day = makeElement('div', `day${i}`, 'col-auto box', "", optionsArray[i])
        day.addEventListener('click', updateInput)
        day.addEventListener('click', function (){option_click_sound(currentData.options_mp3[i]);})
        eleShuffledArray.append(day)
    }
}

const resetModule = (event) =>{
    eleBlanks.getElementsByTagName('input')[0].value = ""
}

const updateUserData = (dataObject) => {
    startTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    currentData = dataObject
    questionId = currentData.question_id

    audio_sources = [currentData.answer_mp3];
    audio_reinit_next_question();

    setModule()
}

const getMethod = (url) => {

    set_load_screen();
    $.ajax({
        url: url,
        type: 'GET',
        headers: {
            'Authorization': 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt',
            'Accept': 'application/json'
        },
        success: function (response) {
            console.log(response);
            console.log("GOT GET RESPONSE SUCCESSFULLY");
            destroy_load_screen();
            updateUserData(response.data)
        },
        error: function (error) {
            console.log(error);
        }
    })
}

const postMethod = (url) => {
    let data = {
        start_time: startTime,
        end_time: endTime,
        user_response: userAnswer,
        question_id: questionId,
    }
    // console.log(data);

    set_load_screen();
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'Authorization': 'UKreajCWVVzA8vJ9ZB6oyFSvlqkINTHvD2vGeNxBcaG9UtJDxYnftOOc1yVt',
            'Accept': 'application/json'
        },
        data: data,
        // contentType: 'application/json; charset=utf-8',
        success: function (response) {
            // console.log("GOT POST RESPONSE SUCCESSFULLY");
            destroy_load_screen();
            handlePostResponse(response.data)
        },
        error: function (error) {
            console.log(error);
        }
    })

}



const handlePostResponse = (dataObject) => {
    // console.log(dataObject);
    if (dataObject.state == 0){ //next question
        firstQuestion = false;
        getURL = dataObject.get_url
        postURL = dataObject.post_url
        getMethod(getURL)
    }
    else if (dataObject.state == 1){ //next module
        window.location = dataObject.get_url
    }
    else if (dataObject.state == 2){ // wrong answer
        startTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        // resetModule()
        eleInput = eleBlanks.getElementsByTagName('input')[0]
        eleInput.classList.add('incorrect_answer')
        document.addEventListener('click',function(){eleInput.classList.remove('incorrect_answer');resetModule();},{once:true, capture:true})
        document.addEventListener('keydown',function(){eleInput.classList.remove('incorrect_answer');resetModule();},{once:true, capture:true})
    }
}

const validateAnswer = (event)=>{
    endTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    userAnswer = eleBlanks.getElementsByTagName('input')[0].value

    if(userAnswer.toLowerCase() == correctAnswer){
        isAnswerCorrect = true
        eleNextStageButton.classList.remove('next-stage-btn-wobbel')
        // voiceAssistant(`Congratulations!! correct answer.`)
        // setUserData(new Date(), 0)


        eleCssHead.classList.add('right-ans')
        star_success();
        setTimeout(() => {
            // resetModule();
            eleCssHead.classList.remove('right-ans');
        }, 3000);
    }
    else{
        isAnswerCorrect = false
        eleNextStageButton.classList.add('next-stage-btn-wobbel')
        eleCssHead.classList.add('wrong-ans');
        setTimeout(() => { eleCssHead.classList.remove('wrong-ans'); }, 3000);
    }

    postMethod(postURL)
}

const renderInit = () => {
    getMethod(getURL)
}

function renderStart(){
    let btnStart = document.getElementById('startBtn');
    let [a,b,c,d] = document.getElementsByClassName('not-start');

    btnStart.onclick = ()=>{
        if (startBtnClickCount === 0){
            startBtnClickCount += 1;
            openNav();
        } else {
            renderInit();
            a.classList.remove('not-start');
            b.classList.remove('not-start');
            c.classList.remove('not-start');
            d.classList.remove('not-start');
            btnStart.classList.add('not-start');
        }
    };
}



// Event Bindings here


window.addEventListener('load', renderStart)

eleNextStageButton.addEventListener('click', validateAnswer)

eleResetButton.addEventListener('click', resetModule)
