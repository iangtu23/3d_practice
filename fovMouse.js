import { helper } from "./helper.js";
import alpha from "./alpha.js";

var mesh, meshFloor, ambientLight, light, model, raycaster;
var rayDetected,
  selectedPiece = null;
var USE_WIREFRAME = false;
//var rayOK: THREE.Object3D;//type script的用法無法在此使用

var mouse = new THREE.Vector2(),
  INTERSECTED;
var cameraPostion = new THREE.Vector3();
var cameraDirection = new THREE.Vector3();

var loaderAnim = document.getElementById("js-loader");

//產生一個新的 html element
let div = document.createElement("div");
div.id = "words";
div.className = "box";
let h1 = document.createElement("h1");
let p = document.createElement("p");
h1.textContent = "作品介紹";
p.textContent = "嘻嘻嘻哈哈哈啦啦啦呼呼呼嘿嘿好黑";
div.appendChild(h1);
div.appendChild(p);
//找到 words html element
let words;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now(); //1フレーム前の時刻を記憶
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

var clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer();

const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new THREE.PointerLockControls(camera, renderer.domElement); //カメラにPointerLockControls機能を付与

init();
animate();

function init() {
  raycaster = new THREE.Raycaster();

  camera.position.set(0, 1.8, -5);
  camera.lookAt(new THREE.Vector3(0, 1.8, 0));

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  light = new THREE.PointLight(0xffffff, 0.8, 18);
  light.position.set(-3, 9, -5);
  light.castShadow = true;
  // Will not light anything closer than 0.1 units or further than 25 units
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  scene.add(light);

  scene.add(controls.getObject());
  renderer.domElement.addEventListener("click", function () {
    console.log("啊啊啊啊");
    // 移除 html element
    words = document.getElementById("words");
    if (words) {
      words.remove();
    }
    controls.lock();
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  document.body.appendChild(renderer.domElement);

  rayDetected = new THREE.Group();
  scene.add(rayDetected);

  creatObjects();
  loadModel();
}
function creatObjects() {
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.MeshPhongMaterial({ color: 0xff4444, wireframe: USE_WIREFRAME }) // Color is given in hexadecimal RGB
  );
  //mesh.userData.rayOK = true;//要指定mesh是可以被raycast的物件
  mesh.position.y += 3;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  rayDetected.add(mesh);
  //scene.add(mesh);

  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME })
  );
  meshFloor.rotation.x -= Math.PI / 2;
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);
  // floor.add(meshFloor);
  // scene.add(floor);
}

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
    loaderAnim.remove();
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  move();
  rayCast();

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
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

  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED)
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xff2222);
      helper("I got you");
      let c = new alpha();
      c.x = 10;
      c.y = 20;
      c.z = 30;
      c.say();
      console.log(c.cubic);
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

    // selectedPiece = intersects[0].object.userData.currentSquare;
  }

  // if (selectedPiece) {
  //   raycaster.setFromCamera(mouse, camera);
  //   intersects = raycaster.intersectObjects(rayDetected.children);

  //   if (intersects.length > 0 && intersects[0].object.userData.squareNumber) {
  //     const targetSquare = intersects[0].object.userData.squareNumber;
  //     const selectedObject = scene.children.find(
  //       (child) => child.userData.currentSquare == selectedPiece
  //     );
  //     if (!selectedObject || !targetSquare) return;

  //     const targetPosition = positionForSquare(targetSquare);
  //     selectedObject.position.set(
  //       targetPosition.x,
  //       selectedObject.position.y,
  //       targetPosition.z
  //     );
  //     selectedObject.currentSquare = targetSquare;

  //     selectedPiece = null;
  //   }
  // }
}

function move() {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  if (model) {
    model.rotation.y += 0.02;
    model.rotation.x += 0.02;
  }

  let time = performance.now();
  var sine = Math.sin(time * 0.001);

  mesh.position.y -= 0.08 * sine;
  mesh.scale.x -= 0.05 * sine;
  mesh.scale.y -= 0.05 * sine;
  mesh.scale.z -= 0.05 * sine;

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
