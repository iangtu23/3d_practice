//var scene, camera, renderer, mesh;
var mesh;

var meshFloor, ambientLight, light;

// var keyboard = {};
//var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.PointerLockControls(camera, renderer.domElement); //カメラにPointerLockControls機能を付与

mesh = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshPhongMaterial({ color: 0xff4444, wireframe: USE_WIREFRAME }) // Color is given in hexadecimal RGB
);

meshFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50, 10, 10),
  new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME })
);

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now(); //1フレーム前の時刻を記憶
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

init();
animate();

function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  document.body.appendChild(renderer.domElement);
  camera.position.set(0, 1.8, -5);
  camera.lookAt(new THREE.Vector3(0, 1.8, 0));

  mesh.position.y += 3;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);

  meshFloor.rotation.x -= Math.PI / 2;
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  light = new THREE.PointLight(0xffffff, 0.8, 18);
  light.position.set(-3, 9, -3);
  light.castShadow = true;
  // Will not light anything closer than 0.1 units or further than 25 units
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  scene.add(light);

  //   camera.lookAt(new THREE.Vector3(0, player.height, 0));
  scene.add(controls.getObject());
  renderer.domElement.addEventListener("click", function () {
    controls.lock();
  });
}

function animate() {
  move();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//   if (keyboard[87]) {
//     // W key
//     camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
//     camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
//   }
//   if (keyboard[83]) {
//     // S key
//     camera.position.x += Math.sin(camera.rotation.y) * player.speed;
//     camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
//   }
//   if (keyboard[65]) {
//     // A key
//     // Redirect motion by 90 degrees
//     camera.position.x +=
//       Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
//     camera.position.z +=
//       -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
//   }
//   if (keyboard[68]) {
//     // D key
//     camera.position.x +=
//       Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
//     camera.position.z +=
//       -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
//   }

//   if (keyboard[37]) {
//     //left arrow key
//     camera.rotation.y -= Math.PI * 0.01;
//   }
//   if (keyboard[39]) {
//     //right arrow key
//     camera.rotation.y += Math.PI * 0.01;
//   }

// camera.position.set(0, player.height, -5);

function move() {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  //カメラの移動を制御する関数.毎フレーム呼ばれる
  let time = performance.now();
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

document.body.addEventListener("keydown", onKeyDown, false); //キーボードに関するイベントリスナ登録
document.body.addEventListener("keyup", onKeyUp, false);
// function keyDown(event) {
//   keyboard[event.keyCode] = true;
// }

// function KeyUp(event) {
//   keyboard[event.keyCode] = false;
// }

// window.addEventListener("keydown", keyDown);
// window.addEventListener("keyup", KeyUp);

//window.onload = init;
