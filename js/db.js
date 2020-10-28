let dbPromised = idb.open("news-reader", 1, function (upgradeDb) {
  let teamsObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id"
  });
  teamsObjectStore.createIndex("name", "name", {
    unique: false
  });
});

function simpanTeam(team) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      console.log(team);
      store.put(team);
      return tx.complete;
    })
    .then(function () {
      console.log("Tim favorit berhasil di simpan.");
      pushNotif("Tim favorit berhasil di simpan.");
    });
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function (teams) {
        resolve(teams);
      });
  });
}


function getById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        let tx = db.transaction("teams", "readonly");
        let store = tx.objectStore("teams");
        return store.get(parseInt(id));
      })
      .then(function (article) {
        resolve(article);
      });
  });
}

function deletedTeam(team) {
  dbPromised
    .then(function (db) {
      let tx = db.transaction("teams", "readwrite");
      let store = tx.objectStore("teams");
      console.log(team);
      store.delete(team);
      return tx.complete;
    })
    .then(function () {
      console.log("berhasil di hapus");
      pushNotif("Berhasil dihapus.");
    });

  getSavedArticles();
}


