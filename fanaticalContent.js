if (typeof gamesCodes === "undefined") {
  let gamesCodes = document.querySelectorAll(".order-item-details-container");
  let allGameData = [];

  gamesCodes.forEach((game) => {
    let nameElement = game.querySelector(".game-name");
    let keyElement = game.querySelector(".key-input-field");

    if (nameElement && keyElement) {
      let name = nameElement.innerText;
      let key = keyElement.value;

      allGameData.push({ name: name, key: key });
    }
  });

  chrome.runtime.sendMessage({
    event: "gameData",
    gameData: allGameData,
  });
}
