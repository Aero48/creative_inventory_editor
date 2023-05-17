var items = []; // array of items for use in mod tabs section (right side)
var potions = []; // array of all potion effects
var tabs = []; // list of all tabs and their data
var mods = []; // list of all mods
var tabNames = ['building_blocks', 'decorations', 'redstone', 'transportation', 'misc', 'food', 'tools', 'combat', 'brewing', '10_spawn_eggs', '11_operator', 'thermal_blocks']; // mod tab names for use in data collection function
var currentTab = 0; // id of current tab
var queryList = []; // array of currently display items in item search (right side of the screen)
var queryPage = 1; // current page of item search
var mode = "add"; // current mode

// DOM stuff
const container = document.getElementById("container");
const itemInput = document.getElementById("item-input");
const nbtInput = document.getElementById("nbt-input");
const thumbnail = document.getElementById("thumbnail");
const modeBtn = document.getElementById("mode-switch");
const modTabs = document.getElementById("item-search-mod-tabs");
const searchList = document.getElementById("item-search-list");
const queryIndex = document.getElementById("item-index");

// old code that waited for text inputs to change (originally for thumnail icon) I don't even think this does anything at the moment
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

// checks if image file exists
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

// downloads selected object as a json file
function downloadObjectAsJson(exportObj, exportName) {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// clears local storage and reloads the page
function clearLocal() {
  localStorage.clear();
  location.reload();
}

// visual effects depending on each mode
function modeSpecificListeners(){
  $(".divider").css("opacity", "0");
  $(".divider").hover(function(){
    if (mode == "add"){
      $(this).css("opacity", "1");
    }
  },
  function(){
    $(this).css("opacity", "0")
  });

  $(".tab-img").css("background-color", "transparent");
  $(".tab-img").hover(function(){
    if (mode == "delete"){
      $(this).css("background-color", "red");
    } else if (mode == "move"){
      $(this).css("background-color", "yellow");
    }
  },
  function(){
    $(this).css("background-color", "transparent")
  });
}

// displays all items in the current creative tab NEEDS TO BE IMPROVED
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
    img.dataset.name = item.name;
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
    let divider = document.createElement("div")
    divider.className = "divider"
    divider.id = index;
    container.appendChild(img)
    container.appendChild(divider)
    index++;
  })
  modeSpecificListeners();
}

// creates a list of all the most based on the mod ids from the items list
function getModTabs() {
  let tempMods = []
  items.forEach(item => {
    tempMods.push(item.split(":")[0])
    

  })
  // since this is using the list of all items, the mods array must have all duplicates removed.
  // then they are sorted alphabetically
  mods = [...new Set(tempMods)]; // removes duplicates
  mods.sort();
  // creates buttons for each mod
  mods.forEach(mod => {
    const modElement = document.createElement("button");
    modElement.innerHTML = mod;
    modElement.classList.add("mod-tab");
    modTabs.appendChild(modElement);
  })
}

async function dataCollect() {
  // sets the items array to a complete list of all the items in the json file
  await $.getJSON("json/items.json", function (data) {
    items = data.items
  }).fail(function () {
    console.log("An error has loading items");
  });

  // sets the potions array to a complete list of all the potions in the json file
  await $.getJSON("json/potions.json", function (data) {
    potions = data.potions
  }).fail(function () {
    console.log("An error has loading items");
  });

  // checks local storage for creative tabs. If there are none, load the default tabs (left side of the screen)
  for (const tab of tabNames) {
    if (localStorage.hasOwnProperty(tab) == true) {
      tabs.push(JSON.parse(localStorage.getItem(tab)))
    } else {
      await $.getJSON("json/tabs/" + tab + ".json", function (data) {
        tabs.push(data)
      }).fail(function () {
        console.log("An error has occurred loading tab: " + tab);
      });
    }
  }

  displayTab(currentTab);
  getModTabs();
}

