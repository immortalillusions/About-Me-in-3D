import * as THREE from 'three';
import './style.css';
// allows us to move around with mouse
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // import orbit controls
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), // render background
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);

camera.position.setZ(10); // set camera position
camera.position.setX(-10);
renderer.render( scene, camera );
// ring
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
// standard material requires lighting to be visible
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347});
const torus = new THREE.Mesh( geometry, material );
torus.position.set(-8, 5, -10)
scene.add( torus );

// add lighting

const pointLight = new THREE.PointLight(0xffffff); // white light
pointLight.decay = 0; // tutorial had decay auto set to 0 instead of 2
pointLight.position.set(5, 5, 5); // set position of light
pointLight.intensity = 5; // Increase light intensity
scene.add(pointLight); // point light adds shadows

const pointLight2 = new THREE.PointLight(0xffffff); // white light
pointLight2.decay = 0; // same decay as the first light
pointLight2.position.set(-10, -35, 5); // set a different position
pointLight2.intensity = 5; // same intensity as the first light
scene.add(pointLight2); // add the second point light to the scene
const lightHelper2 = new THREE.PointLightHelper(pointLight2, 1); // add light helper to see where the light is coming from

const pointLight3 = new THREE.PointLight(0xffffff); // white light
pointLight3.decay = 0; // same decay as the first light
pointLight3.position.set(-5, -50, 10); // set a different position
pointLight3.intensity = 5; // same intensity as the first light
scene.add(pointLight3); // add the second point light to the scene
const lightHelper3 = new THREE.PointLightHelper(pointLight2, 1); // add light helper to see where the light is coming from

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // white light
scene.add(ambientLight); // lights up the entire thing

const lightHelper = new THREE.PointLightHelper(pointLight, 1); // add light helper to see where the light is coming from
const gridHelper = new THREE.GridHelper(200, 50); // add grid helper to see where the ground is
scene.add(lightHelper, lightHelper2, lightHelper3, gridHelper); 

// listens to dom events on the mouse and update camera position accordingly
const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24); // create sphere geometry
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff }); // create white material
  const star = new THREE.Mesh(geometry, material); // create mesh with geometry and material
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)); // -50, 50 float
  star.position.set(x,y,z); // set position of star
  scene.add(star); // add star to scene
}
// creates an empty array of 200 undefined elements (fill() = make them all undefined) and then does addStar for each element (so adds 200 elements)
Array(500).fill().forEach(addStar); // add 200 stars

// in future can also pass callback function for loading static image
const spaceTexture = new THREE.TextureLoader().load('/space.jpeg'); // load space texture
// ensure it is the correct brightness (same brightness as original)
spaceTexture.colorSpace = THREE.SRGBColorSpace
scene.background = spaceTexture; // set scene background to space texture

// avatar

const pokemonTexture = new THREE.TextureLoader().load('/pokemon.png'); // load pokemon texture
const normalTexture = new THREE.TextureLoader().load('/NormalMap.jpg'); // for texture/depth
const pokemon = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10), // create box geometry
  new THREE.MeshStandardMaterial({ map: pokemonTexture, normalMap: normalTexture }) // create material with texture
);
pokemon.position.y = -5; // position further down for scrolling
pokemon.position.x = 10; // set position of pokemon
pokemon.lookAt(camera.position); // Make the plane face the camera
scene.add(pokemon);

const ballTexture = new THREE.TextureLoader().load('/pokeball.jpeg'); // load pokeball texture
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(2, 24, 24), // create sphere geometry
  new THREE.MeshStandardMaterial({ map: ballTexture }) // create material with texture
);
ball.position.y = -15;
ball.position.x = -10; // set position of pokeball
ball.position.z = 5;
scene.add(ball);

// GLB model
let pottedPlant;
let table;
let boat;
let castle;
const loader = new GLTFLoader(); // create loader
// Load a glTF resource
// happens asynchronously so can't edit position outside of this function
loader.load(
	// resource URL
	'/models/Pothos Plant Medium.glb',
	// called when the resource is loaded
	function ( gltf ) {
    pottedPlant = gltf.scene; // set potted plant to gltf scene
		pottedPlant.position.set(-5, -25, 2); // set position of potted plant
    pottedPlant.scale.set(4, 4, 4); // Scale the model to 2x its original size
    scene.add( gltf.scene );
	},
);

loader.load(
	// resource URL
	'/models/Table with food.glb',
	// called when the resource is loaded
	function ( gltf ) {
    table = gltf.scene; 
		table.position.set(-5, -15, 15);
    table.rotation.set(3.8*Math.PI/4, Math.PI/2, Math.PI/3); // Rotate the table around the Y-axis
    table.scale.set(4, 4, 4); // Scale the model to 2x its original size
    scene.add( gltf.scene );
	},
);

loader.load(
	// resource URL
	'/models/viking_longboat.glb',
	// called when the resource is loaded
	function ( gltf ) {
    boat = gltf.scene; 
		boat.position.set(-5, -43, 10);
    boat.rotation.set(Math.PI/4, Math.PI/4, Math.PI/3); // Rotate the boat around the Y-axis
    boat.scale.set(4, 4, 4); // Scale the model to 4x its original size
    scene.add( gltf.scene );

	},
);

loader.load(
  '/models/monument_valley_level_design.glb',
  function ( gltf ) {
    castle = gltf.scene; 
		castle.position.set(0, -37, 19);
    castle.rotation.set(Math.PI/4, Math.PI/4, Math.PI/3); // Rotate the castle around the Y-axis
    castle.scale.set(1/100, 1/100, 1/100); // Scale the model down
    scene.add( gltf.scene );

	},
)

function moveCamera(){
  // t is always negative (bc we scrolling down)
  const t = document.body.getBoundingClientRect().top; // how far we are from the top
  const scrollHeight = document.body.scrollHeight - window.innerHeight; // total scrollable height
  const scrollProgress = Math.abs(t) / scrollHeight; // progress of scroll (0 to 1)

  ball.rotation.x += 0.01;
  ball.rotation.y += 0.04; // rotate on y-axis
  ball.rotation.z += 0.1; // rotate on z-axis
  pokemon.lookAt(camera.position); // Make the plane face the camera
  camera.position.z = 10 + t * -0.0005; // move camera down when scrolling
  camera.position.x = -10+ t * 0.0001; // move camera down when scrolling
  camera.position.y = t * 0.02; // move camera down when scrolling

  // Check if the pottedPlant is loaded before modifying it
  if (pottedPlant) {
    pottedPlant.rotation.set(0,scrollProgress * Math.PI,scrollProgress * Math.PI); // Rotate the plant around the Y-axis
  }
  if (table){
    table.rotation.y = scrollProgress * Math.PI/2;
  }
}

document.body.onscroll = moveCamera; // called when user scrolls

// don't call this within animate bc it's expensive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {

  requestAnimationFrame( animate );
  controls.update(); // update controls (eg. mouse movement)
  torus.rotation.x += 0.01; // rotate on x-axis
  torus.rotation.y += 0.005; // rotate on y-axis 
  torus.rotation.z += 0.01; // rotate on z-axis
  if (boat){
    const time = Date.now() * 0.002; // Use time to create a smooth oscillation
    boat.rotation.y = Math.PI/4 + Math.sin(time) * (Math.PI / 8); // Rocking motion around Y-axis
  }
  if (castle) {
    castle.rotation.x += 0.01;
  }
  renderer.render( scene, camera );

}
animate();