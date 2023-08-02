AnimationRewrite = (text, element, speed) => {
    let thisElement = $(element);
    let textArray = text.split("");
    let textArrayLength = textArray.length;
    let currentHTML = "";

    let i = 0;
    let interval = setInterval(() => {
        if (i < textArrayLength) {
            currentHTML += textArray[i];
            thisElement.html(currentHTML);
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                let j = 0;
                let interval2 = setInterval(() => {
                    if (j < textArrayLength) {
                        currentHTML = currentHTML.slice(0, -1);
                        thisElement.html(currentHTML);
                        j++;
                    } else {
                        clearInterval(interval2);
                        AnimationRewrite(text, element, speed);
                    }
                }, speed);
            }, 1000);
        }
    }, speed);
};


$(document).ready(function () {
    $("#discord").attr("src", Config.Iframe);
    $("header .logo").css("background", `url(./images/${Config.Logo})`);

    let creatorsHTML = "";
    for(let i = 0; i < Config.Creators.length; i++) {
        let creator = Config.Creators[i];
        creatorsHTML += `
        <div class="item" id="${creator.Id}">
        <div class="icon" style = "background: url(${creator.Icon})"></div>
        <div class="name">${creator.Name}</div>
        <div class="title">${creator.Title}</div>
         </div>
        `
    }

    $("#creators-card").html(creatorsHTML);

    let audio = new Audio(Config.Audio);
    audio.loop = true;
    audio.volume = 0.5;
    let lastVolume = 0.5;
    audio.play();

    $(".audio-toggle-btn").click(function () {
        if (audio.paused) {
            audio.play();
            $(".audio-toggle-btn i").removeClass("fa-play");
            $(".audio-toggle-btn i").addClass("fa-pause");
        } else {
            audio.pause();
            $(".audio-toggle-btn i").removeClass("fa-pause");
            $(".audio-toggle-btn i").addClass("fa-play");
        }
    });

    $(".audio-player-controls-volume-range").change(function () {
        audio.volume = $(this).val();
        lastVolume = $(this).val();
        if (audio.volume == 0) {
            $(".audio-toggle-mute").removeClass("fa-volume-up");
            $(".audio-toggle-mute").addClass("fa-volume-mute");
        } else {
            $(".audio-toggle-mute").removeClass("fa-volume-mute");
            $(".audio-toggle-mute").addClass("fa-volume-up");
        }
    });
    
    audio.addEventListener("timeupdate", function () {
        let progress = (audio.currentTime / audio.duration) * 100;
        $(".audio-player__progress-loaded").css("width", `${progress}%`);
    });

    $('.audio-toggle-mute').click(function () {
        if (audio.volume == 0) {
            audio.volume = lastVolume;
            $(".audio-toggle-mute").removeClass("fa-volume-mute");
            $(".audio-toggle-mute").addClass("fa-volume-up");
            $(".audio-player-controls-volume-range").val(lastVolume);
        }
        else {
            audio.volume = 0;
            $(".audio-toggle-mute").removeClass("fa-volume-up");
            $(".audio-toggle-mute").addClass("fa-volume-mute");
            $(".audio-player-controls-volume-range").val(0);
        }
    });

    $('.audio-backward-btn').click(function () {
        audio.currentTime -= 10;
    });
    
    $('.audio-forward-btn').click(function () {
        audio.currentTime += 10;
    });

    $(".audio-player__progress").click(function (e) {
        let offset = $(this).offset();
        let left = (e.pageX - offset.left);
        let totalWidth = $(this).width();
        let percentage = (left / totalWidth);
        let seconds = audio.duration * percentage;
        audio.currentTime = seconds;
    });

    $('main #creators-card .item').click(function () {
        let name = $(this).find(".name").text();
        let tempInput = document.createElement("input");
        tempInput.value = name;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        if ($('.tooltip').length) {
            $('.tooltip').remove();
        };
        let tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.innerHTML = "Copied!";
        document.body.appendChild(tooltip);
        
        let position = $(this).offset();
        let left = position.left;
        let top = position.top;

        $('.tooltip').css("position", "absolute");
        $('.tooltip').css("left", `${left}px`);
        $('.tooltip').css("top", `${top}px`);
        $('.tooltip').css("opacity", "1");

        setTimeout(() => {
            $('.tooltip').css("opacity", "0");
            setTimeout(() => {
                $('.tooltip').remove();
            }, 1000);
        }, 1000);
    });

    $('#info-card-1').html(Config.InfoFirst);
    $('#info-card-2').html(Config.InfoSecond);  

    AnimationRewrite(Config.RewriteText, "#rewrite", 100);
});
