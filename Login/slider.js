const slider = document.querySelector('.slider');
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let intervalID = null;
const intervalDuration = 5000; // Transition interval in milliseconds

slider.addEventListener('mousedown', dragStart);
slider.addEventListener('touchstart', dragStart);
slider.addEventListener('mouseup', dragEnd);
slider.addEventListener('touchend', dragEnd);
slider.addEventListener('mousemove', drag);
slider.addEventListener('touchmove', drag);

// Start the automatic slider on page load
startSlider();

function dragStart(e) {
  e.preventDefault();
  if (e.type === 'touchstart') {
    startPos = e.touches[0].clientX;
  } else {
    startPos = e.clientX;
    slider.classList.add('grabbing');
  }
  isDragging = true;
  animationID = requestAnimationFrame(animation);
  clearInterval(intervalID); // Stop automatic sliding during manual dragging
}

function drag(e) {
  if (isDragging) {
    let currentPosition = 0;
    if (e.type === 'touchmove') {
      currentPosition = e.touches[0].clientX;
    } else {
      currentPosition = e.clientX;
    }
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function dragEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  slider.classList.remove('grabbing');
  setSliderPositionByIndex();
  startSlider(); // Resume automatic sliding after manual dragging
}

function animation() {
  setSliderPosition();
  if (isDragging) {
    requestAnimationFrame(animation);
  }
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

function setSliderPositionByIndex() {
  const slideWidth = slider.children[0].offsetWidth;
  const index = -Math.round(currentTranslate / slideWidth);
  const maxIndex = slider.children.length - 1;
  const maxTranslate = maxIndex * slideWidth;

  if (index < 0) {
    currentTranslate = -maxTranslate;
  } else if (index > maxIndex) {
    currentTranslate = 0;
  } else {
    currentTranslate = -index * slideWidth;
  }

  prevTranslate = currentTranslate;
  setSliderPosition();
}

function startSlider() {
  intervalID = setInterval(() => {
    const slideWidth = slider.children[0].offsetWidth;
    currentTranslate -= slideWidth;
    setSliderPositionByIndex();
  }, intervalDuration);
}
