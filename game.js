let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", function (e) {
  if (e.touches.length !== 1) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener("touchmove", function (e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener("touchend", function (e) {
  if (e.changedTouches.length !== 1) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) {
      moveRight();
    } else if (dx < -30) {
      moveLeft();
    }
  } else {
    if (dy > 30) {
      moveDown();
    } else if (dy < -30) {
      moveUp();
    }
  }
}, { passive: false });
