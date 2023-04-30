var items = [];
var tabs = [];
var mods = [];
var tabNames = ['building_blocks', 'decorations', 'redstone', 'transportation', 'misc', 'food', 'tools', 'combat', 'brewing', '10_spawn_eggs', '11_operator'];
var currentTab = 0;
var mode = "add";

const container = document.getElementById("container");
const itemInput = document.getElementById("item-input");
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

$(document).ready(function () {
  dataCollect()
  $('body').on('click', 'div.divider', function () {
    if (mode == "add") {
      console.log(this.id)
      tabs[currentTab].tab_items.splice(this.id, 0, { name: itemInput.value })
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
    items.forEach(item => {
      if (this.innerHTML == item.split(":")[0]) {

        const queryItem = document.createElement('img');
        queryItem.title = item;
        checkIfImageExists("icons/" + item.replace(':', '__') + ".png", (exists) => {
          if (exists) {
            queryItem.src = "icons/" + item.replace(':', '__') + ".png"
          } else {
            checkIfImageExists("icons/" + item.replace(':', '__') + "__{Damage__0}.png", (exists) => {
              if (exists) {
                queryItem.src = "icons/" + item.replace(':', '__') + "__{Damage__0}.png"
              } else {
                queryItem.src = "icons/cube-solid.svg"
              }
            })
          }
        })
        //console.log(searchList)
        searchList.appendChild(queryItem);
      }

    })
  })

  textBoxChange()
})
