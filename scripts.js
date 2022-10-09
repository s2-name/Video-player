let log = console.log;


let wrapper = document.querySelector(".video_wrapper");
let contolls = document.querySelector(".vid_controls");
let play_pause = document.querySelector(".vid_play_pause");
let mute = document.querySelector(".vid_mute");
let fullscreen = document.querySelector(".vid_fullscreen");
let cur_time = document.querySelector(".vid_current_time");
let full_time = document.querySelector(".vid_full_time");
let full_track = document.querySelector(".vid_track_all");
let cur_track = document.querySelector(".vid_track_current");


let cur_volume = video.volume;
let video_duration = 0;
let current_time = 0;

let timeoutID;

play_pause.addEventListener("click", toggle_play_pause);
mute.addEventListener("click", toggle_mute);
fullscreen.addEventListener("click", toggle_fullscreen);
full_track.addEventListener("click", set_time);
video.addEventListener("timeupdate", update_time);
video.addEventListener("mousemove", show_controlls);
video.addEventListener("canplaythrough", set_full_time);


function toggle_play_pause(e) {
	let is_paused = video.paused;

	if(is_paused){
		video.play();
		play_pause.innerHTML = "▶️";
		timeoutID = setTimeout(hide_controlls, 5000);
	}else{
		video.pause();
		play_pause.innerHTML = "⏸️";
	}
}


function toggle_mute(e) {
	let is_mute = video.muted;
	if(is_mute){
		video.muted = false;
		mute.innerHTML = "🔊";
	}else{
		video.muted = true;
		mute.innerHTML = "🔇";
	}
}


function toggle_fullscreen(e) {

	var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

	if(isInFullScreen){
		if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
		video.classList.remove("fullscreen");
	}else{
		if (wrapper.requestFullscreen) {
		    wrapper.requestFullscreen();
		} else if (wrapper.webkitRequestFullscreen) { /* Safari */
		    wrapper.webkitRequestFullscreen();
		} else if (wrapper.msRequestFullscreen) { /* IE11 */
		    wrapper.msRequestFullscreen();
		}
		video.classList.add("fullscreen");
	}
}


function set_time(e) {
	let x = e.layerX;
	let width = this.clientWidth;
	let persent = x/width;
	video.currentTime = video.duration*persent;
}


function set_full_time(e) {
	video_duration = video.duration;
	full_time.innerHTML = format_time(video_duration);
}


function update_time(e) {
	let cur_time_pos = video.currentTime;
	cur_time.innerHTML = format_time(cur_time_pos);
	current_time = cur_time_pos;		
	let persent = cur_time_pos/video_duration*100;
	cur_track.style = "width:"+persent+"%;";
}


function hide_controlls() {
	contolls.classList.add("hide");
}


function show_controlls() {
	contolls.classList.remove("hide");
	clearTimeout(timeoutID);
	timeoutID = setTimeout(hide_controlls, 5000);
}


// Seconda to hours:minuts:secunds
function format_time(time) {
	
	let h = Math.floor(time / 3600);
    let m = add_zero(Math.floor(time % 3600 / 60));
    let s = add_zero(Math.floor(time % 3600 % 60));
	
	if(h>0){
		hours = add_zero(h)+":";
	}else{
		hours = "";
	}
	return hours+m+":"+s;
}


function add_zero(num) {
	if(num<10){
		return "0"+num;
	}else{
		return num;
	}
}