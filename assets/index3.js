
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYTAzNTNhNmIyZmU1NWI4ZTYzZWY5NTAwNmVkM2QxMyIsIm5iZiI6MTc0NjE4MzIyNS4xNjMsInN1YiI6IjY4MTRhNDM5MDliZTgzNjVmOGY0MDZhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.k84MufP7CvsFgQe4y66LwZzGJm386Y1AdVbkvqYOotY'
  }
}

export let singleMovie = []
export async function getMovieList(movieID) {
  let movielist = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options)
  try {
    singleMovie = await movielist.json();
    console.log(singleMovie)
    displayMovie(singleMovie);

  }
  catch (error) {
    console.error('Error is :', error)

  }
}

const movieID = localStorage.getItem('selectedMovieID');

if (movieID) {
  getMovieList(movieID);
  loadComments(movieID); 
} else {
  console.error("No movieID found in localStorage!");
}

export const singleContainer = document.getElementById('single__content');
export const singleImg = document.getElementById('single__content__img');
export const singleText = document.getElementById('single__content__text');

export function displayMovie(singleMovie) {

  let image = document.createElement('img');
  image.src = "https://image.tmdb.org/t/p/w500/" + singleMovie.poster_path;
  singleImg.appendChild(image);

  let title = document.createElement('h2');
  title.innerHTML = singleMovie.original_title;
  singleContainer.appendChild(title);

  let description = document.createElement('h4');
  description.innerHTML = singleMovie.overview;
  singleText.appendChild(description);

  let popularity = document.createElement('p');
  popularity.innerHTML = 'People Reviewed This: ' + singleMovie.popularity;
  singleText.appendChild(popularity);

  let releaseDate = document.createElement('p');
  const reversedReleasedDate = singleMovie.release_date.split('-').reverse().join('-'); //Momken const 3lshan ya bet3'ayer ma3 loop aw function at runtime
  releaseDate.innerHTML = 'Release Date: ' + reversedReleasedDate;
  singleText.appendChild(releaseDate);



  let language = document.createElement('p')
  language.innerHTML = 'original Language: ' + singleMovie.original_language;
  singleText.appendChild(language);

  const budget = document.createElement('p');
  const revenue = document.createElement('p')
  singleText.appendChild(budget);
  singleText.appendChild(revenue);

  if (singleMovie.status === 'Released') {
    budget.innerHTML = 'Budget: ' + singleMovie.budget + '$';
    revenue.innerHTML = 'Revenue: ' + singleMovie.revenue + '$';
    let profit = document.createElement('p');
    profit.innerHTML = 'Profit: ' + (singleMovie.revenue - singleMovie.budget) + '$';
    singleText.appendChild(profit);

  }
  else {
    budget.innerHTML = 'Budget: Not Released yet';
    revenue.innerHTML = 'Revenue: Not Released yet';
  }

  let rating = document.createElement('p');
  const ratingOutOf10 = singleMovie.vote_average + 0.3;
  const starsOutOf5 = Math.round((ratingOutOf10 / 10) * 5); //bet2arb a2rb natega
  const fullStar = '<i class="fas fa-star"></i>';
  const emptyStar = '<i class="far fa-star"></i>';
  const starsHTML = fullStar.repeat(starsOutOf5) + emptyStar.repeat(5 - starsOutOf5); //repeat el rakm da ya 5 ya 5-el rakm el tal3
  rating.innerHTML = starsHTML;
  rating.classList.add('ratings')
  singleText.appendChild(rating);

}



export async function postComment(username, comment,movieID) {
     let dataSent={
              'username':username,
              'comment':comment,
              'timestamp': new Date().toISOString(),
               movieID: movieID
     }
  try {
        const response = await fetch('https://rattle-nettle-jackrabbit.glitch.me/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataSent)
        });

        const data = await response.json();
        console.log("Comment submitted:", data);
        return data;
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
}

export async function loadComments(movieID) {
  const commentContainer = document.getElementById('feedback-container');

  try {
    const response = await fetch('https://rattle-nettle-jackrabbit.glitch.me/comments');
    const allComments = await response.json();

    const movieComments = allComments.filter(comment => comment.movieID == movieID);

    // Clear previous feedbacks
    const existingList = document.getElementById('comment__list');
    if (existingList) existingList.remove();

    const commentList = document.createElement('div');
    commentList.id = 'comment__list';

    if (movieComments.length === 0) {
      const noComment = document.createElement('p');
      noComment.textContent = 'No comments yet for this movie.';
      commentList.appendChild(noComment);
    } else {
      movieComments.forEach(comment => {
        const box = document.createElement('div');
        box.classList.add('comment-box');

        const name = document.createElement('h4');
        name.textContent = comment.username;

        const text = document.createElement('p');
        text.textContent = comment.comment;

        const time = document.createElement('p');
        time.textContent = `Posted on ${new Date(comment.timestamp).toLocaleString()}`;
        time.style.fontSize='10px';

        box.appendChild(name);
        box.appendChild(text);
        box.appendChild(time);
        box.style.marginBottom = '1rem';

        commentList.appendChild(box);
      });
    }

    commentContainer.appendChild(commentList);
  } catch (error) {
    console.error('Error loading comments:', error);
  }
}
