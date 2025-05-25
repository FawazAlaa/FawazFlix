import {
  loginButtons,
  signupButtons,
  handleLoginClick,
  handleSignupClick,
  saveUser,
  loginUser
} from './index2.js';

import {
  singleMovie,
  getMovieList,
  singleContainer,
  singleImg,
  singleText,
  displayMovie,
  postComment,
  loadComments
} from './index3.js';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYTAzNTNhNmIyZmU1NWI4ZTYzZWY5NTAwNmVkM2QxMyIsIm5iZiI6MTc0NjE4MzIyNS4xNjMsInN1YiI6IjY4MTRhNDM5MDliZTgzNjVmOGY0MDZhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.k84MufP7CvsFgQe4y66LwZzGJm386Y1AdVbkvqYOotY' // shortened for clarity
  }
};

const contentList = ['now_playing', 'popular', 'top_rated', 'upcoming'];
let bigArrayList = {};


document.addEventListener("DOMContentLoaded", () => {  //Mohema gedan kan mebozaly koll 7aga
  //login data coming gia mn index 2
  loginButtons.forEach(btn => btn.addEventListener("click", handleLoginClick));
  signupButtons.forEach(btn => btn.addEventListener("click", handleSignupClick));
  document.getElementById("signupbtn")?.addEventListener("click", saveUser);
  document.getElementById("loginbtn")?.addEventListener("click", loginUser);

  // tany 7aga  scroll navbar 
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  // esm el user fel dropdown
  const profileDropdown = document.querySelector(".dropdown__options");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser && profileDropdown) {
    const usernameDisplay = document.createElement("p");
    usernameDisplay.textContent = `Hello, ${loggedInUser.name}`;
    profileDropdown.insertBefore(usernameDisplay, profileDropdown.firstChild);
  }

  // el search nafso 
  const searchIcon = document.querySelector('.searchbaricon');
  const searchbarContainer = document.getElementById('searchbar__container');
  const errorMsg = document.getElementById("searcherror");
  const userSearch = document.getElementById('searchtext');

  searchIcon.addEventListener('click', () => searchbarContainer.classList.add('show'));
  userSearch.addEventListener('blur', () => searchbarContainer.classList.remove('show'));
// bahndaleha search ezay
  userSearch.addEventListener('input', function () {
    const searchText = this.value.trim().toLowerCase();
    let foundMatch = true;
    for (let category in bigArrayList) {
      const containerId = `${category}__list`;
      const container = document.getElementById(containerId);
      const filtered = bigArrayList[category].filter(item =>
        item.original_title.toLowerCase().includes(searchText)
      );
      let noResultsMsg = document.getElementById(`${category}__noresults`);
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('h3');
        noResultsMsg.id = `${category}__noresults`;
        noResultsMsg.style.textAlign = 'center';
        container.parentElement?.insertBefore(noResultsMsg, container);
      }
      if (filtered.length > 0) {
        foundMatch = false;
        noResultsMsg.textContent = '';
      } else {
        noResultsMsg.textContent = 'No movies found.';
      }
      displaydata(filtered, containerId);
    }
    errorMsg.textContent = foundMatch ? "No matching movies found." : "";  //ana ast5dmt ternary operator badl if
  });

  //chatbot
  const chatbotContainer = document.getElementById("chatbot-container");
  const sendBtn = document.getElementById("send-btn");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotIcon = document.getElementById("chatbot-icon");
  const closeButton = document.getElementById("close-btn");

  chatbotIcon.addEventListener("click", () => {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none";
  });

  closeButton.addEventListener("click", () => {
    chatbotContainer.classList.add("hidden");
    chatbotIcon.style.display = "flex";
  });

  sendBtn.addEventListener("click", sendMessage);
  chatbotInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
      appendMessage("user", userMessage);
      chatbotInput.value = "";
      getBotResponse(userMessage);
    }
  }

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  async function getBotResponse(userMessage) {
    const apiKey = "AIzaSyA6GMxYItZUsziHpfYspU8wIvTX1BMgI3s"; // your actual key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        }),
      });
      const data = await res.json();
      const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
      appendMessage("bot", botMessage);
    } catch (error) {
      console.error("Chatbot error:", error);
      appendMessage("bot", "Something went wrong.");
    }
  }

  getMovieListAll(contentList);
});

