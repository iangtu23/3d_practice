import { helper, text } from "./helper.js";
import { creatObjects, mesh } from "./creatObjects.js";
import {
  init,
  onWindowResize,
  rayDetected,
  camera,
  raycaster,
  renderer,
  scene,
} from "./init.js";
// import {
//   controlInMove,
//   time,
//   moveForward,
//   moveBackward,
//   moveLeft,
//   moveRight,
// } from "./fov.js";

//import alpha from "./alpha.js";

//var mesh,meshFloor,USE_WIREFRAME = false, ambientLight, light, , raycaster, rayDetected;
//var selectedPiece = null;
var model;

//動畫暫停使用變數
var last = Date.now(),
  req;

//與raycast()相關變數
var mouse = new THREE.Vector2(),
  INTERSECTED;
var cameraPostion = new THREE.Vector3();
var cameraDirection = new THREE.Vector3();

var loaderAnim = document.getElementById("js-loader");

//產生一個新的 html element
let div = document.createElement("div");
div.id = "words";
div.className = "box";
let h1 = document.createElement("h2");
let p = document.createElement("p");
// h1.textContent = name + "作品介紹";
// p.textContent = "嘻嘻嘻哈哈哈啦啦啦呼呼呼嘿嘿好黑";
div.appendChild(h1);
div.appendChild(p);
//找到 words html element
let words;

//fov變數使用在move()裡
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now(); //1フレーム前の時刻を記憶
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
//var clock = new THREE.Clock();
const controls = new THREE.PointerLockControls(camera, renderer.domElement); //カメラにPointerLockControls機能を付与

creatObjects();
loadModel();
init();

animate();

function loadModel() {
  const loader = new THREE.GLTFLoader();
  loader.load("./skull_downloadable/scene.gltf", function (gltf) {
    model = gltf.scene;
    model.scale.set(2.5, 2.5, 2.5);
    model.position.y = 7;
    model.position.z = -2;
    model.rotation.y = 9.5;
    model.rotation.x = -1;
    //scene.add(model);
    rayDetected.add(model);
    model.name = "Skull"; //問題：為什麼model的名字無法顯示在log上面，mesh卻可以？

    // var skullModel = new THREE.Object3D();
    // model.userData.parent = skullModel;
    // skullModel.add(model);
    // skullModel.name = "Skull";
    // scene.add(skullModel);

    loaderAnim.remove();
  });
}

function animate() {
  move();
  rayCast();

  renderer.render(scene, camera);
  req = window.requestAnimationFrame(animate);
}
function rayCast() {
  // ON MOUSEMOVE HIGHLIGHT MODEL
  //raycaster.setFromCamera(mouse, camera);
  // var cameraPostion = new THREE.Vector3();
  // var cameraDirection = new THREE.Vector3();
  camera.getWorldPosition(cameraPostion);
  camera.getWorldDirection(cameraDirection);
  raycaster.set(cameraPostion, cameraDirection);

  var intersects = raycaster.intersectObjects(rayDetected.children, true);
  //var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    var name = intersects[0].object.name;
    // console.log("found: " + name);

    // console.log("GROUP IS " + intersects[0].object.userData.parent.name);

    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED)
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xff2222);

      helper(name);
      h1.textContent = name;
      p.textContent = text;
      // let c = new alpha();
      // c.x = 10;
      // c.y = 20;
      // c.z = 30;
      // c.say();
      // console.log(c.cubic);
    }
  } else {
    if (INTERSECTED)
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

    INTERSECTED = null;
  }
}

function onClick(event) {
  // raycaster.setFromCamera(mouse, camera);
  camera.getWorldPosition(cameraPostion);
  camera.getWorldDirection(cameraDirection);
  raycaster.set(cameraPostion, cameraDirection);
  let intersects = raycaster.intersectObjects(rayDetected.children, true);
  if (intersects.length > 0) {
    //顯示 words html element
    document.body.appendChild(div);
    div.style.animation = "boxBGShow 0.2s";
    //讓鼠標出現
    controls.unlock();

    // 暫停動畫
    cancelAnimationFrame(req);
    req = undefined;
  }
}

function move() {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  if (model) {
    model.rotation.y += 0.02;
    model.rotation.x += 0.02;
  }

  //移動的方塊與滑鼠視角使用time
  let time = performance.now();

  var sine = Math.sin(time * 0.001);

  mesh.position.y -= 0.08 * sine;
  mesh.scale.x -= 0.05 * sine;
  mesh.scale.y -= 0.05 * sine;
  mesh.scale.z -= 0.05 * sine;

  //fov計算
  if (controls.isLocked === true) {
    //マウスのポインタがロックされているときのみ有効
    let delta = (time - prevTime) / 5000;
    //速度を減衰させる
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    //進行方向のベクトルを設定
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 1000.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 1000.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }
  prevTime = time;
}

let onKeyDown = function (event) {
  //キーボード押下時の処理
  switch (event.keyCode) {
    case 87: // w
      moveForward = true;
      break;
    case 65: // a
      moveLeft = true;
      break;
    case 83: // s
      moveBackward = true;
      break;
    case 68: // d
      moveRight = true;
      break;
  }

  //問題：要怎麼樣讓boxBGHide動畫結束後，再words.remove();???
  // function boxHide() {
  //   div.style.animation = "boxBGHide 0.2s";
  //   return;
  // }
  // boxHide(1, words.remove());

  // 移除 html element
  words = document.getElementById("words");
  if (words) {
    //div.style.animation = "boxBGHide 0.2s";
    words.remove();
  }
  //讓鼠標隱藏
  controls.lock();

  // 開始動畫
  if (!req) {
    last = Date.now();
    animate();
  }
};

let onKeyUp = function (event) {
  //キーボードから離れたとき
  switch (event.keyCode) {
    case 87: // w
      moveForward = false;
      break;
    case 65: // a
      moveLeft = false;
      break;
    case 83: // s
      moveBackward = false;
      break;
    case 68: // d
      moveRight = false;
      break;
  }
};

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
document.body.addEventListener("keydown", onKeyDown, false);
document.body.addEventListener("keyup", onKeyUp, false);

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("click", onClick);
window.addEventListener("resize", onWindowResize);
