const APIURL = "https://api.github.com/users/"

const form = document.getElementById("form")
const search = document.getElementById("search")
const content = document.getElementById("main")

// Kullanıcı adını alan fonksiyon
async function getUsers(username){
   try {
    const { data } = await  axios(APIURL + username);
    createUserCard(data);
    getRepos(username);
   } catch (err) {
    if(err.response.status === 404){
      createErrorCard("Bu isimde bir profil bulunmuyor")
    }
   }
}
// Repo bilgisi alma
async function getRepos(username){
  try {                                                     // Sıralama
    const { data } = await  axios(APIURL + username + "/repos?sort=created");
    addReposToCard(data);
   } catch (err) {
    createErrorCard("Repo alınırken bir hata oluştu")
   }
}

// Profil bilgisi ile card oluşturma
function createUserCard(user){
  const cardHTML = 
  `    
    <div class="card">
      <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${user.name}</h2>
        <p>${user.bio}</p>

        <ul>
          <li>${user.followers} <strong>Takipçi</strong></li>
          <li>>${user.following} <strong>Takip edilen</strong></li>
          <li>${user.public_repos} <strong>Repo</strong></li>
        </ul>

        <div id="repos">
          
        </div>
      </div>
    </div>
  `
  createDOM(cardHTML);

}

// Alınan profil bilgisini DOM'a aktarma
function createDOM(data){
  content.innerHTML = data
}

// Hata card'ı oluşturma
function createErrorCard(errMsg){
  const cardHTML = `
    <div class='card'>
      <h1>${errMsg}</h1>
    </div> 
  `

  createDOM(cardHTML)
}
//Repo bilgisini card'a yükleme
function addReposToCard(repos){
 const reposElement = document.getElementById("repos");

 repos.slice(0,10).forEach(repo => {
  const repoEl = document.createElement("a");
  repoEl.classList.add("repo");
  repoEl.href = repo.html_url;
  repoEl.target = "_blank"
  repoEl.innerText = repo.name

  reposElement.appendChild(repoEl)
 });


}

// Eventlisteners
form.addEventListener("submit", (e)=>{
  e.preventDefault();
  const user = search.value;

  if(user){
    getUsers(user);
    search.value = "";
  }
})