// triple toggle system for mode NEEDS TO BE REPLACED WITH SOMETHING BETTER
function modeSwitch() {
  if (mode == "add") {
    mode = "delete";
    modeBtn.innerHTML = "Delete";
  } else if (mode == "delete") {
    mode = "move";
    modeBtn.innerHTML = "Move";
  } else {
    mode = "add";
    modeBtn.innerHTML = "Add";
  }
}

// changes search query page based on which arrow button is clicked
function searchPageChange(amount) {
  if (!(queryPage == 1 && amount < 0)) {
    if ((queryList[(queryPage) * 64] != null) || amount < 0) {
      queryPage += amount;
      displayQuery(queryPage);
    }
  }
}

// populates current query page with items NEEDS TO BE IMPROVED
function displayQuery(page) {
  
  pg = page;
  queryIndex.innerHTML = pg + "/" + Math.ceil(queryList.length/64);
  let pageList = [];
  for (let i = pg * 64 - 64; i < pg * 64; i++) {
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

// adds an item to the current tab at the given id
function addItem(id){
  if (nbtInput.value != "") {
    tabs[currentTab].tab_items.splice(id, 0, { name: itemInput.value, nbt: nbtInput.value })
  } else {
    tabs[currentTab].tab_items.splice(id, 0, { name: itemInput.value })
  }
  localStorage.setItem(tabNames[currentTab], JSON.stringify(tabs[currentTab]));
  displayTab(currentTab)
}

// removes a given item from the current tab
function deleteItem(elementData){
  let currentID = Number(elementData.id)
  console.log(currentID)
  let firstHalf = tabs[currentTab].tab_items.slice(0, currentID)
  let secondHalf = tabs[currentTab].tab_items.slice(currentID + 1);
  tabs[currentTab].tab_items = firstHalf.concat(secondHalf);
  localStorage.setItem(tabNames[currentTab], JSON.stringify(tabs[currentTab]));
  displayTab(currentTab)
}

// prepares a list of items based on the selected mod button
function prepareModSearchQuery(modId){
  searchList.innerHTML = "";
  queryList = [];
  queryPage = 1;
  items.forEach(item => {
    if (modId == item.split(":")[0]) {
      if (item == "minecraft:potion" || item == "minecraft:splash_potion" || item == "minecraft:lingering_potion" || item == "minecraft:tipped_arrow") {
        potions.forEach(potion => {
          queryList.push({ name: item, nbt: "{Potion:\"" + potion + "\"}" })
        })
      } else {
        queryList.push({ name: item })
      }
    }
  })
}

// fills the current item inputs with the selected item
function setCurrentItem(elementData){
  itemInput.value = elementData.name;
    nbtInput.value = elementData.nbt;
    if (elementData.nbt != null) {
      nbtInput.value = elementData.nbt;
    } else {
      nbtInput.value = "";
    }
}

function initListeners(){
  // displays the clicked tab
  $('body').on('click', 'button.tab', function () {
    currentTab = Number(this.dataset.tab)
    displayTab(currentTab)
  })

  // if user is in "add" mode, add the selected item to the current tab
  $('body').on('click', 'div.divider', function () {
    if (mode == "add") {
      addItem(this.id);
    }
  });

  // if user is in "delete" mode, remove the selected item from the current tab. If user is in "move" mode, move the item.
  $('body').on('click', 'img.tab-img', function () {
    if (mode == "delete") {
      deleteItem(this.dataset);
    } else if (mode == "move") {
      setCurrentItem(this.dataset);
      deleteItem(this.dataset);
      modeSwitch();
    }
  })

  // displays list of items in clicked mod tab
  $('body').on('click', 'button.mod-tab', function () {
    prepareModSearchQuery(this.innerHTML);
    displayQuery(queryPage);
  })

  // sets current item to be the one clicked on
  $('body').on('click', 'img.query-img', function () {
    setCurrentItem(this.dataset);
  })
}

$(document).ready(function () {
  dataCollect();
  initListeners();
  textBoxChange();
  
})
