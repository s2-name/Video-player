
window.onload = ()=>{
	let controls = {
		"wrapper": ".player_controls",    // .class | #id | tag
		"play_pause": ".player_play_pause",
		"mute": ".player_mute",
		"volume": ".player_volume",
		"volume_track": ".player_volume_track",
		"volume_slider": ".player_volume_slider",
		"current_time": ".player_current_time",
		"full_time": ".player_full_time",
		"tracks_wrapp": ".player_tracks",
		"tracks_full": ".player_track_full",
		"tracks_curr": ".player_track_current",
		"fullscreen": ".player_fullscreen"
	};
	let wrapper = document.querySelector(".video_wrapper");
	let video = document.getElementById("video");
	let player = new Player(video, wrapper, controls)
};