import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");
const canvasContainer = document.getElementById('canvasContainer');
const loaderElement = document.getElementById('loader');

// Initialize loading manager
const loadingManager = new THREE.LoadingManager(
  () => {
    loaderElement.style.display = 'none';
    canvasContainer.style.display = 'block';
  },
  (itemUrl, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    loaderElement.innerText = `Loading... ${Math.round(progress)}%`;
  },
  (error) => {
    console.error('Error loading assets', error);
  }
);

// Model
const gltfLoader = new GLTFLoader(loadingManager);

// Clock
const clock = new THREE.Clock();

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFF7F50);

// Tuto
function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.removeEventListener("click", closePopup);
}
const tutoriel = 'Bienvenue Emeraude Escape sur le Portfolio de Sixte Morio,</br>Ici vous découvrirez toutes ses principales créations et son cv.</br></br>Afin de vous déplacer utilisez les touches: "z" pour avancer, "q" pour aller à gauche, "s" pour reculer, "d" pour aller à droite.</br>Pour intéragir avec les PNJ, qui vous donneront des informations, dirigez vous dans les cercles jaunes <img src="imgTuto/yellowCircle.png" alt="img du cercle" style="width: 20px; height: auto;"> et appuyez sur "e".</br>Quand vous êtes sur un cercle violet <img src="imgTuto/purpleCircle.png" alt="img du cercle" style="width: 20px; height: auto;"> appuyer sur "e" pour vous téléportez.</br>Pour vous déplacez ave le bâteau appyez sur la touche "e" puis déplacer vous avec les touches de  base.</br>Pour quitter le bâteau appuyez une nouvelle fois sur "e".</br>Pour cliquer sur un lien appuyez sur "échap" et cliquez sur le lien. Une fois revenu sur le portfolio faites un clic droit.</br></br>Allez voir tout les villageois avant de discuter avec le soldat et le pharaon.</br></br>Pour fermer cette pop-up effectuez un clic droit.</br></br>Bonne Aventure !'
if (tutoriel) {
  document.getElementById("popup").style.display = "flex";
  document.getElementById("popup-message").innerHTML = tutoriel;
  document.addEventListener("click", closePopup);
}

