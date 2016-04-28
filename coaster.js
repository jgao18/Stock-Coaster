var renderer;
var basicCamera;
var splineCamera;
var controls;
var scene = new THREE.Scene();

var dateList;
var priceList;
var trackPoints = [];
var trackSpline;
var extrudeSettings;

var companies = {};

companies["SUNE"] = ["SunEdison (NYSE:SUNE) is a global renewable energy development company", "based in Maryland Heights, MO that develops and operates solar power plants", 0xff8000 ];
companies["WPX"] = ["WPX Energy (NYSE:WPX) is a petroleum and natrual gas exploration company", "that was founded in 2011 and headquartered in the Williams Center of Tulsa, OK", 0x00b4c3 ];

renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setClearColor(0x87cefa, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

setCompany();

function setCompany() {
  select = document.getElementById("companies");
  company= select.options[select.selectedIndex].value;

  loadSpline(company);
  loadTrack();
  loadCart();
  loadCompanyDetails(company);
  loadCamerasAndControls();
  loadLight();
  animate();
}

function loadSpline(company) {
  dateAndPriceList = getDateAndPriceListFromFile("prices/" + company + "_weekly.txt");
  dateList = dateAndPriceList[0];
  priceList = dateAndPriceList[1];
  lastPointX = 0;
  xIncrement = 35;

  // Add straight line points to show company info
  for (i = 40; i > 1; i--) {
    fartherPoint = new THREE.Vector3(-1*i*xIncrement, priceList[0]*20, 45);
    trackPoints.push(fartherPoint);
  }

  // Add actual coaster points
  for (i = 0; i < priceList.length; i++) {
    pricePoint = new THREE.Vector3(lastPointX, priceList[i]*20, 45)
    trackPoints.push(pricePoint);
    lastPointX += xIncrement;
  }

  // Coaster spline and settings
  trackSpline =  new THREE.CatmullRomCurve3(trackPoints);
  extrudeSettings = {extrudePath: trackSpline, steps: 2000}; // amount, curveSegments
}

function loadTrack() {
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
  materialLoader.load('images/dirt.jpg', function ( texture ) {
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		baseMaterial.map = texture;
		baseMaterial.needsUpdate = true;
	});
  scene.add(new THREE.Mesh(baseGeometry, baseMaterial));

  // Green and red pipes
  pipeShape = new THREE.Shape();
  pipeShape.absarc( 0, -5, 5, 0, 2*Math.PI, false );
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
  colladaLoader.load("model/cart.dae", function (collada) {
    cartObject.add(collada.scene)
  })
  scene.add(cartObject);
}

function loadCompanyDetails(company) {
  startPrice = priceList[0];
  finishPrice = priceList[priceList.length - 1];

  // Loading Ccmpany logo
  logoLoader = new THREE.TextureLoader();
  logoLoader.load('images/' + company + '-logo.png', function (logoTexture) {
    logoPlane = new THREE.PlaneGeometry(334, 97);
    logoPlane.translate(0,startPrice*30.24, 500);
    addToScene(logoPlane, "basic", {map: logoTexture, transparent: true}, -1*Math.PI/2)
    }
  );

  // Finding price extremes
  extremes = [];
  for (i = 1; i < priceList.length - 1; ++i) {
    localExtreme = priceList[i];
    if (priceList[i-1] < localExtreme && localExtreme > priceList[i+1]) { // local max
      extremes.push([i, dateList[i], localExtreme]);
    } else if (priceList[i-1] > localExtreme && localExtreme < priceList[i+1]) { // local min
      extremes.push([i, dateList[i], localExtreme]);
    }
  }

  // Loading company description and price extremes
  companyColor = companies[company][2];
  fontLoader = new THREE.FontLoader();
  fontLoader.load('three/optimer_regular.typeface.js', function (font) {
    // Company description
    textGeometry = new THREE.TextGeometry(companies[company][0], {font: font, size: 20, height: 5});
    textGeometry2 = new THREE.TextGeometry(companies[company][1], {font: font, size: 20, height: 5});
    textGeometry.translate(-450, startPrice*24.61, 500);
    textGeometry2.translate(-450, startPrice*22.50, 500);
    addToScene(textGeometry, "basic", {color: companyColor}, -1*Math.PI/2);
    addToScene(textGeometry2, "basic", {color: companyColor}, -1*Math.PI/2);

    // Price extremes
    startPriceGeometry = new THREE.TextGeometry("Start:             " + startPrice + "        "  + dateList[0], {font: font, size: 3, height: 1});
    startPriceMesh = addToScene(startPriceGeometry, "basic", {color: companyColor}, -1*Math.PI/2);
    startPriceMesh.translateX(16);
    startPriceMesh.translateZ(40);
    startPriceMesh.translateY(startPrice*20.1);

    finishPriceGeometry = new THREE.TextGeometry("Finish:             " + finishPrice + "        "  + dateList[dateList.length - 1], {font: font, size: 3, height: 1});
    finishPriceMesh = addToScene(finishPriceGeometry, "basic", {color: companyColor}, -1*Math.PI/2);
    finishPriceMesh.translateX(16);
    finishPriceMesh.translateZ(-1*35*111);
    finishPriceMesh.translateY(finishPrice*20.1);

    lastPrice = startPrice;
    for (i = 0; i < extremes.length; i++) {
      counter = extremes[i][0];
      date = extremes[i][1];
      price = extremes[i][2];

      if (price > lastPrice)
      	color = 0x41c100;
      else
      	color = 0xc10000;

      priceGeometry = new THREE.TextGeometry(price, {font: font, size: 3, height: 1});
      priceMesh = addToScene(priceGeometry, "basic", {color: color}, -1*Math.PI/2);
      priceMesh.translateX(40.25);
      priceMesh.translateZ(-1*35*counter);
      priceMesh.translateY(price*20.1);

      dateGeometry = new THREE.TextGeometry(date, {font: font, size: 3, height: 1});
      dateMesh = addToScene(dateGeometry, "basic", {color: 0x000000}, -1*Math.PI/2);
      dateMesh.translateX(61);
      dateMesh.translateZ(-1*35*counter);
      dateMesh.translateY(price*20.3);

      lastPrice = price;
    }
  });
}

function loadCamerasAndControls() {
  basicCamera = new THREE.PerspectiveCamera(120,window.innerWidth/window.innerHeight, 0.1, 1000);
  basicCamera.position.set(2000,300,800);
  scene.add(basicCamera)

  splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);

  controls = new THREE.OrbitControls(basicCamera, renderer.domElement);
  controls.autoRotate = false;
  controls.enableZoom = true;
}

