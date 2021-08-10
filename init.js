export {
  init,
  onWindowResize,
  rayDetected,
  camera,
  raycaster,
  renderer,
  scene,
};

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();

var ambientLight, light, rayDetected, raycaster;
// const camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

raycaster = new THREE.Raycaster();
rayDetected = new THREE.Group();
//scene.add(rayDetected);

camera.position.set(0, 1.8, -5);
camera.lookAt(new THREE.Vector3(0, 1.8, 0));

function init() {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  light = new THREE.PointLight(0xffffff, 0.8, 18);
  light.position.set(-3, 9, -5);
  light.castShadow = true;
  // Will not light anything closer than 0.1 units or further than 25 units
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  scene.add(light);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  document.body.appendChild(renderer.domElement);

  //忘了這是什麼??
  // scene.add(controls.getObject());
  // renderer.domElement.addEventListener("click", function () {
  //   // 移除 html element
  //   words = document.getElementById("words");
  //   if (words) {
  //     words.remove();
  //   }
  //   controls.lock();
  // });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
