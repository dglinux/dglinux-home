function framifyImages() {
  let images = document.querySelectorAll("img");
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (img.getAttribute("exempt")) {
      continue;
    }
    const holder = document.createElement("div");
    const content = document.createElement("div");
    content.innerHTML = img.getAttribute("alt");
    holder.classList.add("image-holder");
    content.classList.add("image-holder__description");
    img.parentNode.insertBefore(holder, img);
    holder.appendChild(img);
    holder.appendChild(content);
  }
}

function dangleImages() {
  let images = document.querySelectorAll(".image-holder");
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const positiveness = Math.random() > 0.5 ? 1 : -1;
    img.style.transform = "rotate(" + (positiveness * Math.random()) + "deg)";
  }
}

window.onscroll = function(e) {
  const elem = document.querySelector(".introduction-bar");
  if (window.scrollY != 0) {
    if (!elem.classList.contains("introduction-bar__shadow")) {
      elem.classList.add("introduction-bar__shadow");
    }
  } else {
    elem.classList.remove("introduction-bar__shadow");
  }
}

framifyImages();
dangleImages();