function loadLight() {
  scene.add(new THREE.AmbientLight(0x222222));
  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 2, 0);
  scene.add(directionalLight );
}

function animate() {
  requestAnimationFrame(animate);
  render();
  controls.update();
}

function render() {
    time = Date.now();
    looptime = 95*1000; // higher factor => slower speed
    t = ( time % looptime ) / looptime;

    position = trackSpline.getPointAt(t)

    cartObject.position.copy(position);
    cartObject.position.x -= 1.1;

    splineCamera.position.copy(position);
    splineCamera.position.y += 2;
    splineCamera.rotation.y = 270*Math.PI/180;

    // Taking the average of the next few points to determine lookAt direction
    aheadPoints = 2;
    direction = new THREE.Vector3(0, 0, 0);
    for (i = 0; i < aheadPoints; i++) {
      aheadPoint = t + (.01*i);
      if (aheadPoint > 1 )  // prevent out of bounds
        aheadPoint = 1;
      direction.add(trackSpline.getPointAt(aheadPoint));
    }
    direction.divideScalar(aheadPoints);
    tangent = trackSpline.getTangentAt(t);
    direction.add(tangent)
    splineCamera.lookAt(direction);
    cartObject.lookAt(direction);
    cartObject.rotateOnAxis(new THREE.Vector3(0, 1, 0), -90*Math.PI/180)

    renderer.render(scene, splineCamera);
    //renderer.render(scene, basicCamera);
};

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
  return mesh;
}