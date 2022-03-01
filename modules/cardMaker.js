function ml(tagName, props, text) {
  let el = document.createElement(tagName);
  if(props) {
    for(let name in props) {
      if(name.indexOf("on") === 0) {
        el.addEventListener(name.substr(2).toLowerCase(), props[name], false)
      } else {
        props[name] && el.setAttribute(name, props[name]);  
      }
    }
  }
  
  text ? el.innerHTML = text : el.innerHTML = ""
  return el
}

function buildCard (structure) {
  let title;
  if (structure.url) {
    title = `<a href="${structure.url}">${structure.title}</a>`
  } else {title = structure.title}
  if (structure.author) {structure.text = `<p class="byline">${structure.author}</p>` + structure.text}
  const header = ml("header", {class:"card-header"}, title),
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
