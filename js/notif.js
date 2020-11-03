const requestPermisson = () => {
	Notification.requestPermission().then((result)=>{
		if (result === "denied") {
          console.log("Fitur notifikasi tidak diijinkan.");
          return;
        } else if (result === "default") {
          console.error("Pengguna menutup kotak dialog permintaan ijin.");
          return;
        }

        console.log("Fitur notifikasi diijinkan.");
	})
}

// Push notifikasi lokal
const pushNotif = (message) => {
	const title = "Meneer Bola";
	const options = {
		'body': `Pemberitahuan \n ${message}`,
		'icon': '/assets/icon.png',
		'badge': '/assets/icon.png',
	}

	if (Notification.permission == "granted") {
		navigator.serviceWorker.ready.then((registration) => {
			registration.showNotification(title, options);
		});
	}else {
		console.error('Fitur notifikasi tidak diijinkan.');
	}
}

//deskripsi public key
const urlBase64ToUint8Array = (base64String) => {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i){
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

if ("Notification" in window){
	requestPermisson();
}else{
	console.error("Browser tidak mendukung notifikasi.");
}

//subscribe web push
navigator.serviceWorker.ready.then(() => {
	if (('PushManager' in window)) {
		navigator.serviceWorker.getRegistration().then((registration)=>{
			registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array("BBFZLjvizFoF6qX79KTXyQNwr2F30f684clKHQ5yit4tj6QMrGdcl4x-nExLZ7KsdS9jM4sYR_dG_MkFiZmRlKA")
			}).then((subscribe)=>{
				console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
				console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
					null, new Uint8Array(subscribe.getKey('p256dh')))));
				console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
	                null, new Uint8Array(subscribe.getKey('auth')))));
			}).catch((e)=>{
				console.error('Tidak bisa subscribe', e.message);
			});
		});
	}
});
