import { rayDetected, scene } from "./init.js";

export { creatObjects, mesh };

var mesh, meshFloor;
var USE_WIREFRAME = false;

function creatObjects() {
  //方塊物件
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.MeshPhongMaterial({ color: 0xff4444, wireframe: USE_WIREFRAME }) // Color is given in hexadecimal RGB
  );
  mesh.position.y += 3;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.name = "Cube";
  rayDetected.add(mesh);
  scene.add(rayDetected);

  //地板物件
  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME })
  );
  meshFloor.rotation.x -= Math.PI / 2;
  meshFloor.receiveShadow = true;

  scene.add(meshFloor);
}
