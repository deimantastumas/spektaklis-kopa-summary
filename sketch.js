let duneHeight1 = 0;
let duneHeight2 = 300;
let currentY = 0;
let currentDuneIndex = -1;

const DUNE_HEIGHTS = [0, 0, 0, 0, 0, 0];

// COLORS
const DIVIDER_COLOR = "#eb9986";
const DUNE_COLOR = "#ffeaa7";

// SIZES
const DIVIDER_HEIGHT = 2;
let DUNE_LENGTH;

// OTHER
const DUNE_COUNT = 6;
const DUNE_CONTROL_POINTS_X1 = [30, 60, 40, 10, 80, 30]
const DUNE_CONTROL_POINTS_X2 = [60, 90, 50, 70, 150, 40]
let DUNE_START_X;

let duneSettings = {
  0: [-148, 148, -70, 69, -140, -59],
  1: [-120, 130, -40, 69, -140, -59]
};

let socket;

function setup() {
  createCanvas(windowWidth, windowHeight);
  DUNE_LENGTH = windowWidth / 10;
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
  DUNE_START_X = windowWidth/2-DUNE_LENGTH*(DUNE_COUNT/2);

  // Add labels
  push();
  fill("#f5f6fa");
  textAlign(CENTER);
  text("Spektaklis: Smėlio dėžėje", windowWidth/2, windowHeight/10);
  pop();
  push();
  const labelSize = windowHeight / 15;
  translate(windowWidth/2, windowHeight)
  rotate(radians(270));
  textAlign(CENTER);
  textSize(labelSize);
  fill("#f5f6fa");
  text("PREILA", windowHeight/2, -DUNE_START_X-windowWidth/7);
  pop();
  push();
  rotate(radians(90));
  fill("#f5f6fa");
  textSize(labelSize);
  textAlign(CENTER);
  text("NIDA", windowHeight/2, -DUNE_START_X-DUNE_COUNT*DUNE_LENGTH-windowWidth/20);
  pop();
  // Draw dunes
  push();
  noStroke();
  translate(windowWidth/2-DUNE_LENGTH*(DUNE_COUNT/2), windowHeight/2)
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
    let leftPos = DUNE_LENGTH * i;
    textAlign(CENTER);
    fill("#f5f6fa");
    textSize(windowHeight/30);
    text(DUNE_LABELS[i], leftPos+DUNE_LENGTH/2, windowHeight/3.5)
  }

  for (const [_, dunes] of Object.entries(duneSettings)) {
    for (let duneIndex = 0; duneIndex < dunes.length; duneIndex++) {
      let leftPos = DUNE_LENGTH * duneIndex;
      fill(255, 234, 167, 5);
      bezier(
        leftPos, 0,
        leftPos+DUNE_CONTROL_POINTS[duneIndex][0], dunes[duneIndex], leftPos+DUNE_CONTROL_POINTS[duneIndex][1], dunes[duneIndex],
        leftPos+DUNE_LENGTH, 0
      );
    }
  }
  pop();
}
