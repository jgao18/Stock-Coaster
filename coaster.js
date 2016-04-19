//https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_shapes.html
//https://d2t1xqejof9utc.cloudfront.net/screenshots/pics/c2f91cdcf62d38f93ad0ad4d424f523f/large.jpg
var scene = new THREE.Scene();

var pipeSpline = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 10, -10), new THREE.Vector3(10, 0, -10), new THREE.Vector3(20, 0, 0), new THREE.Vector3(30, 0, 10), new THREE.Vector3(30, 0, 20), new THREE.Vector3(20, 0, 30), new THREE.Vector3(10, 0, 30), new THREE.Vector3(0, 0, 30), new THREE.Vector3(-10, 10, 30), new THREE.Vector3(-10, 20, 30), new THREE.Vector3(0, 30, 30), new THREE.Vector3(10, 30, 30), new THREE.Vector3(20, 30, 15), new THREE.Vector3(10, 30, 10), new THREE.Vector3(0, 30, 10), new THREE.Vector3(-10, 20, 10), new THREE.Vector3(-10, 10, 10), new THREE.Vector3(0, 0, 10), new THREE.Vector3(10, -10, 10), new THREE.Vector3(20, -15, 10), new THREE.Vector3(30, -15, 10), new THREE.Vector3(40, -15, 10), new THREE.Vector3(50, -15, 10), new THREE.Vector3(60, 0, 10), new THREE.Vector3(70, 0, 0), new THREE.Vector3(80, 0, 0), new THREE.Vector3(90, 0, 0), new THREE.Vector3(100, 0, 0)]);
  
var tube = new THREE.TubeGeometry(extrudePath = pipeSpline, segments = 100, radius = 2, radiusSegments = 3, closed = false);

var meshL = new THREE.MeshLambertMaterial({color: 0xff00ff});
var meshB = new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.3, wireframe: true, transparent: true });
tubeMesh = THREE.SceneUtils.createMultiMaterialObject(tube, [meshL, meshB]);

tubeMesh.scale.set( 4,4,4 );

//scene.add(tubeMesh);

var pts = [], numPts = 5;
for ( var i = 0; i < numPts * 2; i ++ ) {
	var l = i % 2 == 1 ? 10 : 20;
	var a = i / numPts * Math.PI;
	var v2 = new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l );
	pts.push( v2);
	//console.log(v2);
}

var slidePoints = [new THREE.Vector2(20.0,0.0), new THREE.Vector2(20.0,20.0), new THREE.Vector2(16.0,20.0), new THREE.Vector2(16.0,4.0), new THREE.Vector2(-16.0,4.0), new THREE.Vector2(-16.0,20.0), new THREE.Vector2(-20.0,20.0),new THREE.Vector2(-20.0,0.0)];


var shape = new THREE.Shape( slidePoints );

var coreCircleShape = new THREE.Shape();
coreCircleShape.moveTo(0,0);
coreCircleShape.lineTo(4,0);
coreCircleShape.lineTo(4,-8);
coreCircleShape.lineTo(-4,-8);
coreCircleShape.lineTo(-4,0);


var randomPoints = [];
for ( var i = 0; i < 10; i ++ ) {
	var x = new THREE.Vector3( ( i - 4.5 ) * 50, THREE.Math.randFloat( - 50, 50 ), THREE.Math.randFloat( - 50, 50 ) );
	//console.log(x);
	randomPoints.push( x );
	
}

var fixedPoints = [];
fixedPoints.push( new THREE.Vector3 (-225, 45.87,  43.895), new THREE.Vector3 ( -175,  -44.23,  21.14), new THREE.Vector3 ( -125,  -43.04,  3.82986152753329), new THREE.Vector3 ( -75,  39.659237323043598,  5.555498924354794), new THREE.Vector3 ( -25,  -2.652036841750376,  39.244945791007794), new THREE.Vector3 ( 25,  -2.727215377120153,  -39.78976235669646), new THREE.Vector3 ( 75,  -49.844181377245455,  16.690937023527468), new THREE.Vector3 ( 125,  41.673702991662715,  -47.319362801420631), new THREE.Vector3 ( 175,  49.673702991662715,  -35.160420668953776), new THREE.Vector3(225,-28.49983697098302, -4.747031516042874));

/*T…E.Vector3 {x: -225, y: 45.873438348622344, z: 43.895103516058455}
final.js:42 T…E.Vector3 {x: -175, y: -44.23050689740169, z: 21.145018314847192}
final.js:42 T…E.Vector3 {x: -125, y: -43.043785698014105, z: 3.858829092348671}
final.js:42 T…E.Vector3 {x: -75, y: 39.01032309354697, z: 5.633437995631809}
final.js:42 T…E.Vector3 {x: -25, y: -2.6420469544516507, z: 39.71670653418957}
final.js:42 T…E.Vector3 {x: 25, y: -2.4020576657665984, z: 16.45682667609485}
final.js:42 T…E.Vector3 {x: 75, y: 49.74674880826082, z: 16.46412349716155}
final.js:42 T…E.Vector3 {x: 125, y: 41.56475219150893, z: -47.980179511598095}
final.js:42 T…E.Vector3 {x: 175, y: 49.76866340686021, z: -35.160420668953776}
final.js:42 T…E.Vector3 {x: 225, y: -28.49983697098302, z: -4.747031516042874}*/

var fixedSpline =  new THREE.CatmullRomCurve3( fixedPoints);
var extrudeSettings = { extrudePath: fixedSpline, steps: 200, bevelEnabled : false};

for (var i = 0; i < fixedPoints.length; i++)
{
  point = fixedSpline.points[i];
  console.log("point" + point.x);
  scene.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial( { color: 0xff0000})));
}


var geometry = new THREE.ExtrudeGeometry( shape	, extrudeSettings );

var material = new THREE.MeshLambertMaterial( { color: 0xff8000, wireframe: false } );

var mesh = new THREE.Mesh( geometry, material );
//scene.add( mesh );

var cshape = new THREE.Shape();

cshape.absarc( 0, -5, 5, 0, 2 * Math.PI, false );


var coreCircleGeometry = new THREE.ExtrudeGeometry( cshape, extrudeSettings );
var coreCircleMaterial = new THREE.MeshLambertMaterial( { color: 0x808080, wireframe: false } );
var mesh2 = new THREE.Mesh( coreCircleGeometry, coreCircleMaterial );

scene.add( mesh2 );

//
// Rendering
//
var renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setClearColor( 0xffffff, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//
//  Define a camera & controls
//
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 300;
camera.position.x = 300;//
camera.lookAt(new THREE.Vector3(1,5,6));
//camera.position.y = 500;

//    lighting
scene.add( new THREE.AmbientLight( 0x222222 ) );
var light = new THREE.PointLight( 0xffffff );
light.position.copy( camera.position );
scene.add( light );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
controls.enableZoom = true;

function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
};


render();


