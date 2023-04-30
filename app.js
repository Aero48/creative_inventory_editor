var items = [];
var potions = [];
var tabs = [];
var mods = [];
var tabNames = ['building_blocks', 'decorations', 'redstone', 'transportation', 'misc', 'food', 'tools', 'combat', 'brewing', '10_spawn_eggs', '11_operator'];
var currentTab = 0;
var queryList = [];
var queryPage = 1;
var mode = "add";

const container = document.getElementById("container");
const itemInput = document.getElementById("item-input");
const nbtInput = document.getElementById("nbt-input");
const thumbnail = document.getElementById("thumbnail");
const modeBtn = document.getElementById("mode-switch");
const modTabs = document.getElementById("item-search-mod-tabs");
const searchList = document.getElementById("item-search-list");

function textBoxChange() {
  $(itemInput).change(function () {

    checkIfImageExists("icons/" + itemInput.value.replace(':', '__') + ".png", (exists) => {
      if (exists) {
        thumbnail.src = "icons/" + itemInput.value.replace(':', '__') + ".png"
      } else {
        checkIfImageExists("icons/" + itemInput.value.replace(':', '__') + "__{Damage__0}.png", (exists) => {
          if (exists) {
            thumbnail.src = "icons/" + itemInput.value.replace(':', '__') + "__{Damage__0}.png"
          } else {
            thumbnail.src = "icons/cube-solid.svg"
          }
        })
      }
    })
    //thumbnail.src = "icons/" + itemInput.value.replace(':', '__') + ".png"
    //console.log(thumbnail.src);
  })
}

function checkIfImageExists(url, callback) {
  const img = new Image();
  img.src = url;

  if (img.complete) {
    callback(true);
  } else {
    img.onload = () => {
      callback(true);
    };

    img.onerror = () => {
      callback(false);
    };
  }
}

