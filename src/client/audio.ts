const audio: Map<string, HTMLAudioElement> = new Map();

export function load(url: string) {
	audio.set(url, new Audio(url));
}

export function play(url: string) {
	const track = audio.get(url);
	if (!track) return console.error('Invalid track requested!');

	track.play();
}
