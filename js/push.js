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
		console.error('FItur notifikasi tidak diijinkan.');
	}
}

if ("Notification" in window){
	requestPermisson();
}else{
	console.error("Browser tidak mendukung notifikasi.");
}