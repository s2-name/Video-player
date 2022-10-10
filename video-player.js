let log = console.log;

// let controls = {
// 	"wrapper": ".player_controls",    // .class | #id | tag
// 	"play_pause": ".player_play_pause",
// 	"mute": ".player_mute",
// 	"volume": ".player_volume",
// 	"volume_track": "player_volume_track",
// 	"volume_slider": "player_volume_slider",
// 	"current_time": ".player_current_time",
// 	"full_time": ".player_full_time",
// 	"tracks_wrapp": ".player_tracks",
// 	"tracks_full": ".player_track_full",
// 	"tracks_curr": ".player_track_current",
// 	"fullscreen": ".player_fullscreen"
// };



class Player{
	constructor(video_obj, wrapper, controls){
		this.video = video_obj;
		this.wrapper = wrapper;
		this.controls_wrapper = document.querySelector(controls['wrapper']);
		this.play_pause = document.querySelector(controls['play_pause']);
		this.mute = document.querySelector(controls['mute']);
		this.volume = document.querySelector(controls['volume']);
		this.volume_track = document.querySelector(controls['volume_track']);
		this.volume_slider = document.querySelector(controls['volume_slider']);
		this.current_time = document.querySelector(controls['current_time']);
		this.full_time = document.querySelector(controls['full_time']);
		this.tracks_wrapp = document.querySelector(controls['tracks_wrapp']);
		this.tracks_full = document.querySelector(controls['tracks_full']);
		this.tracks_curr = document.querySelector(controls['tracks_curr']);
		this.fullscreen = document.querySelector(controls['fullscreen']);
		// this. = document.querySelector(controls['']);

		this.play_pause.addEventListener("click", this.toggle_play_pause.bind(this));
		this.mute.addEventListener("click", this.toggle_mute.bind(this));
		this.fullscreen.addEventListener("click", this.toggle_fullscreen.bind(this));
		this.tracks_full.addEventListener("click", this.set_time.bind(this));
		this.video.addEventListener("timeupdate", this.update_time.bind(this));
		this.video.addEventListener("mousemove", this.__show_controls.bind(this));
		this.video.addEventListener("canplaythrough", this.set_full_time.bind(this));
		this.video.addEventListener("click", this.toggle_play_pause.bind(this));
		this.video.addEventListener("dblclick", this.__rewind.bind(this));
		this.volume_track.addEventListener("click", this.__set_volume.bind(this));
		this.volume.addEventListener("mousemove", this.__move_volume_slider.bind(this));
		document.addEventListener("keyup", this.keyhendler.bind(this));

		this.video_duration = 0;
		this.timeoutID;

		this.hide_controls_timeout = 5000;
		this.rewind_value = 5;
		this.volume_value = 0.1;

		this.icons = {
			"play": "sources/player_icons/play.svg",
			"pause": "sources/player_icons/pause.svg",
			"volume_on": "sources/player_icons/volume_on.svg",
			"volume_off": "sources/player_icons/volume_off.svg",
			"fullscreen": "sources/player_icons/fullscreen.svg",
			"exit_fullscreen": "sources/player_icons/exit_fullscreen.svg",
		};

	}


	toggle_play_pause() {
		let is_paused = this.video.paused;

		if(is_paused){
			this.video.play();
			this.play_pause.querySelector("img").src = this.icons['play'];
			this.timeoutID = setTimeout(this.__hide_controls.bind(this), this.hide_controls_timeout);
		}else{
			this.video.pause();
			this.play_pause.querySelector("img").src = this.icons['pause'];
		}
	}


	toggle_mute() {
		let is_mute = this.video.muted;
		if(is_mute){
			this.video.muted = false;
			this.mute.querySelector("img").src = this.icons['volume_on'];
		}else{
			this.video.muted = true;
			this.mute.querySelector("img").src = this.icons['volume_off'];
		}
	}


	toggle_fullscreen() {
		let isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
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

			this.video.classList.remove("fullscreen");
			this.fullscreen.querySelector('img').src = this.icons['fullscreen'];
		}else{
			if (this.wrapper.requestFullscreen) {
			    this.wrapper.requestFullscreen();
			} else if (this.wrapper.webkitRequestFullscreen) { /* Safari */
			    this.wrapper.webkitRequestFullscreen();
			} else if (this.wrapper.msRequestFullscreen) { /* IE11 */
			    this.wrapper.msRequestFullscreen();
			}
			this.video.classList.add("fullscreen");
			this.fullscreen.querySelector('img').src = this.icons['exit_fullscreen'];
		}
	}


	set_time(e) {
		let x = e.layerX;
		let width = e.target.clientWidth;
		let persent = x/width;
		this.video.currentTime = this.video.duration*persent;
	}


	update_time(e) {
		let cur_time_pos = this.video.currentTime;
		this.current_time.innerHTML = this.__format_time(cur_time_pos);
		let persent = cur_time_pos/this.video_duration*100;
		this.tracks_curr.style = "width:"+persent+"%;";
	}


	set_full_time(e) {
		this.video_duration = this.video.duration;
		this.full_time.innerHTML = this.__format_time(this.video_duration);

		let vol = this.video.volume;
		this.volume_slider.style = "left:"+vol*100+"%;";
	}


	__rewind(e){
		let x = e.layerX;
		let middle = e.target.clientWidth/2;
		if(x>middle){
			this.rewind(1);
		}else{
			this.rewind(0);
		}
	}


	rewind(d){
		if(d){
			this.video.currentTime = this.video.currentTime+this.rewind_value;
		}else{
			this.video.currentTime = this.video.currentTime-this.rewind_value;
		}
	}


	__set_volume(e){
		let x = e.layerX;
		let width = e.target.clientWidth;
		let persent = x/width;
		this.set_volume(persent);
	}


	set_volume(persent){
		if(persent>0 && persent<1){
			this.video.volume = persent;
			this.volume_slider.style = "left:"+persent*100+"%;";
		}
	}


	__move_volume_slider(e){
		if(e.buttons == 1){
			let persent = e.movementX/e.target.clientWidth;
			this.set_volume(this.video.volume+persent);
		}
	}


	keyhendler(e){
		let code = e.keyCode;
		switch (code) {
			case 32:             // Space
				this.toggle_play_pause();
				break;
			case 39:             // ->
				this.rewind(1);
				break;
			case 37:             //<-
				this.rewind(0);
				break;
			case 38:             // arrowUp
				this.set_volume(this.video.volume + this.volume_value);
				break;
			case 40:             // arrowDown
				this.set_volume(this.video.volume - this.volume_value);
				break;
			case 70:             // f (fullscreen)
				this.toggle_fullscreen();
				break;
			case 77:            // m (mute)
				this.toggle_mute();
				break;
		}
	}


	set_src(src){
		this.video.src = src;
	}


	play(){
		this.video.play();
	}


	pause(){
		this.video.pause();
	}


	__format_time(time) {
		let h = Math.floor(time / 3600);
	    let m = this.__add_zero(Math.floor(time % 3600 / 60));
	    let s = this.__add_zero(Math.floor(time % 3600 % 60));
	    let hours = "";
		
		if(h>0){
			let hours = this.__add_zero(h)+":";
		}
		return hours+m+":"+s;
	}


	__add_zero(num) {
		if(num<10){
			return "0"+num;
		}else{
			return num;
		}
	}


	__hide_controls() {
		this.controls_wrapper.classList.add("hide");
	}


	__show_controls() {
		this.controls_wrapper.classList.remove("hide");
		clearTimeout(this.timeoutID);
		this.timeoutID = setTimeout(this.__hide_controls.bind(this), this.hide_controls_timeout);
	}
}