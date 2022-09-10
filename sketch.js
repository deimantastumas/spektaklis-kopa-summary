// Dune settings
const DUNE_COUNT = 6;
let duneStartX;
let duneLength;
let duneSettings = {};

let socket;
let fontRegular;

function preload() {
  fontRegular = loadFont('fonts/Roboto-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  duneLength = windowWidth / 10;
  socket = io('https://spektaklis-kopa-api.herokuapp.com/', { transports : ['websocket'] });

  socket.on('connect', function() {
    console.log("Connected");
    socket.emit('join_room', {'room': 'summary'});
  });
  socket.emit('get_dunes', {});
  socket.on('all_dunes', function(data){
    console.log(data);
    duneSettings = data.dunes;
  });
}

function draw() {
  background("#192a56");

  // X coord where to start drawing dunes
  duneStartX = windowWidth/2-duneLength*(DUNE_COUNT/2);

  // Add labels
  push();
  fill("#f5f6fa");
  textAlign(CENTER);
  text("Spektaklis: Smėlio dėžėje", windowWidth/2, windowHeight/10);
  textSize(30);
  textFont(fontRegular);
  text("KAIP PER PASKUTINIUS PENKIS METUS KEITĖSI ATGAJOS FESTIVALIO DALYVIAI?", windowWidth/2, windowHeight/4);
  pop();
  push();
  const labelSize = windowHeight / 15;
  translate(windowWidth/2, windowHeight)
  rotate(radians(270));
  textAlign(CENTER);
  textSize(labelSize);
  fill("#f5f6fa");
  text("PREILA", windowHeight/2, -duneStartX-windowWidth/7);
  pop();
  push();
  rotate(radians(90));
  fill("#f5f6fa");
  textSize(labelSize);
  textAlign(CENTER);
  text("NIDA", windowHeight/2, -duneStartX-DUNE_COUNT*duneLength-windowWidth/20);
  pop();
  // Draw dunes
  push();
  noStroke();
  translate(windowWidth/2-duneLength*(DUNE_COUNT/2), windowHeight/2)
  const DUNE_COLORS = ["#ffeaa7", "#82589F", "#7ed6df", "#dff9fb", "#b8e994", "#e55039"];
  const DUNE_LABELS = ["Laisvalaikis", "Tikslai", "Tėvai", "Draugai", "Išvaizda", "Laimė"]
  const DUNE_CONTROL_POINTS = {
    0: [10, 30],
    1: [50, 60],
    2: [50, 20],
    3: [25, 30],
    4: [50, 30],
    5: [-10, 20]
  };

  for (let i = 0; i < DUNE_COUNT; i++) {
    let leftPos = duneLength * i;
    textAlign(CENTER);
    fill("#f5f6fa");
    textSize(windowHeight/30);
    textFont(fontRegular);
    text(DUNE_LABELS[i], leftPos+duneLength/2, windowHeight/3.5)
  }

  for (const [_, dunes] of Object.entries(duneSettings)) {
    for (let duneIndex = 0; duneIndex < dunes.length; duneIndex++) {
      let leftPos = duneLength * duneIndex;
      fill(255, 234, 167, 5);
      bezier(
        leftPos, 0,
        leftPos+DUNE_CONTROL_POINTS[duneIndex][0], dunes[duneIndex], leftPos+DUNE_CONTROL_POINTS[duneIndex][1], dunes[duneIndex],
        leftPos+duneLength, 0
      );
    }
  }
  pop();
}
