//https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_shapes.html
//https://d2t1xqejof9utc.cloudfront.net/screenshots/pics/c2f91cdcf62d38f93ad0ad4d424f523f/large.jpg
var scene = new THREE.Scene();

var trackPoints = [];
trackPoints.push(new THREE.Vector3 (-1485, 45,  45),new THREE.Vector3 (-435, 45,  45), new THREE.Vector3 (-385, 45,  45), new THREE.Vector3 (-305, 45,  45), new THREE.Vector3 (-225, 45,  45), new THREE.Vector3 ( -175,  -44.23,  45), new THREE.Vector3 ( -125,  -43.04,  45), new THREE.Vector3 ( -75,  39.659237323043598,  45), new THREE.Vector3 ( -25,  -2.652036841750376,  45), new THREE.Vector3 ( 25,  -2.727215377120153,  45), new THREE.Vector3 ( 75,  -49.844181377245455,  45), new THREE.Vector3 ( 125,  41.673702991662715,  45), new THREE.Vector3 ( 175,  49.673702991662715, 45), new THREE.Vector3(225,-28.49983697098302, 45));

// Coaster spline and settings
var trackSpline =  new THREE.CatmullRomCurve3(trackPoints);
var extrudeSettings = { extrudePath: trackSpline, steps: 200, bevelEnabled : false};

// Track base
var basePoints = [new THREE.Vector2(50.0,0.0), new THREE.Vector2(50.0,15.0), new THREE.Vector2(-50,15.0),new THREE.Vector2(-50.0,0.0)];

var baseShape = new THREE.Shape(basePoints);

basePoints = [];
for (i = 0; i < trackPoints.length; i++) {
  var vector = trackPoints[i];
  basePoints.push(new THREE.Vector3(vector.x, 0, vector.z));
}
var baseSpline =  new THREE.CatmullRomCurve3(basePoints);
var baseExtrudeSettings = { extrudePath: baseSpline, steps: 200, bevelEnabled : false};

var baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
baseGeometry.translate(0,-120,-10);

var baseMaterial = new THREE.MeshPhongMaterial({color: 0x0051c1, wireframe: false});

var baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(baseMesh);

// Invisible tube to ride along
var tubeGeometry = new THREE.TubeGeometry(trackSpline, 100, 1, 1, closed=false);
var tubeMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
var tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
scene.add(tubeMesh);

// Green Pipe
var pipeShape = new THREE.Shape();

pipeShape.absarc( 0, -5, 5, 0, 2 * Math.PI, false );
var pipeGeometry = new THREE.ExtrudeGeometry( pipeShape, extrudeSettings );
pipeGeometry.translate(0, 0,20);

var pipeMaterial = new THREE.MeshPhongMaterial( { color: 0x41c100, wireframe: false } );
var pipeMesh = new THREE.Mesh( pipeGeometry, pipeMaterial );
scene.add(pipeMesh);

// Red Pipe
var pipeShape2 = new THREE.Shape();

pipeShape2.absarc( 0, -5, 5, 0, 2 * Math.PI, false );
var pipeGeometry2 = new THREE.ExtrudeGeometry( pipeShape2, extrudeSettings );
pipeGeometry2.translate(0,0,-40);

var pipeMaterial2 = new THREE.MeshPhongMaterial( { color: 0xc10000, wireframe: false } );
var pipeMesh2 = new THREE.Mesh( pipeGeometry2, pipeMaterial2 );
scene.add(pipeMesh2);

var baseCounter = 10;
var pipeCounter = 10;
var baseVertices = baseGeometry.vertices;
var pipeVertices = pipeGeometry.vertices;
var pipeVertices2 = pipeGeometry2.vertices;

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
     linewidth: 30
  });

  console.log(pipeVertex.x);
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
  scene.add(line);
  //  scene.add(line2)

  baseCounter += 10;
  pipeCounter += 40;
}

