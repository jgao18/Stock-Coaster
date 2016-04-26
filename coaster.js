var renderer;
var basicCamera;
var splineCamera;
var controls;
var scene = new THREE.Scene();
var baseGeometry;
var sceneCube = new THREE.Scene();

var trackPoints = [];
priceList = getPriceListFromFile("prices/prices_SUNE_weekly.txt");
lastPointX = 0;
xIncrement = 35;

// Add straight line path to read company info
for (i = 40; i > 1; i--) {
  fartherPoint = new THREE.Vector3(-1 * i * xIncrement, priceList[0]*20, 45);
  trackPoints.push(fartherPoint);
}

// Add actual coaster points
for (i = 0; i < priceList.length; i++) {
  pricePoint = new THREE.Vector3(lastPointX, priceList[i]*20, 45)
  trackPoints.push(pricePoint);
  lastPointX += xIncrement;
}

// Coaster spline and settings
var trackSpline =  new THREE.CatmullRomCurve3(trackPoints);
var extrudeSettings = {extrudePath: trackSpline, steps: 2000}; // amount, curveSegments

function loadCoaster() {
  // Track base
  basePoints = [];
  for (i = 0; i < trackPoints.length; i++) {
    vector = trackPoints[i];
    basePoints.push(new THREE.Vector3(vector.x, 0, vector.z));
  }
  baseSpline =  new THREE.CatmullRomCurve3(basePoints);
  baseExtrudeSettings = {extrudePath: baseSpline, steps: 200, bevelEnabled: false};
  baseShape = new THREE.Shape([new THREE.Vector2(900.0, 0.0), new THREE.Vector2(900.0, 15.0), new THREE.Vector2(-900, 15.0),new THREE.Vector2(-900.0, 0.0)]);
  baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
  baseGeometry.translate(0, 0, -10);

  baseMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  materialLoader = new THREE.TextureLoader();
  materialLoader.load('/images/dirt.jpg', function ( texture ) {
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		baseMaterial.map = texture;
		baseMaterial.needsUpdate = true;
	});
  scene.add(new THREE.Mesh(baseGeometry, baseMaterial));

  // Green and red pipes
  pipeShape = new THREE.Shape();
  pipeShape.absarc( 0, -5, 5, 0, 2 * Math.PI, false );
  pipeGreenGeometry = new THREE.ExtrudeGeometry(pipeShape, extrudeSettings);
  pipeGreenGeometry.translate(0, 0, 10);
  addToScene(pipeGreenGeometry, "phong", {color: 0x41c100})

  pipeRedGeometry = new THREE.ExtrudeGeometry(pipeShape, extrudeSettings);
  pipeRedGeometry.translate(0, 0, -10);
  addToScene(pipeRedGeometry, "phong", {color: 0xc10000})
}

function loadCart() {
  colladaLoader = new THREE.ColladaLoader();
  cartObject = new THREE.Object3D();
  colladaLoader.load("/model/cart.dae", function (collada) {
    cartObject.add(collada.scene)
  })
  cartObject.scale = new THREE.Vector3(50,0,0);
  scene.add(cartObject);
}

// Legs from base to pipes
/*var baseCounter = 10;
var pipeCounter = 10;
//var baseVertices = baseGeometry.vertices;
//var pipeVertices = pipeGreenGeometry.vertices;
//var pipeVertices2 = pipeRedGeometry.vertices;

console.log(baseVertices.length);
console.log(pipeVertices.length);

console.log(baseVertices[0]);
console.log(pipeVertices[0]);

while (baseCounter < baseVertices.length && pipeCounter < pipeVertices.length) {
  //console.log(baseCounter);
  //console.log(pipeCounter);

  baseVertex = baseVertices[baseCounter];
  pipeVertex = pipeVertices[pipeCounter];
  pipeVertex2 = pipeVertices2[pipeCounter];

  legHeight = pipeVertex.y - baseVertex.y
  //console.log(legHeight);

  legGeometry = new THREE.CylinderGeometry(2,2,legHeight,32);
  legGeometry.translate(baseVertex.x,0,0);
  legGeometry.lookAt(pipeVertex);

  //legGeometry.translate(baseVertex.x, baseVertex.y, baseVertex.z);

  legMaterial = new THREE.MeshPhongMaterial({color: 0x0051c1});
  legMesh = new THREE.Mesh(legGeometry, legMaterial);
  //legMesh.position = baseVertex;

  //scene.add(legMesh);

  var material = new THREE.LineBasicMaterial({
	   color: 0xb000ff,
     //linewidth: 30
  });

  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    baseVertex, pipeVertex
  );
  var geometry2 = new THREE.Geometry();
  geometry.vertices.push(
    baseVertex, pipeVertex2
  );

  var line = new THREE.Line( geometry, material );
  var line2 = new THREE.Line( geometry2, material );
  //scene.add(line);
  //  scene.add(line2)

  baseCounter += 10;
  pipeCounter += 40;
}*/

