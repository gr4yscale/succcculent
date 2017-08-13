// the good ole "util" module, a trashcan for everything!

export const lerp = (v0, v1, t) => {
    return v0*(1-t)+v1*t
}

export const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
}


export const saveData = (data, fileName) => {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";

  var json = JSON.stringify(data),
    blob = new Blob([json], {type: "octet/stream"}),
    url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}



// function saveSTL(scene, name) {
//   var exporter = new stlExporter()
//   var stlString = exporter.parse(scene)
//
//   console.log(stlString)
//   // console.log(exporter)
//   debugger
//
//   var blob = new Blob([stlString], {type: 'text/plain'})
//   // saveAs(blob, name + '.stl')
//
//   // create a link and make us click on it!
//   var a = document.createElement("a");
//   document.body.appendChild(a);
//   a.style = "display: none";
//
//   url = window.URL.createObjectURL(blob);
//   a.href = url;
//   a.download = name;
//   a.click();
//   window.URL.revokeObjectURL(url);
// }
//
// const stlExporter = require('three-STLexporter') // adds to the global THREE namespace