//Primary floor
const FLOOR_SIZE = 40;
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/portfolio/textures/sand.jpg");

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(FLOOR_SIZE, FLOOR_SIZE),
  new THREE.MeshStandardMaterial({
    color: "#aaaaaa",
    metalness: 0,
    roughness: 0.6,
    map: texture,
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

//Secondary Floors
const floorRect = new THREE.Mesh(
  new THREE.PlaneGeometry(3, FLOOR_SIZE),
  new THREE.MeshStandardMaterial({
    color: "#aaaaaa",
    metalness: 0,
    roughness: 0.6,
    map: texture,
  })
);
floorRect.position.set(0, -1.5, 20);
floorRect.rotation.z = Math.PI / 2;
scene.add(floorRect);

// Ambiant Light
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// Sun
const sun = new THREE.DirectionalLight(0xFFDAB9, 1);
sun.position.set(50, 50, 50);
sun.target.position.set(0, 0, 0);
scene.add(sun);

// Helpers Sun
const helper1 = new THREE.DirectionalLightHelper(sun, 5);
//scene.add(helper1);

// Sea
gltfLoader.load(
  '/portfolio/models/sea/ocean.glb',
  (gltf) => {
    //console.log('Sea loaded', gltf);
    const sea = gltf.scene;
    sea.scale.set(0.026, 0.01, 0.02);
    sea.position.set(0, -3, 25);
    scene.add(sea);
  },
  undefined,
  (error) => {
    console.error('Error loading Sea', error);
  }
);

//Wave
const numberOfWave = 3;
const wavePositions = [
  { x: -20, y: -4.1, z: 25 },
  { x: -18, y: -4.1, z: 30 },
  { x: -16, y: -3.5, z: 35 },
  { x: -17, y: -3.5, z: 40 },
];

const waves = [];

const MAX_DISTANCE = 35;
const SPEED = 0.01;
const VERTICAL_AMPLI = 0.1;

for (let i = 0; i <= numberOfWave; i++) {
  gltfLoader.load(
    '/portfolio/models/sea/wave.glb',
    (gltf) => {
      //console.log('Wave loaded', gltf);
      const wave = gltf.scene;
      wave.scale.set(0.0003, 0.0003, 0.0003);
      wave.position.set(wavePositions[i].x, wavePositions[i].y, wavePositions[i].z);
      scene.add(wave);
      waves.push({
        mesh: wave,
        initialX: wavePositions[i].x,
        initialY: wavePositions[i].y,
        phase: Math.random() * Math.PI * 2,
      });
    },
    undefined,
    (error) => {
      console.error(`Error loading Wave`, error);
    }
  );
}

// Palace
gltfLoader.load(
  '/portfolio/models/monuments/palace.glb',
  (gltf) => {
    //console.log('Palace loaded', gltf);
    const palace = gltf.scene;
    palace.scale.set(0.4, 0.4, 0.4);
    palace.position.set(0, 0, -15);
    scene.add(palace);
  },
  undefined,
  (error) => {
    console.error('Error loading palace', error);
  }
);

// Palace's Statues
gltfLoader.load(
  '/portfolio/models/monuments/statue/ra.glb',
  (gltf) => {
    //console.log('Ra loaded', gltf);
    const ra = gltf.scene;
    ra.scale.set(0.5, 0.5, 0.5);
    ra.position.set(3.5, 0, -8);
    scene.add(ra);
  },
  undefined,
  (error) => {
    console.error('Error loading Ra', error);
  }
);

gltfLoader.load(
  '/portfolio/models/monuments/statue/ra.glb',
  (gltf) => {
    //.log('Ra loaded', gltf);
    const ra = gltf.scene;
    ra.scale.set(0.5, 0.5, 0.5);
    ra.position.set(-3.5, 0, -8);
    scene.add(ra);
  },
  undefined,
  (error) => {
    console.error('Error loading Ra', error);
  }
);

gltfLoader.load(
  '/portfolio/models/monuments/statue/jackal.glb',
  (gltf) => {
    //console.log('Jackal loaded', gltf);
    const jackal = gltf.scene;
    jackal.scale.set(0.4, 0.4, 0.4);
    jackal.position.set(0, 0.8, -15);
    scene.add(jackal);
  },
  undefined,
  (error) => {
    console.error('Error loading Jackal', error);
  }
);

// Obelisk
gltfLoader.load(
  '/portfolio/models/monuments/statue/obelisk.glb',
  (gltf) => {
    //console.log('Obelisk loaded', gltf);
    const obelisk = gltf.scene;
    obelisk.scale.set(0.5, 0.5, 0.5);
    obelisk.position.set(0, 0, 1);
    scene.add(obelisk);
  },
  undefined,
  (error) => {
    console.error('Error loading Obelisk', error);
  }
);

// Pyramid
gltfLoader.load(
  '/portfolio/models/monuments/historic/pyramids.glb',
  (gltf) => {
    //console.log('Pyramid loaded', gltf);
    const pyramid = gltf.scene;
    pyramid.scale.set(0.5, 0.5, 0.5);
    pyramid.position.set(-20, -5, -30);
    scene.add(pyramid);
  },
  undefined,
  (error) => {
    console.error('Error loading pyramid', error);
  }
);

// Sphinx
gltfLoader.load(
  '/portfolio/models/monuments/historic/sphinx.glb',
  (gltf) => {
    //console.log('Sphinx loaded', gltf);
    const sphinx = gltf.scene;
    sphinx.scale.set(0.5, 0.5, 0.5);
    sphinx.position.set(16, 0, -10);
    scene.add(sphinx);
  },
  undefined,
  (error) => {
    console.error('Error loading pyramid', error);
  }
);

// Houses
const numberOfHouses = 12;
const housePositions = [
  { x: -10, y: 0, z: 15 },
  { x: -15, y: 0, z: 15 },
  { x: 5, y: 0, z: 11 },
  { x: 10.3, y: 0, z: 15 },
  { x: -15, y: 0, z: 9 },
  { x: 10, y: 0, z: 4.5 },
  { x: 15, y: 0, z: 10 },
  { x: -11, y: 0, z: 8 },
  { x: -16, y: 0, z: 5 },
  { x: -15, y: 0, z: -1 },
  { x: -16, y: 0, z: -4.5 },
  { x: -10, y: 0, z: -1 },
  { x: -13, y: 0, z: -10 },

];

for (let i = 0; i <= numberOfHouses; i++) {
  gltfLoader.load(
    `/portfolio/models/monuments/house/house${i}.glb`,
    (gltf) => {
      //console.log(`House ${i} loaded`, gltf);
      const house = gltf.scene;
      house.scale.set(0.5, 0.5, 0.5);
      house.position.set(housePositions[i].x, housePositions[i].y, housePositions[i].z);
      scene.add(house);
    },
    undefined,
    (error) => {
      console.error(`Error loading house ${i}`, error);
    }
  );
}

// Tents
const numberOfTent = 1;
const tentPositions = [
  { x: -10, y: 0, z: -17 },
  { x: -15, y: 0, z: -17 },
];

for (let i = 0; i <= numberOfTent; i++) {
  gltfLoader.load(
    `/portfolio/models/monuments/tent.glb`,
    (gltf) => {
      //console.log(`tent loaded`, gltf);
      const tent = gltf.scene;
      tent.scale.set(0.5, 0.5, 0.5);
      tent.position.set(tentPositions[i].x, tentPositions[i].y, tentPositions[i].z);
      scene.add(tent);
    },
    undefined,
    (error) => {
      console.error(`Error loading tent`, error);
    }
  );
}

// Three
const numberOfTrees = 13;
const treePositions = [
  //village's tree
  { x: 18, y: 0, z: 15 },
  { x: -19, y: 0, z: 15 },
  { x: 5, y: 0, z: 9 },
  { x: 13, y: 0, z: 15 },
  { x: -12, y: 0, z: 13 },
  { x: -18, y: 0, z: 1 },
  { x: -19.5, y: 0, z: 3 },
  { x: 15, y: 0, z: 2 },
  { x: 18, y: 0, z: 4 },
  //sphinx's tree
  { x: 10, y: 0, z: -15 },
  { x: 9, y: 0, z: -10 },
  { x: 10, y: 0, z: -5 },
  { x: 11, y: 0, z: -12 },
  { x: 12, y: 0, z: -8 },

];

for (let i = 0; i <= numberOfTrees; i++) {
  gltfLoader.load(
    `/portfolio/models/natural/tree.glb`,
    (gltf) => {
      //console.log(`Tree loaded`, gltf);
      const tree = gltf.scene;
      tree.scale.set(0.3, 0.3, 0.3);
      tree.position.set(treePositions[i].x, treePositions[i].y, treePositions[i].z);
      scene.add(tree);
    },
    undefined,
    (error) => {
      console.error(`Error loading Tree`, error);
    }
  );
}

//Ship's constructions
gltfLoader.load(
  '/portfolio/models/ship/platformFlatShip.glb',
  (gltf) => {
    //console.log('PlatformFlatShip loaded', gltf);
    const platformFlatShip = gltf.scene;
    platformFlatShip.scale.set(0.5, 0.5, 0.5);
    platformFlatShip.position.set(-10, -0.5, 20.8);
    scene.add(platformFlatShip);
  },
  undefined,
  (error) => {
    console.error('Error loading PlatformFlatShip', error);
  }
);

const numberOfShipConstruction = 4;
const ShipConstructionPositions = [
  { x: -8.5, y: -0.5, z: 20.8 },
  { x: -7.2, y: -1, z: 20.8 },
  { x: -5.9, y: -1.5, z: 20.8 },
  { x: -4.6, y: -2, z: 20.8 },
  { x: -3.3, y: -2.5, z: 20.8 },
]

for (let i = 0; i <= numberOfShipConstruction; i++) {
  gltfLoader.load(
    '/portfolio/models/ship/platformLeanShip.glb',
    (gltf) => {
      //console.log('PlatformLeanShip loaded', gltf);
      const platformLeanShip = gltf.scene;
      platformLeanShip.scale.set(0.5, 0.5, 0.5);
      platformLeanShip.position.set(ShipConstructionPositions[i].x, ShipConstructionPositions[i].y, ShipConstructionPositions[i].z);
      scene.add(platformLeanShip);
    },
    undefined,
    (error) => {
      console.error('Error loading PlatformLeanShip', error);
    }
  );
}

//Ship
let ship;
let isShipMoving = false;
let shipInCircle = false;

gltfLoader.load(
  '/portfolio/models/ship/shipPlayer.glb',
  (gltf) => {
    //console.log('Ship loaded', gltf);
    ship = gltf.scene;
    ship.scale.set(0.2, 0.2, 0.2);
    ship.rotation.y = Math.PI / 2;
    ship.position.set(0, -2.5, 30);
    scene.add(ship);
  },
  undefined,
  (error) => {
    console.error('Error loading Ship', error);
  }
);

//Ship Portal
const numberOfPortal = 1;
const portalPositions = [
  { x: -10, y: 0.1, z: 19.5 },
  { x: -2, y: -2.5, z: 20.8 },
]

for (let i = 0; i <= numberOfPortal; i++) {
  const circleMaterialPortal = new THREE.MeshBasicMaterial({
    color: 0x8A2BE2,
    transparent: true,
    opacity: 0.5,
  });
  const circleGeometryPortal = new THREE.CircleGeometry(0.5, 32);
  const circlePortal = new THREE.Mesh(circleGeometryPortal, circleMaterialPortal);
  circlePortal.position.set(portalPositions[i].x, portalPositions[i].y, portalPositions[i].z);
  circlePortal.rotation.x = Math.PI / -2;
  scene.add(circlePortal);
}

//Ship's Circle
const circleMaterialShip = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  transparent: true,
  opacity: 0.5,
});
const circleGeometryShip = new THREE.CircleGeometry(2, 4);
const circleShip = new THREE.Mesh(circleGeometryShip, circleMaterialShip);
circleShip.position.set(0, -2, 30);
circleShip.rotation.x = Math.PI / -2;
//scene.add(circleShip);

