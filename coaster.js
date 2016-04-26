var renderer;
var basicCamera;
var splineCamera;
var controls;
var scene = new THREE.Scene();

var trackPoints = [];
priceList = getPriceListFromFile("prices/prices_SUNE_weekly.txt");
lastPointX = 0;

// Add actual coaster points
for (i = 0; i < priceList.length; i++) {
  pricePoint = new THREE.Vector3(lastPointX, priceList[i]*20, 45)
  trackPoints.push(pricePoint);
  lastPointX += 35;
}

// Coaster spline and settings
var trackSpline =  new THREE.CatmullRomCurve3(trackPoints);
var extrudeSettings = {extrudePath: trackSpline, steps: 2000}; // amount, curveSegments

// Track base
basePoints = [];
for (i = 0; i < trackPoints.length; i++) {
  vector = trackPoints[i];
  basePoints.push(new THREE.Vector3(vector.x, 0, vector.z));
}
baseSpline =  new THREE.CatmullRomCurve3(basePoints);
baseExtrudeSettings = {extrudePath: baseSpline, steps: 200, bevelEnabled: false};
baseShape = new THREE.Shape([new THREE.Vector2(50.0, 0.0), new THREE.Vector2(50.0, 15.0), new THREE.Vector2(-50, 15.0),new THREE.Vector2(-50.0, 0.0)]);
var baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
baseGeometry.translate(0, 0, -10);
addToScene(baseGeometry, "phong", {color: 0x0051c1});

// Green and red pipes
pipeShape = new THREE.Shape();
pipeShape.absarc( 0, -5, 5, 0, 2 * Math.PI, false );
pipeGreenGeometry = new THREE.ExtrudeGeometry(pipeShape, extrudeSettings);
pipeGreenGeometry.translate(0, 0, 20);
addToScene(pipeGreenGeometry, "phong", {color: 0x41c100})

pipeRedGeometry = new THREE.ExtrudeGeometry(pipeShape, extrudeSettings);
pipeRedGeometry.translate(0, 0, -60);
addToScene(pipeRedGeometry, "phong", {color: 0xc10000})

// Legs from base to pipes
var baseCounter = 10;
var pipeCounter = 10;
var baseVertices = baseGeometry.vertices;
var pipeVertices = pipeGreenGeometry.vertices;
var pipeVertices2 = pipeRedGeometry.vertices;

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

function loadCamerasAndControls() {
  // Rendering
  renderer = new THREE.WebGLRenderer({alpha:true});
  renderer.setClearColor( 0xffffff, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Cameras
  basicCamera = new THREE.PerspectiveCamera(120,window.innerWidth/window.innerHeight, 0.1, 1000);
  basicCamera.position.set(2000,300,800);
  scene.add(basicCamera)

  parentCamera = new THREE.Object3D();
  parentCamera.position.set(0,0,0);
  //parentCamera.rotation.x = 90 * Math.PI / 180
  //parentCamera.position.y = 100;
  scene.add(parentCamera);

  cameraEye = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
  parentCamera.add(cameraEye);

  splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
  //splineCamera.rotation.x = 90 * Math.PI / 180
  //splineCamera.position.set(0,0,0);
  parentCamera.add(splineCamera);

  controls = new THREE.OrbitControls(basicCamera, renderer.domElement);
  controls.autoRotate = false;
  controls.enableZoom = true;
}

function loadLight() {
  scene.add(new THREE.AmbientLight(0x222222));
  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set( 0, 1, 0 );
  //light.position.copy( splineCamera.position );
  scene.add(directionalLight );
}

function loadCompanyDetails() {
  // Company logo
  var logoLoader = new THREE.TextureLoader();
  logoLoader.load('images/sune-logo.png', function ( logoTexture ) {
    var logoPlane = new THREE.PlaneGeometry(334, 97);
    logoPlane.translate(0,430,500);
    addToScene(logoPlane, "basic", {map: logoTexture}, -1*Math.PI/2)
    }
  );

  // Company description
  var fontLoader = new THREE.FontLoader();
  fontLoader.load('three/optimer_regular.typeface.js', function ( font ) {
    var textGeometry = new THREE.TextGeometry("SunEdison (NYSE:SUNE) is a global renewable energy development company", {font: font, size: 20, height: 5});
    var textGeometry2 = new THREE.TextGeometry("based in Maryland Heights, MO that develops and operates solar power plants.", {font: font, size: 20, height: 5});
    textGeometry.translate(-450,350,400);
    textGeometry2.translate(-450,320,400);
    addToScene(textGeometry, "basic", {color:0xff8000}, -1*Math.PI/2);
    addToScene(textGeometry2, "basic", {color:0xff8000}, -1*Math.PI/2);
  } );
}

// For rendering
var scale = 1;
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

var lookAhead = false;

function animate() {
  requestAnimationFrame( animate );
  render();
  controls.update();
}

// var trackSpline =  new THREE.CatmullRomCurve3(trackPoints);
// var extrudeSettings = {extrudePath: trackSpline, steps: 2000}; // amount, curveSegments


// From: https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_splines.html
function render() {
    // Try Animate Camera Along Spline
    time = Date.now();
    looptime = 35 * 1000; // Orig 20
    t = ( time % looptime ) / looptime;

    position = trackSpline.getPointAt(t)
    splineCamera.position.copy(position);
    splineCamera.rotation.y = 270 * Math.PI/180;


    direction = new THREE.Vector3(0,0,0);
    for (i = 0; i < 5; i++) {
      direction.add(trackSpline.getPointAt(t+.01*i));      // divide by t+1, t+ 2 average
    }
    direction.divideScalar(5);

    tangent = trackSpline.getTangentAt(t);

    direction.add(tangent)
    splineCamera.lookAt(direction);

    renderer.render(scene, splineCamera);
};

loadCamerasAndControls();
loadLight();
loadCompanyDetails();
animate();
