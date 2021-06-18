var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var keyboard = {};
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);

  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshPhongMaterial({ color: 0xff4444, wireframe: USE_WIREFRAME }) // Color is given in hexadecimal RGB
  );
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

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  light = new THREE.PointLight(0xffffff, 0.8, 18);
  light.position.set(-3, 9, -3);
  light.castShadow = true;
  // Will not light anything closer than 0.1 units or further than 25 units
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  scene.add(light);

  camera.position.set(0, player.height, -5);
  camera.lookAt(new THREE.Vector3(0, player.height, 0));

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  document.body.appendChild(renderer.domElement);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  if (keyboard[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[65]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if (keyboard[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  if (keyboard[37]) {
    //left arrow key
    camera.rotation.y -= Math.PI * 0.01;
  }
  if (keyboard[39]) {
    //right arrow key
    camera.rotation.y += Math.PI * 0.01;
  }

  renderer.render(scene, camera);
}

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function KeyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", KeyUp);

window.onload = init;
