type TEmoji = { emoji: string, x: number, y: number, count: number, fontSize: number }

var emoji = ['♫', '♬', '♪'];
var totalEmojiCount = 50;

var continueDraw = false;
var context: CanvasRenderingContext2D | null;
var canvasWidth: number;
var canvasHeight: number;
var emojies: TEmoji[] = [];

export function initializeCanvas(): void {
	var canvas = <HTMLCanvasElement>document.getElementById('canvas');

	if (canvas) {
		context = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		context?.scale(2, 2);

		generateCanvasSize(canvas);
		// generateEmojis();
	}
}

function generateCanvasSize(canvas: HTMLCanvasElement): void {
	var coord = canvas.getBoundingClientRect();
	canvasWidth = coord.width;
	canvasHeight = coord.height;
}

export function generateEmojis(): void {
	if (continueDraw === true) return;
	emojies = [];

	for (var iterate = 0; iterate < totalEmojiCount; iterate++) {
		var x = Math.floor(Math.random() * canvasWidth);
		var offsetY = Math.abs(Math.floor(Math.random() * 300));
		var fontSize = Math.floor(Math.random() * 40) + 20;

		emojies.push({
			emoji: emoji[Math.floor(Math.random() * emoji.length)],
			x,
			y: canvasHeight + offsetY,
			count: Math.floor(Math.random() * 3) + 4,
			fontSize,
		});

		if (iterate === (totalEmojiCount - 1)) {
			continueDraw = true;
			drawConfetti();
			endDraw();
		}
	}
}

function drawConfetti(): void {
	if (context) {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	emojies.forEach((emoji) => {
		drawEmoji(emoji);
		emoji.y = emoji.y - emoji.count;
	});

	if (continueDraw) {
		window.requestAnimationFrame(drawConfetti.bind(this));
	}
}

function drawEmoji(emoji: TEmoji): void {
	if (context) {
		context.beginPath();
		context.fillStyle = "rgba(39, 39, 42, 0.6)"
		context.font = emoji.fontSize + 'px serif';
		context.fillText(emoji.emoji, emoji.x, emoji.y);
	}
}

function endDraw(): void {
	setTimeout(() => {
		continueDraw = false;
		context?.clearRect(0, 0, canvasWidth, canvasHeight);
	}, 10000);
}

