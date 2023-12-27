if (typeof gamesCodes === "undefined") {
  var gamesCodes = document.querySelectorAll(".key-redeemer");
  var allGameData = [];
}

gamesCodes.forEach((game) => {
  let nameElement = game.querySelector(".heading-text h4");
  let keyElement = game.querySelector(".js-keyfield");

  if (nameElement && keyElement) {
    let name = nameElement.innerText;
    let key = keyElement.getAttribute("title");

    allGameData.push({ name: name, key: key });
  }
});

chrome.runtime.sendMessage({
  event: "gameData",
  gameData: allGameData,
});
