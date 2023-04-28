var items = [];
var tab_items = [];
var quark_items = [];

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

  function test(id){
    console.log(id)
  }

function displayTab(){
  let index = 1
  container.innerHTML = "";
  let divider = document.createElement("div")
  divider.className = "divider"
  divider.id = 0;
  container.appendChild(divider)
    tab_items.forEach(item =>{
        let img = document.createElement("img")
        
        checkIfImageExists("icons/"+item.name.replace(':', '__')+".png", (exists) => {
            if (exists) {
              img.src = "icons/"+item.name.replace(':', '__')+".png"
            } else if (item.nbt == null){
                img.src = "icons/"+item.name.replace(':', '__')+"__{Damage__0}.png"
            } else {
                //img.src = "icons/"+item.name.replace(':', '__')+"__"+item.nbt.replace(':', '__').replace('\"', "'").replace('\"', "'")+'.png'
                //img.src = "icons/"+item.name.replace(':', '__')+"__"+item.nbt.replace(':', '__').replace(':', '__').replace('\"', "'").replace('\"', "'")+'.png'
                img.src = "icons/"+item.name.replaceAll(':', '__')+"__"+item.nbt.replaceAll(':', '__').replaceAll('\"', "'")+'.png'
                //img.src = "icons/minecraft__tipped_arrow__{Potion__'minecraft__strong_poison'}.png"
                //console.log(test)
                //img.src = "icons/minecraft__tipped_arrow__{Potion__'minecraft:strong_poison'}.png"
                //minecraft__enchanted_book__{StoredEnchantments__[{id__'minecraft__blast_protection',lvl__1s}]}.png
            }
            //minecraft__tipped_arrow__{Potion__'minecraft__strong_poison'}
          });
          //img.alt = item.name
          let divider = document.createElement("div")
          divider.className = "divider"
          divider.id = index;
          container.appendChild(img)
          container.appendChild(divider)
          index++;
        //img.src = "icons/"+item.name.replace(':', '__')+".png"
        //console.log(img.src)
        
    })
}

function displayItems(){
    quark_items.forEach(item =>{
        let img = document.createElement("img")
        
        checkIfImageExists("icons/"+item.replace(':', '__')+".png", (exists) => {
            if (exists) {
              img.src = "icons/"+item.replace(':', '__')+".png"
            } else if (item.nbt == null){
                img.src = "icons/"+item.replace(':', '__')+"__{Damage__0}.png"
            } else {
                //img.src = "icons/"+item.name.replace(':', '__')+"__"+item.nbt.replace(':', '__').replace('\"', "'").replace('\"', "'")+'.png'
                //img.src = "icons/"+item.replace(':', '__')+"__"+item.nbt.replace(':', '__').replace(':', '__').replace('\"', "'").replace('\"', "'")+'.png'
                img.src = "icons/"+item.replaceAll(':', '__')+"__"+item.nbt.replaceAll(':', '__').replaceAll('\"', "'")+'.png'
                //img.src = "icons/minecraft__tipped_arrow__{Potion__'minecraft__strong_poison'}.png"
                //console.log(test)
                //img.src = "icons/minecraft__tipped_arrow__{Potion__'minecraft:strong_poison'}.png"
            }
            //minecraft__tipped_arrow__{Potion__'minecraft__strong_poison'}
          });
          img.alt = item
          container.appendChild(img)
        //img.src = "icons/"+item.name.replace(':', '__')+".png"
        console.log(img.src)
        
    })
}

$(document).ready(function(){
    // $.getJSON("json/items.json", function(data){
    //     items = data.items

    //     items.forEach(item => {
    //         if(item.split(':')[0]=='quark'){
    //             quark_items.push(item)
    //         }
    //     })
    //     console.log(quark_items)
    //     displayItems();
    //     //let test = document.createElement("img")
    //     //test.src = "icons/"+items[2529].replace(':', '__')+".png"
        
    //     // container.appendChild(test)
        
    // }).fail(function(){
    //     console.log("An error has occurred.");
    // }); quark__ancient_tome__{StoredEnchantments__[{id__'minecraft__fire_aspect',lvl__2s}]}.png

    $.getJSON("json/food.json", function(data){
        tab_items = data.tab_items
        displayTab();
        $('body').on('click', 'div.divider', function() {
          console.log(this.id)
          tab_items.splice(this.id, 0, {name: itemInput.value})
          console.log(tab_items)
          displayTab()
        });
        
        
        
    }).fail(function(){
        console.log("An error has occurred.");
    });

    
})
