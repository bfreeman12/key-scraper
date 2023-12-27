window.onload = () => {
  const querySubmit = document.getElementById("query-submit");
  const gameList = document.getElementById("game-keys");

  let addedGames = new Set();
  let gameCount = 0;

  if (querySubmit) {
    querySubmit.onclick = () => {
      chrome.runtime.sendMessage({ event: "getKeys" });
    };
  }
  chrome.runtime.onMessage.addListener((data) => {
    const { event, gameData } = data;
    if (event === "gameData") {
      // Clear the gameList before adding new games
      gameList.innerHTML = "";
      addedGames.clear();
      gameCount = 0;

      gameData.forEach((game) => {
        if (!addedGames.has(game.key)) {
          const gameItem = document.createElement("ul");
          const gameName = document.createElement("li");
          const gameKey = document.createElement("li");

          gameName.textContent = `Game: ${game.name}`;
          gameKey.textContent = `Key: ${game.key}`;

          gameItem.appendChild(gameName);
          gameItem.appendChild(gameKey);

          gameList.appendChild(gameItem);
          gameCount++;

          addedGames.add(game.key);
        }
      });

      // If no games were added, display "No games found" or "Loading..."
      if (gameCount === 0) {
        const noGamesItem = document.createElement("li");
        noGamesItem.textContent = "Loading...";
        gameList.appendChild(noGamesItem);
      }

      let gameKeysArray = Array.from(addedGames);
      chrome.storage.local.set({ gameKeys: gameKeysArray });

      const countDisplay = document.getElementById("key-count");
      countDisplay.innerText = `Total games: ${gameCount}`;

      const copyButtonsDiv = document.getElementById("buttons");
      const gameItems = gameList.getElementsByTagName("ul");

      if (gameItems.length > 0) {
        if (!document.getElementById("toClipboard")) {
          copyButtonsDiv.appendChild(copyButton());
        }

        if (!document.getElementById("toClipboardKey")) {
          copyButtonsDiv.appendChild(copyKeyButton());
        }
      }
    }
  });

  function copyButton() {
    var element = document.createElement("button");
    element.id = "toClipboard";
    element.innerHTML = "Copy Game and Key";
    element.onclick = () => {
      let copyText = "";
      const gameItems = gameList.getElementsByTagName("ul");
      for (let i = 0; i < gameItems.length; i++) {
        copyText += gameItems[i].textContent + "\n";
      }
      navigator.clipboard.writeText(copyText);
    };
    return element;
  }

  function copyKeyButton() {
    var element = document.createElement("button");
    element.id = "toClipboardKey";
    element.innerText = "Copy Key Only (csv)";
    element.onclick = () => {
      let keys = [];
      const gameItems = gameList.getElementsByTagName("ul");
      for (let i = 0; i < gameItems.length; i++) {
        const keyText = gameItems[i].children[1].textContent;
        const keyValue = keyText.split(":")[1].trim();
        keys.push(keyValue);
      }
      const copyText = keys.join(", ");
      navigator.clipboard.writeText(copyText);
    };
    return element;
  }
};