// shipBoundaries
const shipBoundaries = {
  minX: -10,
  maxX: 10,
  minZ: 23,
  maxZ: 40,
};

const isWithinShipBoundaries = (position) => {
  return (
    position.x >= shipBoundaries.minX &&
    position.x <= shipBoundaries.maxX &&
    position.z >= shipBoundaries.minZ &&
    position.z <= shipBoundaries.maxZ
  );
};

// Move ship forward
const moveShipForward = () => {
  const newPosition = ship.position.clone();
  newPosition.z -= 0.1;

  if (isWithinShipBoundaries(newPosition)) {
    ship.position.z = newPosition.z;
    circleShip.position.z = newPosition.z;
    camera.position.z = newPosition.z;
  }
};

// Move ship backward
const moveShipBackward = () => {
  const newPosition = ship.position.clone();
  newPosition.z += 0.1;

  if (isWithinShipBoundaries(newPosition)) {
    ship.position.z = newPosition.z;
    circleShip.position.z = newPosition.z;
    camera.position.z = newPosition.z;
  }
};

// Move Ship Left
const moveShipLeft = () => {
  const newPosition = ship.position.clone();
  newPosition.x -= 0.1;

  if (isWithinShipBoundaries(newPosition)) {
    ship.position.x = newPosition.x;
    circleShip.position.x = newPosition.x;
    camera.position.x = newPosition.x;
  }
};

