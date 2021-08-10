var text;

function helper(x) {
  //console.log("found: " + x + text);
  if (x == "Cube") {
    text =
      "方塊，那些單格方塊能穿透固定的方塊到達最下層空位。其他的改版中則出現更多特別的造型。 不同的方塊能清除的列數不同。I方塊最多能清除4列，J、L方塊最多能清除3列，而剩餘的則最多只能清除2列。 一般來說，遊戲還會提示下一個將要落下的方塊，熟練的玩家會計算到下一個方塊";
    //console.log(text);
  } else text = "這是三小?";
}

// if (helper() === "cube") {
//   var text;
//   text = "這是一個方塊";
// }

export { helper, text };
