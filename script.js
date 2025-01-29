const userID = "514143516310372364";
const elements = {
	statusBox: document.querySelector(".status"),
	statusImage: document.getElementById("status-image"),
	displayName: document.querySelector(".display-name"),
	username: document.querySelector(".username"),
	customStatus: document.querySelector(".custom-status"),
	customStatusText: document.querySelector(".custom-status-text"),
	customStatusEmoji: document.getElementById("custom-status-emoji"),
};
function startWebSocket() {
	const ws = new WebSocket("wss://api.lanyard.rest/socket");
	ws.onopen = () => {
		ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userID } }));
	};
	ws.onmessage = (event) => {
		const { t, d } = JSON.parse(event.data);
		if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
			updateStatus(d);
		}
	};
	ws.onerror = (error) => {
		console.error("Lỗi WebSocket:", error);
		ws.close();
	};
	ws.onclose = () => {
		console.log("WebSocket đóng, thử kết nối lại...");
		setTimeout(startWebSocket, 1000);
	};
}
function updateStatus(lanyardData) {
	const { discord_status, activities, discord_user } = lanyardData;
	elements.displayName.innerHTML = discord_user.display_name;
	elements.username.innerHTML = discord_user.username;
	let imagePath;
	let label;
	switch (discord_status) {
		case "online":
			imagePath = "online.svg";
			label = "Online";
			break;
		case "idle":
			imagePath = "idle.svg";
			label = "Idle / AFK";
			break;
		case "dnd":
			imagePath = "dnd.svg";
			label = "Do Not Disturb";
			break;
		case "offline":
			imagePath = "offline.svg";
			label = "Offline";
			break;
		default:
			imagePath = "offline.svg";
			label = "Unknown";
			break;
	}
	const isStreaming = activities.some(
		(activity) =>
			activity.type === 1 &&
			(activity.url.includes("twitch.tv") ||
				activity.url.includes("youtube.com"))
	);
	if (isStreaming) {
		imagePath = "streaming.svg";
		label = "Streaming";
	}
	elements.statusImage.src = imagePath;
	elements.statusBox.setAttribute("aria-label", label);
	if (activities[0]?.state) {
		elements.customStatusText.innerHTML = activities[0].state;
	} else {
		elements.customStatusText.innerHTML = "Not doing anything!";
	}
	const emoji = activities[0]?.emoji;
	if (emoji?.id) {
		elements.customStatusEmoji.src = `https://cdn.discordapp.com/avatars/514143516310372364/a_2428534065393e0f9b954d2704f4ad05.gif?size=1024`;
	} else if (emoji?.name) {
		elements.customStatusEmoji.src = "https://cdn.discordapp.com/avatars/514143516310372364/a_2428534065393e0f9b954d2704f4ad05.gif?size=1024";
	} else {
		elements.customStatusEmoji.style.display = "none";
	}
	if (!activities[0]?.state && !emoji) {
		elements.customStatus.style.display = "none";
	} else {
		elements.customStatus.style.display = "flex";
	}
}
startWebSocket();


function copiarTexto() {
	// Cria um campo de input temporário para copiar o texto
	var tempInput = document.createElement('input');
	document.body.appendChild(tempInput);
	tempInput.value = document.querySelector('.display-name').textContent;
	tempInput.select();
	document.execCommand('copy');
	document.body.removeChild(tempInput);
	
	alert('Texto copiado: ' + tempInput.value);
  }