// Move Ship Right
const moveShipRight = () => {
  const newPosition = ship.position.clone();
  newPosition.x += 0.1;

  if (isWithinShipBoundaries(newPosition)) {
    ship.position.x = newPosition.x;
    circleShip.position.x = newPosition.x;
    camera.position.x = newPosition.x;
  }
};


//PNG
const mixers = [];
let pnjAnimationSpeek = null;

const numberOfPnj = 10;
const pnjData = [
  { x: -11.3, y: 0, z: 16.5, rotationY: Math.PI / 5 },
  { x: -10, y: 0, z: 10.5, rotationY: Math.PI / 5 },
  { x: 4, y: 0, z: 9.5, rotationY: Math.PI / -1.5 },
  { x: 6.3, y: 0, z: 13.6, rotationY: Math.PI / 0.52 },
  { x: -10, y: 0, z: 1, rotationY: Math.PI / 5 },
  { x: -13, y: 0, z: -7.7, rotationY: Math.PI / 3 },
  { x: 8.5, y: 0, z: 11, rotationY: Math.PI / 1 },
  { x: 13, y: 0, z: 7, rotationY: Math.PI / -2 },
  { x: 11, y: 0, z: -4, rotationY: Math.PI / 0.6 },
  //
  { x: -3, y: 0, z: -6, rotationY: Math.PI / 0.5 },
  { x: 0, y: 0.63, z: -9.6, rotationY: 0 },

];

