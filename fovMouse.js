// import { GLTFLoader } from "./three.js-master/examples/jsm/loaders/GLTFLoader.js";

var mesh, meshFloor, ambientLight, light, model, mouse, raycaster;

var USE_WIREFRAME = false;
//var rayOK: THREE.Object3D;//type script的用法無法在此使用

var mouse = new THREE.Vector2(),
  INTERSECTED;

loaderAnim = document.getElementById("js-loader");

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
const camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);
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
    controls.lock();
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  document.body.appendChild(renderer.domElement);

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
  scene.add(mesh);

  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME })
  );
  meshFloor.rotation.x -= Math.PI / 2;
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);
}
// function loadModel() { // 舊的方法
//   const MODEL_PATH = "./skull_downloadable/scene.gltf";
//   var loader = new THREE.GLTFLoader();
//   loader.load(
//     MODEL_PATH,
//     function (gltf) {
//       model = gltf.scene;
//       let fileAnimations = gltf.animations;
//       model.traverse((o) => {
//         if (o.isMesh) {
//           o.castShadow = true;
//           o.receiveShadow = true;
//         }
//       });
//       // Set the models initial scale
//       model.scale.set(2.5, 2.5, 2.5);
//       model.position.y = 7;
//       model.position.z = -2;
//       model.rotation.y = 9.5;
//       model.rotation.x = -1;

//       scene.add(model);
//       loaderAnim.remove();
//     },
//     undefined, // We don't need this function
//     function (error) {
//       console.error(error);
//     }
//   );

//}
function loadModel() {
  const loader = new THREE.GLTFLoader();
  loader.load("./skull_downloadable/scene.gltf", function (gltf) {
    model = gltf.scene;

    model.scale.set(2.5, 2.5, 2.5);
    model.position.y = 7;
    model.position.z = -2;
    model.rotation.y = 9.5;
    model.rotation.x = -1;
    scene.add(model);
    loaderAnim.remove();
  });
}
function animate() {
  move();
  // resetMaterials();
  // hoverPieces();
  rayCast();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
// function resetMaterials() {
//   for (let i = 0; i < scene.children.length; i++) {
//     if (scene.children[i].material) {
//       scene.children[i].material.opacity = 1.0;
//     }
//   }
// }
// function hoverPieces() {
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObjects(scene.children, true);

//   for (let i = 0; i < intersects.length; i++) {
//     intersects[i].object.material.transparent = true;
//     intersects[i].object.material.opacity = 0.5;
//   }
// }
function rayCast() {
  // ON MOUSEMOVE HIGHLIGHT MODEL
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED)
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xff2222);
    }
  } else {
    if (INTERSECTED)
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

    INTERSECTED = null;
  }
}
function move() {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  if (model) {
    model.rotation.y += 0.02;
    model.rotation.x += 0.02;

    // model.scale.x += sine;
    // model.scale.y += sine;
    // model.scale.z += sine;
    // console.log(sine);
    //can't access lexical declaration 'time' before initialization
  }

  let time = performance.now();

  delta = clock.getDelta();
  //console.log( Math.sin(time * 0.001));
  //var sine = delta * Math.sign(Math.sin(time * 0.001));
  var sine = Math.sin(time * 0.001);
  //console.log(Math.sign(Math.sin(time * 0.001)));
  //mesh.position.y += 2.5 * sine;
  mesh.position.y -= 0.08 * sine;

  mesh.scale.x -= 0.05 * sine;
  mesh.scale.y -= 0.05 * sine;
  mesh.scale.z -= 0.05 * sine;

  // mesh.scale.x += 1.5 * sine;
  // mesh.scale.y += 1.5 * sine;
  // mesh.scale.z += 1.5 * sine;

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

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
document.body.addEventListener("keydown", onKeyDown, false); //キーボードに関するイベントリスナ登録
document.body.addEventListener("keyup", onKeyUp, false);
window.addEventListener("mousemove", onMouseMove, false);
