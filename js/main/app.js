//場景
function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  return scene;
}

//相機
function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  return camera;
}

//燈光
function createLight() {
  const light = new THREE.PointLight(0xffffff, 1, 1000);
  light.position.set(0, 0, 10);
  return light;
}

//3D幾何物件
function createCube({ color, x, y }) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, 0);

  return cube;
}

//渲染到畫面
function createRenderer() {
  const root = document.getElementById("app");
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  root.appendChild(renderer.domElement);
  return renderer;
}

//動畫執行
function animate(callback) {
  function loop(time) {
    callback(time);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

const renderer = createRenderer();
const scene = createScene();
const camera = createCamera();
const interactionManager = new THREE.InteractionManager(
  renderer,
  camera,
  renderer.domElement
);

//相機控制
const controls = new THREE.OrbitControls(camera, renderer.domElement);

const cubes = {
  pink: createCube({ color: 0xff00ce, x: -1, y: -1 }),
  purple: createCube({ color: 0x9300fb, x: 1, y: -1 }),
  blue: createCube({ color: 0x0065d9, x: 1, y: 1 }),
  cyan: createCube({ color: 0x00d7d0, x: -1, y: 1 }),
};

const light = createLight();

for (const [name, object] of Object.entries(cubes)) {
  object.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log(`${name} cube was clicked`);
    const cube = event.target;
    const coords = { x: camera.position.x, y: camera.position.y ,z: camera.position.z};
    controls.enabled = false;
    const tween = new TWEEN.Tween(coords)
      .to({ x: cube.position.x, y: cube.position.y, z: 5})
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        controls.target.set(coords.x, coords.y, controls.target.z)
        camera.position.set(coords.x, coords.y, coords.z);
        controls.update();
      })
      .onComplete(() => {
        controls.enabled = true;
        camera.lookAt(cube.position);
        console.log(controls.target);
        console.log(cube.position)
      })
      .start();
  });
  interactionManager.add(object);
  scene.add(object);
}

//RWD響應
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}



scene.add(light);

animate((time) => {
  renderer.render(scene, camera);
  interactionManager.update();
  TWEEN.update(time);
});
