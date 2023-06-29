let allBeers;
let beerTimes = [];
let beerLikes = [];
let sortedLikesObjectArray = [];
let sortedHotObjectArray = [];
let sortedTimeObjectArray = [];
let newness = 0;
let saveness = 0;

document.addEventListener("DOMContentLoaded", () => {
  async function fetchHotBeer() {
    const res = await fetch(`http://localhost:3000/beers`);
    const beerList = await res.json();
    const completeList = await beerList;
    allBeers = completeList;
    beerList.forEach((beer) => fillBeerTimesArray(beer));
    sortedHotObjectArray = allBeers.sort(function (a, b) {
      return b.hot - a.hot;
    });
    sortedHotObjectArray.forEach((beer) => postBeer(beer));
    bringPageToTop();
    topSortFunction();
    newSortFunction();
    hotSortFunction();
    saveSortFunction();
  }

  fetchHotBeer();

  function bringPageToTop() {
    const button1 = document.getElementById("back-to-top");
    button1.addEventListener("click", () => {
      document
        .getElementById("beer-header")
        .scrollIntoView({ behavior: "smooth" });
      console.log("test");
    });
  }
  const commentColumn = document.querySelector("div.comment-column");
  const submissionForm = document.getElementById("submission-form");
  const newTitle = document.getElementById("new-title");
  const newDescription = document.getElementById("new-description");
  const newImage = document.getElementById("new-image");
  const newUser = document.getElementById("new-username");

  const joinButton = document.getElementById("join-sub");
  joinButton.addEventListener("click", () => {
    if (joinButton.textContent == "Join") {
      joinButton.textContent = "Joined";
    } else {
      joinButton.textContent = "Join";
    }
  });

  const toggleNightModeButton = document.getElementById("toggle-night");
  const tooltipDiv = document.createElement("div");
  tooltipDiv.className = "tooltip";
  toggleNightModeButton.append(tooltipDiv);
  tooltipDiv.textContent = "Toggle Day Mode";

  toggleNightModeButton.addEventListener("click", () => {
    if (tooltipDiv.textContent == "Toggle Night Mode") {
      toggleNightModeButton.style.filter = "grayscale(100%)";
      toggleNightModeButton.style.backgroundColor = "black";
      toggleNightModeButton.textContent = "🌙";
      toggleNightModeButton.append(tooltipDiv);
      tooltipDiv.textContent = "Toggle Day Mode";
      turnToNight();
    } else {
      toggleNightModeButton.textContent = "☀️";
      toggleNightModeButton.style.backgroundColor = "rgb(78, 186, 213)";
      toggleNightModeButton.style.filter = "grayscale(0%)";
      toggleNightModeButton.append(tooltipDiv);
      tooltipDiv.textContent = "Toggle Night Mode";
      turnToDay();
    }
  });

  const topNav = document.querySelector(".top-nav");
  const subredditNameBar = document.getElementById("subreddit-name-bar");
  const subredditName = document.getElementById("subreddit-name");
  const r_subreddit = document.getElementById("r_subreddit");
  const logoImage = document.getElementById("logo");

  function turnToDay() {
    topNav.style.backgroundColor = "orange";
    subredditNameBar.style.backgroundColor = "orange";
    r_subreddit.style.color = "white";
    logoImage.src =
      "https://1000logos.net/wp-content/uploads/2017/05/Reddit-logo-500x320.png";
    // logoImage.style.height="30px";
  }
  function turnToNight() {
    topNav.style.backgroundColor = "rgb(33,34,34)";
    subredditNameBar.style.backgroundColor = "rgb(33,34,34)";
    r_subreddit.style.color = "rgb(199, 199, 199)";
    logoImage.src =
      "https://www.logo.wine/a/logo/Reddit/Reddit-Horizontal-White-Dark-Background-Logo.wine.svg";
  }

  formSubmission();
  function formSubmission() {
    submissionForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (
        newUser.value == "" ||
        newTitle.value == "" ||
        newDescription.value == ""
      ) {
        alert("Excluding the image, you have to fill out the whole form");
        return false;
      }

      const newPostTime = Date.now() / 60000;
      const newBeer = {
        name: newUser.value,
        tagline: newTitle.value,
        description: newDescription.value,
        image_url: newImage.value,
        likes: 0,
        time: newPostTime,
        saved: false,
      };

      postBeer(newBeer);
      allBeers.push(newBeer);

      fetch(`http://localhost:3000/beers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newBeer),
      });
      submissionForm.reset();
    });
  }

  const hotSort = document.getElementById("hot-filter");
  const newSort = document.getElementById("new-filter");
  const topSort = document.getElementById("top-filter");
  const saveSort = document.getElementById("save-filter");

  function hotSortFunction() {
    hotSort.addEventListener("click", () => {
      newness = 0;
      saveness=0;
      document.querySelectorAll(".main-post").forEach((post) => post.remove());
      fetch(`http://localhost:3000/beers`)
        .then((res) => res.json())
        .then((completeBeerList) => {
          sortedHotObjectArray = completeBeerList.sort(function (a, b) {
            return b.hot - a.hot;
          });
          sortedHotObjectArray.forEach((beer) => postBeer(beer));
        });

      topSort.style.backgroundColor = "";
      hotSort.style.backgroundColor = "rgb(170,170,170)";
      newSort.style.backgroundColor = "";
      saveSort.style.backgroundColor = "";
    });
  }
  function hotAutoSort() {
    
    document.querySelectorAll(".main-post").forEach((post) => post.remove());
    sortedHotObjectArray = allBeers.sort(function (a, b) {
      return b.hot - a.hot;
    });

    sortedHotObjectArray.forEach((beer) => postBeer(beer));
    console.log("a");
  }
  function fetchNewBeer(array, sortType) {
    document.querySelectorAll(".main-post").forEach((post) => post.remove());
    fetch(`http://localhost:3000/beers`)
      .then((res) => res.json())
      .then((completeBeerList) => {
        array = completeBeerList.sort(function (a, b) {
          return b.sortType - a.sortType;
        });
        
        array.forEach((beer) => postBeer(beer));
      });
  }
  function newSortFunction() {
    newSort.addEventListener("click", () => {
      document.querySelectorAll(".main-post").forEach((post) => post.remove());
      saveness = 0;
      // fetchNewBeer(sortedTimeObjectArray, hot);

      fetch(`http://localhost:3000/beers`)
        .then((res) => res.json())
        .then((completeBeerList) => {
          if (newness == 0 || newness == 2) {
            sortedTimeObjectArray = completeBeerList.sort(function (a, b) {
              return b.time - a.time;
            });
            newness = 1;
          } else {
            sortedTimeObjectArray = completeBeerList.sort(function (a, b) {
              return a.time - b.time;
            });
            newness = 2;
          }
          sortedTimeObjectArray.forEach((beer) => postBeer(beer));
        });

      topSort.style.backgroundColor = "";
      hotSort.style.backgroundColor = "";
      newSort.style.backgroundColor = "rgb(170,170,170)";
      saveSort.style.backgroundColor = "";
    });
  }
  function newAutoSort() {
    document.querySelectorAll(".main-post").forEach((post) => post.remove());

    if (newness == 0 || newness == 2) {
      sortedTimeObjectArray = allBeers.sort(function (a, b) {
        return b.time - a.time;
      });
      newness = 1;
    } else {
      sortedTimeObjectArray = allBeers.sort(function (a, b) {
        return a.time - b.time;
      });
      newness = 2;
    }
    sortedTimeObjectArray.forEach((beer) => postBeer(beer));
    topSort.style.backgroundColor = "";
    hotSort.style.backgroundColor = "";
    newSort.style.backgroundColor = "rgb(170,170,170)";
    saveSort.style.backgroundColor = "";
    console.log("a");
  }

  function topSortFunction() {
    topSort.addEventListener("click", () => {
      newness = 0;
      saveness = 0;
      // fetchNewBeer(sortedLikesObjectArray, likes);
      document.querySelectorAll(".main-post").forEach((post) => post.remove());
      fetch(`http://localhost:3000/beers`)
        .then((res) => res.json())
        .then((completeBeerList) => {
          sortedLikesObjectArray = completeBeerList.sort(function (a, b) {
            return b.likes - a.likes;
          });
          sortedLikesObjectArray.forEach((beer) => postBeer(beer));
        });

      topSort.style.backgroundColor = "rgb(170,170,170)";
      hotSort.style.backgroundColor = "";
      newSort.style.backgroundColor = "";
      saveSort.style.backgroundColor = "";
    });
  }

  function saveSortFunction() {
    saveSort.addEventListener("click", () => {
      newness = 0;
      //saveness = 1;
      document.querySelectorAll(".main-post").forEach((post) => post.remove());
      topSort.style.backgroundColor = "";
      hotSort.style.backgroundColor = "";
      newSort.style.backgroundColor = "";
      saveSort.style.backgroundColor = "rgb(170,170,170)";

      fetch(`http://localhost:3000/beers`)
        .then((res) => res.json())
        .then((completeBeerList) => {
          
          completeBeerList.forEach((beer) => {
            if (saveness === 0) {
              if (beer.saved == true) postBeer(beer);
            
            } else {
              postBeer(beer);
              
            }
          });
        if(saveness==0){
          saveness=1;
        }
        else{ 
          saveness=0;
        }
        });
    });
  }

  function fillBeerTimesArray(beer) {
    const beerTime = {
      id: beer.id,
      time: beer.time,
    };
    beerTimes.push(beerTime);
  }

  function postBeer(beer) {
    const mainPostDiv = document.createElement("div");
    mainPostDiv.className = "main-post";

    const voteSectionInPost = document.createElement("div");
    voteSectionInPost.className = "vote-section-in-post";
    const upvoteImg = document.createElement("img");
    upvoteImg.id = "upvote";
    upvoteImg.src =
      "https://www.vhv.rs/dpng/d/445-4456459_reddit-clipart-icon-reddit-upvote-hd-png-download.png";
    upvoteImg.style.filter = "grayscale(100%)";
    const upvoteCount = document.createElement("h4");
    upvoteCount.id = "upvote-count";
    upvoteCount.textContent = beer.likes;
    let upvoteCorrection = beer.likes;
    if (beer.likes >= 1000) {
      upvoteCorrection = `${Math.round(beer.likes / 100) / 10}k`;
      upvoteCount.style.fontSize = "15px";
      upvoteCount.textContent = upvoteCorrection;
    }

    const downvoteImg = document.createElement("img");
    downvoteImg.id = "downvote";
    downvoteImg.src =
      "https://www.vhv.rs/dpng/d/127-1278380_reddit-downvote-transparent-hd-png-download.png";
    downvoteImg.style.filter = "grayscale(100%)";

    const actualPostDiv = document.createElement("div");
    actualPostDiv.className = "actual-post";

    const mainHeader = document.createElement("div");
    mainHeader.id = "main-header";
    const author = document.createElement("p");
    author.id = "author";
    const splitNameString = beer.name.split(" ");
    let secondWord = splitNameString[1];
    if (splitNameString[1] == undefined) {
      secondWord = Math.floor(Math.random() * 100);
    }

    const postedBy = `${splitNameString[0]}_${secondWord}`;

    let beerTime = Date.now() / 60000 - beer.time;
    let postedAgoText = "";
    let hoursToDays = "";

    if (beerTime < 1) postedAgoText = `just now`;
    else if (beerTime < 60)
      postedAgoText = `${Math.round(beerTime)} minutes ago`;
    else if (beerTime < 1440)
      postedAgoText = `${Math.round(beerTime / 60)} hours ago`;
    else postedAgoText = `${Math.round(beerTime / 1440)} days ago`;

    if (postedAgoText == `1 minutes ago`) postedAgoText = `1 minute ago`;
    if (postedAgoText == `1 hours ago`) postedAgoText = `1 hour ago`;
    if (postedAgoText == `1 days ago`) postedAgoText = `1 day ago`;

    author.textContent = `Posted by: u/${postedBy} ${postedAgoText}`;

    const title = document.createElement("h3");
    title.id = "title";
    title.textContent = beer.tagline;
    const mainImage = document.createElement("img");
    mainImage.id = "main-image";
    mainImage.src = beer.image_url;
    const description = document.createElement("p");
    description.className = "description";
    const description2 = document.createElement("p");
    description2.className = "description";

    description.textContent = beer.description;
    const commentShareSectionDiv = document.createElement("div");
    commentShareSectionDiv.className = "comment-share-section";
    const commentImg = document.createElement("img");
    commentImg.className = "css-images";
    commentImg.id = "comment-img";
    commentImg.src =
      "https://icons-for-free.com/iconfiles/png/512/chat+comment+communication+message+talk+text+icon-1320166550137140710.png";

    const commentSpan = document.createElement("span");
    commentSpan.textContent = `${Math.round(Math.random() * 100)} Comments`;
    const commentListener = document.createElement("span");
    commentListener.append(commentImg, commentSpan);
    commentListener.id = "comment-listener";
    commentListener.className = "listeners";

    const shareImg = document.createElement("img");
    shareImg.className = "css-images";
    shareImg.id = "share-img";
    shareImg.src =
      "https://cdn0.iconfinder.com/data/icons/ui-fill-glyphs/20/share-512.png";

    const shareSpan = document.createElement("span");
    shareSpan.textContent = "Share";
    const shareListener = document.createElement("span");
    shareListener.append(shareImg, shareSpan);
    shareListener.id = "share-listener";
    shareListener.className = "listeners";

    const saveImg = document.createElement("img");
    saveImg.className = "css-images";
    saveImg.id = "save-img";
    saveImg.src = "https://cdn-icons-png.flaticon.com/512/6924/6924811.png";
    saveImg.style.filter = "grayscale(100%)";

    const saveSpan = document.createElement("span");
    saveSpan.textContent = "Save";
    const saveListener = document.createElement("span");
    saveListener.append(saveImg, saveSpan);
    saveListener.id = "save-listener";
    saveListener.className = "listeners";
    if (beer.saved == true) {
      mainPostDiv.classList.add("saved");
      saveImg.style.filter = "grayscale(0%)";
      saveSpan.textContent = "Saved";
    }

    const delSpanImg = document.createElement("img");
    delSpanImg.className = "css-images";
    delSpanImg.id = "delete-img";
    delSpanImg.src =
      "https://icon-library.com/images/delete-icon/delete-icon-13.jpg";
    const deleteListener = document.createElement("span");
    deleteListener.style.filter = "grayscale(100%)";
    deleteListener.id = "delete-button";
    deleteListener.append(delSpanImg);

    deleteListener.addEventListener("mouseover", () => {
      deleteListener.style.filter = "grayscale(0%)";
    });

    deleteListener.addEventListener("mouseout", () => {
      deleteListener.style.filter = "grayscale(100%)";
    });

    deleteListener.addEventListener("click", () => {
      fetch(`http://localhost:3000/beers/${beer.id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(mainPostDiv.remove());
    });

    mainHeader.append(author);
    voteSectionInPost.append(upvoteImg, upvoteCount, downvoteImg);
    actualPostDiv.append(
      mainHeader,
      author,
      title,
      mainImage,
      description,
      description2
    );

    if (mainImage.src == "") actualPostDiv.removeChild(mainImage);
    mainPostDiv.append(
      voteSectionInPost,
      actualPostDiv,
      commentShareSectionDiv,
      deleteListener
    );

    commentShareSectionDiv.append(commentListener, shareListener, saveListener);
    commentColumn.append(mainPostDiv);

    upvoteImg.addEventListener("click", () => {
      if (upvoteImg.style.filter == "grayscale(100%)") {
        upvoteImg.style.filter = "grayscale(0%)";
        upvoteCount.textContent = beer.likes + 1;
        if (downvoteImg.style.filter == "grayscale(0%)") {
          downvoteImg.style.filter = "grayscale(100%)";
        }
      } else {
        upvoteImg.style.filter = "grayscale(100%)";
        upvoteCount.textContent = parseInt(upvoteCount.textContent) - 1;
      }
      patching(beer.id, { likes: parseInt(upvoteCount.textContent) });
    });
    downvoteImg.addEventListener("click", () => {
      if (downvoteImg.style.filter == "grayscale(100%)") {
        downvoteImg.style.filter = "grayscale(0%)";
        upvoteCount.textContent = beer.likes - 1;
        if (upvoteImg.style.filter == "grayscale(0%)") {
          upvoteImg.style.filter = "grayscale(100%)";
        }
      } else {
        downvoteImg.style.filter = "grayscale(100%)";
        upvoteCount.textContent = parseInt(upvoteCount.textContent) + 1;
      }
      patching(beer.id, { likes: parseInt(upvoteCount.textContent) });
    });
    saveListener.addEventListener("click", () => {
      // topSort.style.backgroundColor = "";
      //       hotSort.style.backgroundColor = "rgb(170,170,170)";
      //       newSort.style.backgroundColor = "";
      //       saveSort.style.backgroundColor = "";

      if (beer.saved == false) {
        saveImg.style.filter = "grayscale(0%)";
        saveSpan.textContent = "Saved";
        beer.saved = true;
        console.log(beer.saved);
      } else {
        saveImg.style.filter = "grayscale(100%)";
        saveSpan.textContent = "Save";
        beer.saved = false;
        if (saveness == 1) mainPostDiv.remove();
        console.log(beer.saved);
      }
      console.log(newSort.style.backgroundColor);
      patching(beer.id, { saved: beer.saved });
    });
  }
});

function patching(id, patch) {
  fetch(`http://localhost:3000/beers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(patch),
  });
}
