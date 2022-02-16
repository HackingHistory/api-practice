function ml(tagName, props, text) {
  let el = document.createElement(tagName);
  if(props) {
    for(let name in props) {
      if(name.indexOf("on") === 0) {
        el.addEventListener(name.substr(2).toLowerCase(), props[name], false)
      } else {
        el.setAttribute(name, props[name]);
      }
    }
  }
  text ? el.textContent = text : el.textContent = ""
  return el
}

function buildCard (structure) {
  const header = ml("header", {class:"card-header"}, structure.title),
        figure=structure.figure,
        bodySec=ml("section", {class:"card-body"}),
        card=ml("section", {class:"card"})
  console.log("STRUCTURE", structure)
  bodySec.innerHTML=structure.text
  card.appendChild(header)
  figure ? card.innerHTML+=figure : console.log("no figure");
  //card.appendChid(figure)
  card.appendChild(bodySec)
  return card
}

export {buildCard}
