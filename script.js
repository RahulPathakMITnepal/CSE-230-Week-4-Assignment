// Image Slider Library (vanilla JavaScript)
// Call createSlider("id-of-your-slider") to turn a container into a slider.

function createSlider(sliderId) {
  // ---------- 1. Get the elements ----------
  var slider = document.getElementById(sliderId);
  var track = slider.querySelector(".slider-track");
  var slides = track.querySelectorAll(".slide");
  var total = slides.length;      // number of real slides

  // ---------- 2. Variables ----------
  var currentIndex = 1;           // 1 = first REAL slide (index 0 will be a clone)
  var isMoving = false;           // stops clicks while a slide is animating
  var dots = [];                  // list of dot buttons

  // ---------- 3. Make clones for the infinite loop ----------
  // Copy of the last slide goes at the start,
  // copy of the first slide goes at the end.
  var firstClone = slides[0].cloneNode(true);
  var lastClone = slides[total - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  // ---------- 4. Create the arrow buttons ----------
  var prevButton = document.createElement("button");
  prevButton.className = "arrow arrow-left";
  prevButton.innerHTML = "&#10094;";
  prevButton.setAttribute("aria-label", "Previous slide");
  slider.appendChild(prevButton);

  var nextButton = document.createElement("button");
  nextButton.className = "arrow arrow-right";
  nextButton.innerHTML = "&#10095;";
  nextButton.setAttribute("aria-label", "Next slide");
  slider.appendChild(nextButton);

  // ---------- 5. Create the dots ----------
  var dotsBox = document.createElement("div");
  dotsBox.className = "dots";
  slider.appendChild(dotsBox);

  for (var i = 0; i < total; i++) {
    var dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.setAttribute("data-number", i);   // remember which slide this dot is for
    dotsBox.appendChild(dot);
    dots.push(dot);
  }

  // ---------- 6. Helper functions ----------

  // Move the track to the current index
  function moveTrack() {
    track.style.transform = "translateX(" + (-currentIndex * 100) + "%)";
  }

  // Highlight the correct dot
  function updateDots() {
    var realIndex = currentIndex - 1;       // because of the clone at the start

    if (currentIndex === 0) {
      realIndex = total - 1;                // on the last-slide clone
    }
    if (currentIndex === total + 1) {
      realIndex = 0;                        // on the first-slide clone
    }

    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.remove("active");
    }
    dots[realIndex].classList.add("active");
  }

  // Go to a specific index with animation
  function goToSlide(index) {
    if (isMoving) {
      return;                               // ignore clicks during animation
    }
    isMoving = true;
    currentIndex = index;
    track.style.transition = "transform 0.5s ease-in-out";
    moveTrack();
    updateDots();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // ---------- 7. After each animation ends ----------
  // If we are on a clone, secretly jump to the real slide (no animation).
  track.addEventListener("transitionend", function () {
    if (currentIndex === 0) {
      currentIndex = total;                 // jump to the real last slide
      jumpWithoutAnimation();
    }

    if (currentIndex === total + 1) {
      currentIndex = 1;                     // jump to the real first slide
      jumpWithoutAnimation();
    }

    isMoving = false;
  });

  function jumpWithoutAnimation() {
    track.style.transition = "none";        // turn animation off
    moveTrack();
    track.offsetWidth;                      // forces the browser to apply the change
    track.style.transition = "transform 0.5s ease-in-out";
  }

  // ---------- 8. Click events ----------
  nextButton.addEventListener("click", nextSlide);
  prevButton.addEventListener("click", prevSlide);

  for (var j = 0; j < dots.length; j++) {
    dots[j].addEventListener("click", function () {
      var number = Number(this.getAttribute("data-number"));
      goToSlide(number + 1);                // +1 because of the clone at the start
    });
  }

  // ---------- 9. Start position ----------
  track.style.transition = "none";
  moveTrack();
  track.offsetWidth;
  track.style.transition = "transform 0.5s ease-in-out";
  updateDots();
}

// Start the slider
createSlider("mySlider");