const pnjModels = [
  '/portfolio/models/man/femalePnj.glb',
  '/portfolio/models/man/malePnj.glb',
  '/portfolio/models/man/malePnj.glb',
  '/portfolio/models/man/femalePnj.glb',
  '/portfolio/models/man/malePnj.glb',
  '/portfolio/models/man/femalePnj.glb',
  '/portfolio/models/man/malePnj.glb',
  '/portfolio/models/man/femalePnj.glb',
  '/portfolio/models/man/malePnj.glb',
  //
  '/portfolio/models/man/soldierPnj.glb',
  '/portfolio/models/man/pharaonPnj.glb',

];

for (let i = 0; i <= numberOfPnj; i++) {
  gltfLoader.load(
    pnjModels[i],
    (gltf) => {
      console.log('PNJ loaded', gltf);
      const pnj = gltf.scene;
      pnj.scale.set(0.5, 0.5, 0.5);
      pnj.rotation.y = pnjData[i].rotationY;
      pnj.position.set(pnjData[i].x, pnjData[i].y, pnjData[i].z);
      scene.add(pnj);

      const mixer = new THREE.AnimationMixer(pnj);
      const pnjAnimationIdle = mixer.clipAction(gltf.animations[0]);
      //const pnjAnimationSpeek = mixer.clipAction(gltf.animations[1]);

      pnjAnimationIdle.play();
      mixers.push(mixer);
    },
    undefined,
    (error) => {
      console.error('Error loading PNJ', error);
    }
  );
}

