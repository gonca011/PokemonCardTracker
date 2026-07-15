console.log("Script carregado");

window.onclick = function(event) {
    console.log("Clique detetado");
};

function openPage(pageName, elmnt, color) {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click(); 

function filterSelection(element, c) {
    var x, i;
    x = document.getElementsByClassName("column");

    if (c == "all") c = "";

    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");

        if (x[i].className.indexOf(c) > -1) {
            w3AddClass(x[i], "show");
        }
    }

    document.querySelectorAll(".dropdown-content").forEach(dropdown => {
        dropdown.classList.remove("show");
    });
}

// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}


function toggleDropdown(button) {
    const dropdown = button.nextElementSibling;

    // Fecha todos os dropdowns
    const allDropdowns = document.getElementsByClassName("dropdown-content");

    for (let i = 0; i < allDropdowns.length; i++) {
        if (allDropdowns[i] !== dropdown) {
            allDropdowns[i].classList.remove("show");
        }
    }

    // Abre/fecha o atual
    dropdown.classList.toggle("show");
}

function filterFunction(input) {
    const filter = input.value.toUpperCase();
    const dropdown = input.parentElement;
    const links = dropdown.getElementsByTagName("a");

    for (let i = 0; i < links.length; i++) {
        const txtValue = links[i].textContent || links[i].innerText;

        if (txtValue.toUpperCase().includes(filter)) {
            links[i].style.display = "";
        } else {
            links[i].style.display = "none";
        }
    }

    
}

window.onclick = function(event) {
    console.log(event.target);
    console.log("clicked outside");
    if (!event.target.matches('.btn') && !event.target.matches('.dropdown-content') && !event.target.matches('.dropdown-content a') && !event.target.matches('.dropdown-content input')) {
        console.log("clicked outside");
        const dropdowns = document.getElementsByClassName("dropdown-content");

        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove("show");
        }
    }
}

fetch("../sets.json")
.then(response => response.json())
.then(expansions => {

    const container = document.getElementById("expansionFilters");

    expansions.forEach(expansion => {

        const id = expansion
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");


        const link = document.createElement("a");

        link.href = "#";
        link.textContent = expansion;


        link.onclick = function () {
            filterSelection(this, id);
        };


        container.appendChild(link);

    });

});

