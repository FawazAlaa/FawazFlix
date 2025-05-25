export const loginButtons = document.querySelectorAll("#login-hero, #login-dropdown");
export const signupButtons = document.querySelectorAll("#signup-hero, #signup-dropdown");
export const formSection = document.getElementById("form");

export function handleLoginClick(e) {
  e.preventDefault();
  formSection.classList.add("show");
  formSection.scrollIntoView({ behavior: "smooth" });
}

export function handleSignupClick(e) {
  e.preventDefault();
  formSection.classList.add("show");
  formSection.scrollIntoView({ behavior: "smooth" });
}
export function saveUser() {
  const name = document.getElementById("signup-name").value;
  const age = document.getElementById("signup-date").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const newUser = { name, age, email, password };
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "index.html";
}

export function loginUser() {
  const emailInput = document.getElementById("login-email").value;
  const passwordInput = document.getElementById("login-password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  let state = false;

  for (let user of users) {
    if (user.email === emailInput && user.password === passwordInput) {
         localStorage.setItem("loggedInUser", JSON.stringify(user)); // Save logged-in user
      state = true;
      break;
    }
  }

  if (state) {
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password.");
  }
}

    // <!-- <script>
    //     nextPageButton = document.getElementById('nextpage');
    //     nextPageButton.addEventListener('click', () => {
    //         window.location.href = 'movie.html';
    //     })
    // </script> -->