// Circle 
const circles = [
  {
    position: { x: -10.7, y: 0.01, z: 17.4 },
    message: 'Mon premier projet en première: Une version de street fighter codé en python.</br></br>Lien: <a href="https://github.com/SixteMorio/street-fighter" target="_blank">https://github.com/SixteMorio/street-fighter</a></br></br><img src="imgProject/streetFighter.png" alt="img de jeu" style="width: 200px; height: auto;"/>'
  },
  {
    position: { x: -9.4, y: 0.01, z: 11.4 },
    message: 'Une version de Twitter, mainteant X, codé en html/css/php.</br></br>Lien: <a href="https://github.com/SixteMorio/projetTwitter" target="_blank">https://github.com/SixteMorio/projetTwitter</a></br>'
  },
  {
    position: { x: 3, y: 0.01, z: 9 },
    message: 'Un site vitrine utilisant une API.</br></br>Lien: <a href="https://smoriodelisle.esd-monsite.fr/mario/index.html" target="_blank">https://smoriodelisle.esd-monsite.fr/mario/index.html</a></br></br><img src="imgProject/mario.png" alt="img de jeu" style="width: 400px; height: auto;"/>'
  },
  {
    position: { x: 6, y: 0.01, z: 14.5 },
    message: 'Une version de flappy beard en Js.</br></br>Lien: <a href="https://smoriodelisle.esd-monsite.fr/flappyBird/index.html" target="_blank">https://smoriodelisle.esd-monsite.fr/flappyBird/index.html</a></br></br><img src="imgProject/flappyBird.png" alt="img de jeu" style="width: 400px; height: auto;"/>'
  },
  {
    position: { x: -9.4, y: 0.01, z: 2 },
    message: 'Un site utilisant une IA pour en faire un planificateur de Voyage.</br></br>Lien: - <a href="https://github.com/SixteMorio/tripPlaneur-back" target="_blank">https://github.com/SixteMorio/tripPlaneur-back</a></br>- <a href="https://github.com/SixteMorio/tripPlaneur-front" target="_blank">https://github.com/SixteMorio/tripPlaneur-front</a></br></br><img src="imgProject/tripPlaneurPrimary.png" alt="img du site" style="width: auto; height: 400px;"/><img src="imgProject/tripPlaneurSecondary.png" alt="img du site" style="width: auto; height: 400px;"/>'
  },
  {
    position: { x: -12, y: 0.01, z: -7 },
    message: 'Un projet pour découvrir le fonctionnement des Draw web sockets.</br></br>Lien: <a href="https://github.com/SixteMorio/Draw-Web-Socket" target="_blank">https://github.com/SixteMorio/Draw-Web-Socket</a></br></br><img src="imgProject/draw.png" alt="img de jeu" style="width: 400px; height: auto;"/>'
  },
  {
    position: { x: 8.5, y: 0.01, z: 10 },
    message: 'Un mini projet pour voir comment 3js fonctionne.</br></br>Lien: <a href="https://smoriodelisle.esd-monsite.fr/cube3js/index.html" target="_blank">https://smoriodelisle.esd-monsite.fr/cube3js/index.html</a></br></br><img src="imgProject/cubeThreeJs.png" alt="img de jeu" style="width: 400px; height: auto;"/>'
  },
  {
    position: { x: 12, y: 0.01, z: 7 },
    message: 'Lettre de motivation en 3Js faite en une soirée alors que je ne connaissais presque rien pour postuler à votre offre de stage.</br></br>Lien: <a href="https://github.com/SixteMorio/lettreMotivation/tree/main/Three.js%20Map%20Interaction" target="_blank">https://github.com/SixteMorio/lettreMotivation/tree/main/Three.js%20Map%20Interaction</a></br></br><img src="imgProject/tRex.png" alt="img de jeu" style="width: 400px; height: auto;"/>'
  },
  {
    position: { x: 10, y: 0.01, z: -3 },
    message: 'Pour découvrir plus 3Js afin de postuler chez vous je décide donc de faire un projet qui à pour but de me faire découvir un effet de jour et de nuit sur un glb qui à été modélisé avec unreal engine(mauvaise importation de la mer)</br></br>Lien: <a href="https://smoriodelisle.esd-monsite.fr/viking/index.html" target="_blank">https://smoriodelisle.esd-monsite.fr/viking/index.html</a></br></br><img src="imgProject/vikingIsland.png" alt="img de jeu" style="width: 400px; height: auto;"/>'
  },
  //
  {
    position: { x: -3, y: 0.01, z: -5 },
    message: 'Voici son CV.</br>Cliquez pour <a href="/cv/cv.pdf" target="_blank">ouvrir le CV</a>.'
  },
  {
    position: { x: 0, y: 0.57, z: -8.5 },
    message: `Bravo vous avez fini !</br>Ceci étant quelques projets je serais ravi de vous rencontrez afin d'en discuter où de vous en présentez d'autres !</br></br>Voir le code:</br>  - <a href="https://github.com/SixteMorio/portfolio" target="_blank">https://github.com/SixteMorio/portfolio</a></br></br></br>Copyright </br> - Wave by Poly by Google [CC - BY](<https://creativecommons.org/licenses/by/3.0/>) via Poly Pizza (<https://poly.pizza/m/6mpwUZqCgzy>)</br> - Ocean by Poly by Google [CC- BY](<https://creativecommons.org/licenses/by/3.0/>) via Poly Pizza (<https://poly.pizza/m/faUostvShTI>)`
  }
];

for (let i = 0; i < circles.length; i++) {
  const circleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.5,
  });
  const circleGeometry = new THREE.CircleGeometry(0.5, 32);
  const circle = new THREE.Mesh(circleGeometry, circleMaterial);
  circle.position.set(circles[i].position.x, circles[i].position.y, circles[i].position.z);
  circle.rotation.x = Math.PI / -2;
  scene.add(circle);
  circles[i].object = circle;
};

const distance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) +
    Math.pow(point2.y - point1.y, 2) +
    Math.pow(point2.z - point1.z, 2)
  );
};

const checkCameraInCircle = () => {
  const cameraPosition = controls.getObject().position;
  const circleRadius = 1.1;

  for (let i = 0; i < circles.length; i++) {
    const circlePosition = circles[i].position;
    const distanceToCircle = distance(cameraPosition, circlePosition);
    if (distanceToCircle < circleRadius) {
      const message = circles[i].message;
      return message;
    };
  };
  return null;
};

const checkCameraInPortal = () => {
  const cameraPosition = controls.getObject().position;
  const circleRadius = 1.1;

  for (let i = 0; i < portalPositions.length; i++) {
    const portalPosition = portalPositions[i];
    const distanceToPortal = distance(cameraPosition, portalPosition);
    if (distanceToPortal < circleRadius) {
      return i;
    }
  }
  return null;
};