function downloadObjectAsJson(exportObj, exportName) {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function clearLocal() {
  localStorage.clear();
  location.reload();
}

function displayTab(id) {
  let index = 1
  container.innerHTML = "";
  let divider = document.createElement("div")
  divider.className = "divider"
  divider.id = 0;
  container.appendChild(divider)
  tabs[id].tab_items.forEach(item => {
    let img = document.createElement("img");
    img.classList.add("tab-img");
    img.dataset.id = index - 1;
    img.title = item.name;
    if (item.nbt == null) {
      checkIfImageExists("icons/" + item.name.replace(':', '__') + ".png", (exists) => {
        if (exists) {
          img.src = "icons/" + item.name.replace(':', '__') + ".png"
        } else {
          checkIfImageExists("icons/" + item.name.replace(':', '__') + "__{Damage__0}.png", (exists) => {
            if (exists) {
              img.src = "icons/" + item.name.replace(':', '__') + "__{Damage__0}.png"
            } else {
              img.src = "icons/cube-solid.svg"
            }
          })
        }
      })
    } else {
      img.title += " NBT: " + item.nbt;
      checkIfImageExists("icons/" + item.name.replaceAll(':', '__') + "__" + item.nbt.replaceAll(':', '__').replaceAll('\"', "'") + '.png', (exists) => {
        if (exists) {
          img.src = "icons/" + item.name.replaceAll(':', '__') + "__" + item.nbt.replaceAll(':', '__').replaceAll('\"', "'") + '.png'
        } else {
          checkIfImageExists("icons/" + item.name.replace(':', '__') + ".png", (exists) => {
            if (exists) {
              img.src = "icons/" + item.name.replace(':', '__') + ".png"
            } else {
              img.src = "icons/cube-solid.svg"
            }
          })
        }
      })
    }
    let divider = document.createElement("div")
    divider.className = "divider"
    divider.id = index;
    container.appendChild(img)
    container.appendChild(divider)
    index++;
  })
}

function getModTabs() {
  let tempMods = []
  items.forEach(item => {
    tempMods.push(item.split(":")[0])
    mods = [...new Set(tempMods)];
  })
  mods.forEach(mod => {
    const modElement = document.createElement("button");
    modElement.innerHTML = mod;
    modElement.classList.add("mod-tab");
    modTabs.appendChild(modElement);
  })
}

async function dataCollect() {
  await $.getJSON("json/items.json", function (data) {
    items = data.items
  }).fail(function () {
    console.log("An error has loading items");
  });

  await $.getJSON("json/potions.json", function (data) {
    potions = data.potions
  }).fail(function () {
    console.log("An error has loading items");
  });

  for (const tab of tabNames) {
    if (localStorage.hasOwnProperty(tab) == true) {
      tabs.push(JSON.parse(localStorage.getItem(tab)))
    } else {
      await $.getJSON("json/" + tab + ".json", function (data) {
        tabs.push(data)
      }).fail(function () {
        console.log("An error has occurred loading tab: " + tab);
      });
    }
  }

  displayTab(currentTab);
  getModTabs();
}

function modeSwitch() {
  if (mode == "add") {
    mode = "delete";
    modeBtn.innerHTML = "Delete";
  } else if (mode == "delete") {
    mode = "add";
    modeBtn.innerHTML = "Add";
  }
}

function searchPageChange(amount) {
  if (!(queryPage == 1 && amount < 0)) {
    if ((queryList[(queryPage) * 49] != null) || amount < 0) {
      queryPage += amount;
      displayQuery(queryPage);
    }

  }

}

function displayQuery(page) {
  pg = page;
  let pageList = [];
  for (let i = pg * 49 - 49; i < pg * 49; i++) {
    pageList.push(queryList[i])
  }
  searchList.innerHTML = "";
  pageList.forEach(item => {
    let img = document.createElement("img");
    img.classList.add("query-img");
    img.dataset.name = item.name;
    //img.dataset.id = index - 1;
    img.title = item.name;
    if (item.nbt == null) {
      checkIfImageExists("icons/" + item.name.replace(':', '__') + ".png", (exists) => {
        if (exists) {
          img.src = "icons/" + item.name.replace(':', '__') + ".png"
        } else {
          checkIfImageExists("icons/" + item.name.replace(':', '__') + "__{Damage__0}.png", (exists) => {
            if (exists) {
              img.src = "icons/" + item.name.replace(':', '__') + "__{Damage__0}.png"
            } else {
              img.src = "icons/cube-solid.svg"
            }
          })
        }
      })
    } else {
      img.dataset.nbt = item.nbt;
      img.title += " NBT: " + item.nbt;
      checkIfImageExists("icons/" + item.name.replaceAll(':', '__') + "__" + item.nbt.replaceAll(':', '__').replaceAll('\"', "'") + '.png', (exists) => {
        if (exists) {
          img.src = "icons/" + item.name.replaceAll(':', '__') + "__" + item.nbt.replaceAll(':', '__').replaceAll('\"', "'") + '.png'
        } else {
          checkIfImageExists("icons/" + item.name.replace(':', '__') + ".png", (exists) => {
            if (exists) {
              img.src = "icons/" + item.name.replace(':', '__') + ".png"
            } else {
              img.src = "icons/cube-solid.svg"
            }
          })
        }
      })
    }
    searchList.appendChild(img)
    //index++;
  })
}

$(document).ready(function () {
  dataCollect()
  $('body').on('click', 'div.divider', function () {
    if (mode == "add") {
      console.log(this.id)
      if (nbtInput.value != "") {
        tabs[currentTab].tab_items.splice(this.id, 0, { name: itemInput.value, nbt: nbtInput.value })
      } else {
        tabs[currentTab].tab_items.splice(this.id, 0, { name: itemInput.value })
      }
      localStorage.setItem(tabNames[currentTab], JSON.stringify(tabs[currentTab]));
      displayTab(currentTab)
    }
  });

  $('body').on('click', 'button.tab', function () {
    currentTab = Number(this.dataset.tab)
    displayTab(currentTab)
  })

  $('body').on('click', 'img.tab-img', function () {
    if (mode == "delete") {

      let currentID = Number(this.dataset.id)
      console.log(currentID)
      let firstHalf = tabs[currentTab].tab_items.slice(0, currentID)
      let secondHalf = tabs[currentTab].tab_items.slice(currentID + 1);
      tabs[currentTab].tab_items = firstHalf.concat(secondHalf);
      localStorage.setItem(tabNames[currentTab], JSON.stringify(tabs[currentTab]));
      displayTab(currentTab)
    }

  })

  $('body').on('click', 'button.mod-tab', function () {
    searchList.innerHTML = "";
    queryList = [];
    queryPage = 1;
    items.forEach(item => {
      if (this.innerHTML == item.split(":")[0]) {
        if (item == "minecraft:potion" || item == "minecraft:splash_potion" || item == "minecraft:lingering_potion" || item == "minecraft:tipped_arrow") {
          potions.forEach(potion => {
            queryList.push({ name: item, nbt: "{Potion:\"" + potion + "\"}" })
          })
        } else {
          queryList.push({ name: item })
        }
      }
    })
    console.log(queryList)
    displayQuery(queryPage);
  })

  $('body').on('click', 'img.query-img', function () {
    itemInput.value = this.dataset.name;
    nbtInput.value = this.dataset.nbt;
    if (this.dataset.nbt != null) {
      nbtInput.value = this.dataset.nbt;
    } else {
      nbtInput.value = "";
    }
  })

  textBoxChange()
})