// Company logo
var logoLoader = new THREE.TextureLoader();
logoLoader.load(
  'sune-logo.png',
  function ( logoTexture ) {
    var logoMaterial = new THREE.MeshBasicMaterial( {
      map: logoTexture
    });
    var logoPlane = new THREE.PlaneGeometry(334, 97);
    logoPlane.translate(0,180,400);
    var logoMesh = new THREE.Mesh(logoPlane,logoMaterial);
    logoMesh.rotateY(-1* Math.PI/2);
    scene.add(logoMesh);

  }
);

// Company text
var loader = new THREE.FontLoader();
loader.load( 'optimer_regular.typeface.js', function ( font ) {
  var textGeometry = new THREE.TextGeometry("SunEdison (NYSE:SUNE) is a global renewable energy development company", {font:font, size:20, height:5});
  var textGeometry2 = new THREE.TextGeometry("based in Maryland Heights, MO that develops and operates solar power plants.", {font:font, size:20, height:5});
  textGeometry.translate(-450,100,400);
  textGeometry2.translate(-450,70,400);
  var textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({color:0xff8000}));
  var textMesh2 = new THREE.Mesh(textGeometry2, new THREE.MeshBasicMaterial({color:0xff8000}));
  textMesh.rotateY(-1*Math.PI/2);
  textMesh2.rotateY(-1*Math.PI/2);
  scene.add(textMesh);
  scene.add(textMesh2);
} );

// Rendering
var renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setClearColor( 0xffffff, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera and controls
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(300,0,300);

cameraParent = new THREE.Object3D();
cameraParent.position.set(0,0,0);
//cameraParent.rotation.x = 90 * Math.PI / 180
//cameraParent.position.y = 100;
scene.add( cameraParent );

var splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
//splineCamera.rotation.x = 90 * Math.PI / 180
//splineCamera.position.set(0,0,0);
cameraParent.add(splineCamera);


// Lighting
scene.add( new THREE.AmbientLight( 0x222222 ) );
var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 1, 0 );
//light.position.copy( splineCamera.position );
scene.add( light );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
controls.enableZoom = true;

// For render
var scale = 1;
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

// Remove later
var cameraEye = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
cameraParent.add( cameraEye );

var lookAhead = false;

function animate() {
  requestAnimationFrame( animate );
  render();
  controls.update();
}

// From: https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_splines.html
function render() {
    // Try Animate Camera Along Spline
    var time = Date.now();
    var looptime = 20 * 1000;
    var t = ( time % looptime ) / looptime;
    var pos = tubeGeometry.parameters.path.getPointAt( t );
    pos.multiplyScalar( scale );
    // interpolation
    var segments = tubeGeometry.tangents.length;
    var pickt = t * segments;
    var pick = Math.floor( pickt );
    var pickNext = ( pick + 1 ) % segments;
    binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
    binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );
    var dir = tubeGeometry.parameters.path.getTangentAt( t );
    var offset = 15;
    normal.copy( binormal ).cross( dir );
    // We move on a offset on its binormal
    pos.add( normal.clone().multiplyScalar( offset ) );
    splineCamera.position.copy( pos );
    cameraEye.position.copy( pos );
    // Camera Orientation 1 - default look at
    // splineCamera.lookAt( lookAt );
    // Using arclength for stablization in look ahead.
    var lookAt = tubeGeometry.parameters.path.getPointAt( ( t + 30 / tubeGeometry.parameters.path.getLength() ) % 1 ).multiplyScalar( scale );

    // Camera Orientation 2 - up orientation via normal
    //if (!lookAhead)
    //lookAt.copy( pos ).add( dir );

    splineCamera.matrix.lookAt(splineCamera.position, lookAt, new THREE.Vector3(0,1,0));

    //makeRotationY(270* Math.PI/180)
    //splineCamera.matrix.makeRotationY(270 * Math.PI/180);
    splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );

    //cameraParent.rotation.y += ( 0 - cameraParent.rotation.y ) * 0.05;
    //renderer.render(scene, splineCamera);
    renderer.render(scene, camera);
};

//scene.add(new THREE.AxisHelper(200));
animate();
