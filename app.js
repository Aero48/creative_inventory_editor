var items = [];
var tabs = [];
var currentTab = 0;

const container = document.getElementById("container");
const itemInput = document.getElementById("item-input")

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

function test(id) {
  console.log(id)
}

function displayTab(id) {
  let index = 1
  container.innerHTML = "";
  let divider = document.createElement("div")
  divider.className = "divider"
  divider.id = 0;
  container.appendChild(divider)
  tabs[id].tab_items.forEach(item => {
    let img = document.createElement("img")

    checkIfImageExists("icons/" + item.name.replace(':', '__') + ".png", (exists) => {
      if (exists) {
        img.src = "icons/" + item.name.replace(':', '__') + ".png"
      } else if (item.nbt == null) {
        img.src = "icons/" + item.name.replace(':', '__') + "__{Damage__0}.png"
      } else {
        img.src = "icons/" + item.name.replaceAll(':', '__') + "__" + item.nbt.replaceAll(':', '__').replaceAll('\"', "'") + '.png'
      }
    });
    let divider = document.createElement("div")
    divider.className = "divider"
    divider.id = index;
    container.appendChild(img)
    container.appendChild(divider)
    index++;
  })
}

async function dataCollect() {
  await $.getJSON("json/building_blocks.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  await $.getJSON("json/decorations.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  await $.getJSON("json/redstone.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  await $.getJSON("json/transportation.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  await $.getJSON("json/misc.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  await $.getJSON("json/food.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  await $.getJSON("json/tools.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  await $.getJSON("json/combat.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  await $.getJSON("json/brewing.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  await $.getJSON("json/10_spawn_eggs.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  await $.getJSON("json/11_operator.json", function (data) {
    tabs.push(data)
  }).fail(function () {
    console.log("An error has occurred.");
  });

  displayTab(currentTab);
}

$(document).ready(function () {
  dataCollect()
  $('body').on('click', 'div.divider', function () {
    console.log(this.id)
    tabs[currentTab].tab_items.splice(this.id, 0, { name: itemInput.value })
    displayTab(currentTab)
  });

  $('body').on('click', 'button.tab', function () {
    //console.log(this.dataset.tab)
    currentTab = Number(this.dataset.tab)
    displayTab(currentTab)
  })
})