// all movie list

async function getMovieListAll(contentArray) {
  try {
    await Promise.all(contentArray.map(async (content) => {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${content}?language=en-US&page=1`, options);
      const movieList = await response.json();
      bigArrayList[content] = movieList.results;
      displaydata(movieList.results, `${content}__list`);
      setTimeout(attachScrollButtons, 0); 
    }));
    //function el buttons hna 3lshan ba3d el load de tegy 3lshan tiomeout macro
  } catch (error) {
    console.error('API fetch error:', error);
  }
}
// mar7la creating the files
function displaydata(arraylist, listID) {
  const container = document.getElementById(listID);
  container.innerHTML = '';
  arraylist.forEach((item, index) => {
    let li = document.createElement('li');
    li.classList.add('card__list__item');
    li.setAttribute('data_index', index);

    let article = document.createElement('article');
    article.classList.add('item__article');
    article.setAttribute('Movie-ID', item.id);

    let figure = document.createElement('figure');
    figure.classList.add('article__img');

    let image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w500/${item.poster_path}`;
    figure.appendChild(image);

    let div = document.createElement('div');
    div.classList.add('article__content');

    let title = document.createElement('h3');
    title.innerHTML = item.original_title;

    let description = document.createElement('h4');
    description.innerHTML = item.overview;

    let popularity = document.createElement('p');
    popularity.innerHTML = 'People Reviewed This: ' + item.popularity;

    let releaseDate = document.createElement('p');
    const reversedReleasedDate = item.release_date.split('-').reverse().join('-');
    releaseDate.innerHTML = 'Release Date: ' + reversedReleasedDate;

    let rating = document.createElement('p');
    const ratingOutOf10 = item.vote_average + 0.3;
    const starsOutOf5 = Math.round((ratingOutOf10 / 10) * 5);
    const fullStar = '<i class="fas fa-star"></i>';
    const emptyStar = '<i class="far fa-star"></i>';
    const starsHTML = fullStar.repeat(starsOutOf5) + emptyStar.repeat(5 - starsOutOf5);
    rating.innerHTML = starsHTML;
    rating.classList.add('ratings');
    //lazm bel tarteb 
    article.appendChild(figure);
    article.appendChild(div);
    div.appendChild(title);
    div.appendChild(description);
    div.appendChild(popularity);
    div.appendChild(releaseDate);
    div.appendChild(rating);

    article.addEventListener('click', function () {
      localStorage.setItem('selectedMovieID', item.id);
      window.location.href = "movie.html";
    });

    article.addEventListener('mouseenter', () => div.classList.add('article__contentshown'));
    article.addEventListener('mouseleave', () => div.classList.remove('article__contentshown'));

    li.appendChild(article);
    container.appendChild(li);
  });
}
// Function el scroll button used above
function attachScrollButtons() {
  document.querySelectorAll('.nextbtn').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target);
      target?.parentElement?.scrollBy({ left: 220, behavior: "smooth" });
    });
  });
  document.querySelectorAll('.prevsbtn').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target);
      target?.parentElement?.scrollBy({ left: -220, behavior: "smooth" });
    });
  });
}

// Feedback fel movie page
const feedback = document.getElementById('feedback');
const feedbackbtn = document.getElementById('feedbackbtn');
const movieID = localStorage.getItem('selectedMovieID');
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
feedbackbtn.addEventListener('click', async () => {
  if (!feedback.value || !loggedInUser) return;

  await postComment(loggedInUser.name, feedback.value, movieID);
  feedback.value = '';
  loadComments(movieID);
});

if (loggedInUser) {
  const usernameDisplay = document.createElement("p");
  usernameDisplay.textContent = `Hello, ${loggedInUser.name}`;

  profileDropdown.insertBefore(usernameDisplay, profileDropdown.firstChild);
}