const checkCameraInCircleShip = () => {
  const cameraPosition = controls.getObject().position;
  const circleRadiusShip = 1.6;
  const circlePositionShip = circleShip.position;
  const distanceToCircleShip = distance(cameraPosition, circlePositionShip);
  if (distanceToCircleShip < circleRadiusShip) {
    console.log("true");
    return circleShip;
  } else {
    return null;
  }
};

//oneTeleportation's Function
let hasTeleported = false;

const teleportIfInPortal = () => {
  if (!hasTeleported) {
    const portalIndex = checkCameraInPortal();
    if (portalIndex !== null) {
      const otherPortalIndex = (portalIndex === 0) ? 1 : 0;
      const otherPortalPosition = portalPositions[otherPortalIndex];
      controls.getObject().position.set(
        otherPortalPosition.x,
        1,
        otherPortalPosition.z
      );

      hasTeleported = true;

      boundaries.minZ = -10;
      boundaries.maxZ = 20;

    }
  }
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, -1.5, 30);
scene.add(camera);

// Controls
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener("click", () => {
  controls.lock();
});

//Boundaries
const boundaries = {
  minX: -18,
  maxX: 18,
  minY: -2,
  maxY: 1.5,
  minZ: 20,
  maxZ: 35,
};

const isWithinBoundaries = (position) => {
  return (
    position.x >= boundaries.minX &&
    position.x <= boundaries.maxX &&
    position.y >= boundaries.minY &&
    position.y <= boundaries.maxY &&
    position.z >= boundaries.minZ &&
    position.z <= boundaries.maxZ
  );
};

// Move
const moveForward = () => {
  controls.moveForward(0.1);
  if (!isWithinBoundaries(camera.position)) {
    controls.moveForward(-0.1);
  }
};

const moveBackward = () => {
  controls.moveForward(-0.1);
  if (!isWithinBoundaries(camera.position)) {
    controls.moveForward(0.1);
  }
};

const moveLeft = () => {
  controls.moveRight(-0.1);
  if (!isWithinBoundaries(camera.position)) {
    controls.moveRight(0.1);
  }
};

const moveRight = () => {
  controls.moveRight(0.1);
  if (!isWithinBoundaries(camera.position)) {
    controls.moveRight(-0.1);
  }
};

document.addEventListener("keydown", (event) => {

  switch (event.key) {
    case "z":
      closePopup()
      if (checkCameraInCircleShip() && isShipMoving) {
        moveForward();
        moveShipForward();
      } else {
        moveForward();
      }
      break;
    case "s":
      closePopup()
      if (checkCameraInCircleShip() && isShipMoving) {
        moveBackward();
        moveShipBackward();
      } else {
        moveBackward();
      }
      break;
    case "q":
      closePopup()
      if (checkCameraInCircleShip() && isShipMoving) {
        moveShipLeft();
        moveLeft();
      } else {
        moveLeft();
      }
      break;
    case "d":
      closePopup()
      if (checkCameraInCircleShip() && isShipMoving) {
        moveShipRight();
        moveRight();
      } else {
        moveRight();
      }
      break;
    case "e":
      if (checkCameraInCircleShip()) {
        shipInCircle = !shipInCircle;
        isShipMoving = shipInCircle;
        console.log(isShipMoving ? "is good" : "isn't good");
      }

      teleportIfInPortal();

      const message = checkCameraInCircle();
      if (message) {
        document.getElementById("popup").style.display = "flex";
        document.getElementById("popup-message").innerHTML = message;
        document.addEventListener("click", closePopup);
      }
      break;
    default:
      break;
  }
});

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const animate = () => {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  mixers.forEach((mixer) => mixer.update(delta));

  // Update waves position
  waves.forEach((wave, index) => {
    // Horizontal movement
    wave.mesh.position.x += SPEED;
    if (wave.mesh.position.x > wave.initialX + MAX_DISTANCE) {
      wave.mesh.position.x = wave.initialX;
    }

    // Vertical movement
    wave.mesh.position.y = wave.initialY + Math.sin(Date.now() * 0.001 + wave.phase) * VERTICAL_AMPLI;
  });

  renderer.render(scene, camera);
};

animate();
