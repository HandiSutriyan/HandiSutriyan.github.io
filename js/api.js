const base_url = "https://api.football-data.org/v2/";
const endPointTeams = `${base_url}competitions/2003/teams`
const fetchData = (url) => {
  return fetch(url, {
    method: "GET",
    headers: {
       'X-Auth-Token': '3ba79eb17d8c40f1907aee3a10ecfa0b'
    }
  })
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

function renderTabel(squad) {
  let tabelHtml='';
  squad.forEach(function(item){
    let posisi = item.position;
    if(item.position == null){
      posisi = item.role
    }
    tabelHtml +=`
    <tr>
      <td>${item.name}</td>
      <td>${posisi}</td>
      <td>${item.nationality}</td>
    </tr>
    `;
    document.getElementById("squad-table").innerHTML = tabelHtml;
  });
}

// Blok kode untuk melakukan request data json
function getArticles() {
  if ("caches" in window) {
    caches.match(endPointTeams).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          let articlesHTML = "";
          data.teams.forEach(function (article) {
            articlesHTML += `
                <div class="col s12 m6 6" >
                  <div class="card">
                    <a href="./article.html?id=${article.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.crestUrl.replace(/^http:\/\//i, 'https://')}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${article.name}</span>
                      <p>${article.address}</p>
                    </div>
                  </div>
                </div>
                `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("articles").innerHTML = articlesHTML;
        });
      }
    });
  }

  fetchData(endPointTeams)
    .then(status)
    .then(json)
    .then(function (data) {
      // Menyusun komponen card artikel secara dinamis
      let articlesHTML = "";
      data.teams.forEach(function (team) {
        articlesHTML += `
             <div class="col s12 m6 6" >
              <div class="card">
                <a href="./article.html?id=${team.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate"><h3>${team.name}</h3></span>
                  <p>${team.address}</p>
                </div>
              </div>
            </div>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error);
}

function getArticleById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
             let articleHTML = `
              <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                  <img src="${data.crestUrl}" />
                </div>
                <div class="card-content">
                  <span class="card-title">${data.name}</span>
                  <ul class="data-team">
                   <li class="flow-text"><i class="material-icons">home</i> ${data.venue} </li>
                   <li class="flow-text"><i class="material-icons">language</i> ${data.website} </li>
                   <li class="flow-text"><i class="material-icons">assignment_ind</i> Susunan Tim:</li>
                  </ul>
                  <table class="striped">
                    <thead>
                      <th>Nama</th>
                      <th>Posisi</th>
                      <th>WN</th>
                    </thead>
                    <tbody id="squad-table"></tbody>
                  </table>
                </div>
              </div>
            `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML;
            renderTabel(data.squad);
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchData(base_url + "teams/" + idParam)
      .then(status)
      .then(json)
      .then(function (data) {
        // Menyusun komponen card artikel secara dinamis
        let articleHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.name}</span>
              <ul class="data-team">
               <li class="flow-text"><i class="material-icons">home</i> ${data.venue} </li>
               <li class="flow-text"><i class="material-icons">language</i> ${data.website} </li>
               <li class="flow-text"><i class="material-icons">assignment_ind</i> Susunan Tim:</li>
              </ul>
              <table class="striped">
                <thead>
                  <th>Nama</th>
                  <th>Posisi</th>
                  <th>WN</th>
                </thead>
                <tbody id="squad-table"></tbody>
              </table>
            </div>
          </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = articleHTML;
        renderTabel(data.squad);
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedArticles() {
  getAll().then(function (teams) {
    console.log(teams);
    // Menyusun komponen card artikel secara dinamis
    let articlesHTML = "";
    teams.forEach(function (team) {

      articlesHTML += `
                  <div class="card">
                    <a href="./article.html?id=${team.id}&saved=true">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <a class="btn-floating halfway-fab waves-effect waves-light red" id="deleted" onclick="deletedTeam(${team.id}, '${team.name}')"><i class="material-icons">delete</i></a>
                      <span class="card-title truncate">${team.name}</span>
                      <p>${team.website}</p>
                    </div>
                  </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML = articlesHTML;
  });
}

function getSavedArticleById() {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");

  getById(idParam).then(function (team) {
    let articleHTML = '';
    articleHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${team.crestUrl}" />
            </div>
            <div class="card-content">
              <span class="card-title">${team.name}</span>
              <ul class="data-team">
               <li class="flow-text"><i class="material-icons">home</i> ${team.venue} </li>
               <li class="flow-text"><i class="material-icons">language</i> ${team.website} </li>
               <li class="flow-text"><i class="material-icons">assignment_ind</i> Susunan Tim:</li>
              </ul>
              <table class="striped">
                <thead>
                  <th>Nama</th>
                  <th>Posisi</th>
                  <th>WN</th>
                </thead>
                <tbody id="squad-table"></tbody>
              </table>
            </div>
          </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = articleHTML;
    renderTabel(team.squad);
  });
}

