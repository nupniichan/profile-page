import { links } from "./links.js";

const linkContainer = document.getElementById("links");

function addLink(name, link, image) {
    return `
<a href="${link}" class="link" target="_blank"> 
    <img src="${image}" alt=""/> 
    <span>${name}</span> 
    <img class="linkIcon" src="${image}" alt=""/> 
</a> 
`;
}

let allLinks = "";

links.forEach((ele) => {
    allLinks += addLink(ele.name, ele.link, ele.image);
});

linkContainer.innerHTML = allLinks;

const openModal = document.getElementById("openModal");
const modal = document.getElementById("myModal");

openModal.onclick = function () {
    modal.style.display = "block";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
