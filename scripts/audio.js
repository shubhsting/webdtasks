goToNextStage = () => {
    window.location.replace(next_stage_url);
};

showSuccessUI = () => {
    play_pause_audio();
    document.getElementById("module1-panel").innerHTML = `
    <div class="success">
        <div class="star">
            <span> <i class="fa fa-star" style="font-size:48px;"></i></span>
            <span> <i class="fa fa-star" style="font-size:64px;"></i></span>
            <span> <i class="fa fa-star" style="font-size:48px;"></i></span>
            <p class="success-txt">Congratulations</p>
        </div>
    </div>
    <div class="col-sm">
        <button type="button" class="btn btn-primary btn-lg btn-block next-stage-btn" onclick="goToNextStage()">Go to next stage</button>
    </div>`;
};

// play-pause functionality
$("#cssHead").on("click", function () {
    var audio = document.getElementById("loop_audio_player");
    if (audio.paused) {
        audio.play();
        // $(".vol-btn__icon").removeClass("fa-volume-up").addClass("fa-pause");
    } else {
        audio.pause();
        // $("#caption_text_value").removeClass("highlight_audio3");
        // $(".letter__text").removeClass("highlight_audio3");
        // $(".vol-btn__icon").removeClass("fa-pause").addClass("fa-volume-up");
    }
});


function play123(audio_el, source, callback) {
    audio_el.setAttribute("src", source);
    audio_el.play();
    // $(".vol-btn__icon").removeClass("fa-volume-up").addClass("fa-pause");
    if (callback) {
        //When the audio object completes it's playback, call the callback
        //provided
        audio_el.addEventListener('ended', callback,{ once: true });
    }
}

//Changed the name to better reflect the functionality
function play_sound_queue(sounds) {
    var audio_el = document.getElementById("loop_audio_player");
    audio_el.loop = false;
    var index = 0;
    function recursive_play() {
        /*if(index == 0) {
            $("#caption_text_value").removeClass("highlight_audio3");
            $(".letter__text").addClass("highlight_audio3");
        }
        else if(index == 1) {
            $("#caption_text_value").addClass("highlight_audio3");
            $(".letter__text").removeClass("highlight_audio3");
        }*/
        //If the index is the last of the table
        if (index + 1 === sounds.length) {
            // play(sounds[index], null);
            cbfnc = function() {
                index=0;
                recursive_play();
            }
            play123(audio_el, sounds[index], cbfnc);
        } else {
            //Else, play the sound, and when the playing is complete
            //increment index by one and play the sound in the
            //indexth position of the array
            cbfnc = function() {
                index++;
                recursive_play();
            }
            play123(audio_el,sounds[index], cbfnc);
        }
    }

    //Call the recursive_play for the first time
    recursive_play();
}

// window.addEventListener('click',function(){play_sound_queue(audio_sources);},{ once: true });
// var audio_button = document.getElementById("audio_button");
// audio_button.addEventListener('click',function(){play_sound_queue(audio_sources);},{ once: true });

// play_sound_queue(audio_sources);


function audio_reinit_next_question() {
    if(!firstQuestion) {
        var audio_el = document.getElementById("loop_audio_player");
        audio_el.removeEventListener("ended",
            cbfnc);
        audio_el.pause();
        // play_sound_queue(audio_sources);
    }
    if(audio_sources.length==1) {
        audio_sources.push(APP_URL+"/storage/audio/500ms_silence.mp3");
    }
    play_sound_queue(audio_sources);

}


function option_click_sound(source) {

    var loop_audio_el = document.getElementById("loop_audio_player");
    var option_audio_el = document.getElementById("options_click_player");

    var is_loop_audio_paused = loop_audio_el.paused;

    if (!is_loop_audio_paused) {
        // console.log("pausing looped audio");
        loop_audio_el.pause();
    }

    option_audio_el.setAttribute("src", source);
    option_audio_el.play();
    option_audio_el.addEventListener('ended', function () {
        if (!is_loop_audio_paused) {
            // console.log("unpausing looped audio");
            loop_audio_el.play();
        }
    },{ once: true });

    /*if (!is_loop_audio_paused) {
        console.log("unpausing looped audio");
        loop_audio_el.play();
    }*/
}

function play_star_success_sound() {
    var star_audio_el = document.getElementById("star_player");
    star_audio_el.setAttribute("src", APP_URL+"/storage/audio/success_ding.mp3");
    star_audio_el.play();
}


var num_correct_answers = 0;
function star_success() {
    var star_el = document.getElementById("star");
    var star_counter_el = document.getElementById("star_counter");

    star_el.classList.remove('bounce-in-top');
    void star_el.offsetWidth;
    star_el.classList.add('bounce-in-top');

    star_el.innerHTML = '★';

    num_correct_answers = num_correct_answers + 1;
    star_counter_el.innerHTML = num_correct_answers;
    play_star_success_sound();

}


function play_pause_audio() {
    var audio = document.getElementById("loop_audio_player");
    if (audio.paused) {
        audio.play();
        $(".vol-btn__icon").removeClass("fa-volume-up").addClass("fa-pause");
    } else {
        audio.pause();
        $(".vol-btn__icon").removeClass("fa-pause").addClass("fa-volume-up");
    }
}

$(".audio-btn").on("click", function(){
    play_pause_audio();
});

// play-pause functionality
$("#cssHead").on("click", function(){
    play_pause_audio();
});
