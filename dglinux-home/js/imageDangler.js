function dangleImages() {
  let images = document.querySelectorAll(".image-holder");
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const positiveness = Math.random() > 0.5 ? 1 : -1;
    img.style.transform = "rotate(" + (positiveness * Math.random()) + "deg)";
  }
}

dangleImages();
