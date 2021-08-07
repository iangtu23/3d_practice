var text;

function helper(x) {
  //console.log("found: " + x + text);
  if (x == "Cube") {
    text = "這是一個方塊";
    //console.log(text);
  } else text = "這是三小?";
}

// if (helper() === "cube") {
//   var text;
//   text = "這是一個方塊";
// }

export { helper, text };