function loadCamerasAndControls() {
  // Rendering
  renderer = new THREE.WebGLRenderer({alpha:true});
  renderer.setClearColor( 0x87CEFA, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Cameras
  basicCamera = new THREE.PerspectiveCamera(120,window.innerWidth/window.innerHeight, 0.1, 1000);
  basicCamera.position.set(2000,300,800);
  scene.add(basicCamera)

  splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );

  controls = new THREE.OrbitControls(basicCamera, renderer.domElement);
  controls.autoRotate = false;
  controls.enableZoom = true;
}

function loadLight() {
  scene.add(new THREE.AmbientLight(0x222222));
  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set( 0, 2, 0 );
  scene.add(directionalLight );
  //scene.add(new THREE.HemisphereLight(0xffffbb, 0xffffff, 1))
}

function loadCompanyDetails() {
  // Company logo
  logoLoader = new THREE.TextureLoader();
  logoLoader.load('images/sune-logo.png', function ( logoTexture ) {
    logoPlane = new THREE.PlaneGeometry(334, 97);
    logoPlane.translate(0,430,500);
    addToScene(logoPlane, "basic", {map: logoTexture, transparent: true}, -1*Math.PI/2)
    }
  );

  // Company description
  fontLoader = new THREE.FontLoader();
  fontLoader.load('three/optimer_regular.typeface.js', function ( font ) {
    textGeometry = new THREE.TextGeometry("SunEdison (NYSE:SUNE) is a global renewable energy development company", {font: font, size: 20, height: 5});
    textGeometry2 = new THREE.TextGeometry("based in Maryland Heights, MO that develops and operates solar power plants", {font: font, size: 20, height: 5});
    textGeometry.translate(-450,350,500);
    textGeometry2.translate(-450,320,500);
    addToScene(textGeometry, "basic", {color:0xff8000}, -1*Math.PI/2);
    addToScene(textGeometry2, "basic", {color:0xff8000}, -1*Math.PI/2);
  } );
}

function addToScene(geometry, materialType, materialSettings, meshRotationAngle) {
  if (materialType == "phong")
    material = new THREE.MeshPhongMaterial(materialSettings);
  else
    material = new THREE.MeshBasicMaterial(materialSettings);

  mesh = new THREE.Mesh(geometry, material);
  meshRotationAngle = meshRotationAngle || 0;
  if (meshRotationAngle != 0)
    mesh.rotateY(meshRotationAngle);
  scene.add(mesh);
}

function animate() {
  requestAnimationFrame( animate );
  render();
  controls.update();
}

function render() {
    time = Date.now();
    looptime = 95 * 1000; // speed
    t = ( time % looptime ) / looptime;

    position = trackSpline.getPointAt(t)

    cartObject.position.copy(position);
    cartObject.position.x -= 1.1;

    splineCamera.position.copy(position);
    splineCamera.position.y += 2;
    splineCamera.rotation.y = 270 * Math.PI/180;

    direction = new THREE.Vector3(0,0,0);
    for (i = 0; i < 3; i++) {
      aheadPoint = t + (.01*i);
      if (aheadPoint > 1 )  // prevent out of bounds
        aheadPoint = 1;
      direction.add(trackSpline.getPointAt(aheadPoint));      // divide by t+1, t+ 2 average
    }
    direction.divideScalar(3);
    tangent = trackSpline.getTangentAt(t);
    direction.add(tangent)
    splineCamera.lookAt(direction);
    cartObject.lookAt(direction);
    cartObject.rotateOnAxis(new THREE.Vector3(0,1,0), -90 * Math.PI/180)

    renderer.render(scene, splineCamera);
    //renderer.render(scene, basicCamera);
};

loadCoaster();
loadCart();
loadCamerasAndControls();
loadLight();
loadCompanyDetails();
animate();
