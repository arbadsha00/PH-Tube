// calculate Time
function getTime(seconds) {
  const years = Math.floor(seconds / (365 * 24 * 60 * 60));
  seconds %= 365 * 24 * 60 * 60;

  const months = Math.floor(seconds / (30 * 24 * 60 * 60));
  seconds %= 30 * 24 * 60 * 60;

  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= 24 * 60 * 60;

  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;

  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  let result = "";
  if (years) result += `${years}y `;
  if (months) result += `${months}m `;
  if (days) result += `${days}d `;
  if (hours) result += `${hours}h `;
  if (minutes) result += `${minutes}m `;
  if (seconds || result === "") result += `${seconds}s`;

  return result.trim();
}
// set button

function setButton(id) {
  document.getElementById(id).classList.add("bg-red-500", "text-white");
}
function unsetButton() {
  const buttons = document.getElementsByClassName("category-btn");
  for (let button of buttons) {
    button.classList.remove("bg-red-500", "text-white");
  }
}
// load category
const getCategory = () => {
  fetch(" https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategory(data.categories))
    .catch((err) => console.log(err));
};
// load videos
const getVideos = (search='') => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${search}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((err) => console.log(err));
};
// load category video
const loadCategoryVideo = (id) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      unsetButton();
      setButton(`btn-${id}`);

      displayVideos(data.category);
    })
    .catch((err) => console.log(err));
};
// all video
function getAllVideos() {
    unsetButton();
    setButton("all-btn");
    getVideos();

}
// display category
const displayCategory = (categories) => {
    const categoriesContainer = document.getElementById("categoriesContainer");
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `<button  id="all-btn" onclick="getAllVideos()" class="btn  category-btn bg-red-500 text-white">All</button>
    `;
    categoriesContainer.appendChild(buttonContainer);
  categories.forEach((element) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
        <button id="btn-${element.category_id}" onclick="loadCategoryVideo(${element.category_id})" class="btn  category-btn">${element.category}</button>
        `;
    categoriesContainer.appendChild(buttonContainer);
  });
};

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videoContainer");
  videoContainer.innerHTML = "";
  videos.forEach((item) => {
    const card = document.createElement("div");
    card.innerHTML = `<figure class="relative h-[190px]">
            <img
              src=${item.thumbnail}
              alt=""
              class="rounded-xl w-full h-full object-cover"
            />
            ${
              item.others.posted_date?.length == 0
                ? ""
                : `<p class="bg-black text-gray-300 absolute right-2 bottom-2 px-2 rounded-lg">${getTime(
                    item.others.posted_date
                  )}</p>`
            }
            
          </figure>
          <div class="flex gap-2 py-3">
            <div>
              <img src=${
                item.authors[0].profile_picture
              } alt="" class="w-10 h-10 rounded-full object-cover"/>
            </div>
            <div class="">
              <h2 class="font-bold text-xl">${item.title}</h2>
              <div class="flex items-center gap-2">
                <p class="text-gray-500">${item.authors[0].profile_name}</p>
                ${
                  item.authors[0].verified == true
                    ? `<span
                  ><img
                    src="https://img.freepik.com/premium-vector/verified-vector-icon-account-verification-verification-icon_564974-1246.jpg"
                    alt=""
                    class="w-5 h-5"
                /></span>`
                    : ""
                }
                
              </div>
              <p class="text-gray-500">${item.others.views} Views</p>
            </div>
        `;
    card.classList = "card";
    videoContainer.appendChild(card);
  });
};
document.getElementById("search").addEventListener("keyup", (e) => {
  getVideos(e.target.value);
})
getCategory();
getVideos();
