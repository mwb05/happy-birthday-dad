/* =====================================================================
   THE TRIP  -  the stops on the map and the cards under it.
   ---------------------------------------------------------------------
   Source: Jarvis's PCH road-trip plan (pch-road-trip-la-selva-beach),
   researched Oct 27, 2026. Facts only; nothing here is a booking.

   Each stop:
     key    - matches a point in MAP_POINTS below (where the pin goes)
     day    - 1 or 2 (a "Day 1" / "Day 2" divider is drawn when it changes)
     time   - short label shown on the card
     title  - the card headline
     place  - where it is
     text   - one or two sentences
     label  - the short name printed on the map (defaults to `place`)
     minor  - true = a small waypoint dot only, no card
   ===================================================================== */

window.TRIP = {
  headline: "From home to La Selva Beach, the long way round.",
  intro: "Two days and one night up Highway 1, with the ocean on the left the whole way. About 390 miles, and not one of them in the dark.",
  when: "First week of December 2026",

  stops: [
    {
      key: "start", day: 1, time: "Early",
      title: "Leave Orange County early",
      place: "Los Alamitos to Malibu",
      label: "Home",
      text: "Up the 405 to Santa Monica and onto the Pacific Coast Highway through Malibu, ocean on the left. Then the 101 along the Santa Barbara coast, with a coffee stop at Lilac Patisserie, a fully gluten-free bakery on State Street."
    },
    { key: "malibu", minor: true, label: "Malibu" },
    { key: "sb", minor: true, label: "Santa Barbara" },
    {
      key: "shell", day: 1, time: "12:30 PM",
      title: "Lunch over the ocean",
      place: "Marisol at the Cliffs, Shell Beach",
      label: "Shell Beach",
      text: "A clifftop dining room above the Pacific, with a proper gluten-free menu. The first long look at the water before the coast gets wild."
    },
    {
      key: "tolosa", day: 1, time: "2:00 PM",
      title: "A glass in the Edna Valley",
      place: "Tolosa Winery, San Luis Obispo",
      label: "Tolosa",
      text: "Fifteen minutes from lunch, among the vines with the volcanic morros on the skyline. Cool-climate Pinot Noir and Chardonnay, with a warm room if the December afternoon turns cool. I'll drive."
    },
    { key: "morro", minor: true, label: "Morro Rock" },
    {
      key: "cambria", day: 1, time: "Sunset",
      title: "Sunset at Moonstone Beach",
      place: "Cambria, night one",
      label: "Cambria",
      text: "A quick look at Morro Rock on the way, then into Cambria in time to watch the sun go down from the Moonstone Beach boardwalk. Dinner in town, and the night a short walk from the water."
    },
    { key: "seals", minor: true, label: "Piedras Blancas" },
    {
      key: "bigsur", day: 2, time: "Morning",
      title: "Big Sur in morning light",
      place: "Highway 1, Ragged Point to McWay Falls",
      label: "Big Sur",
      text: "Elephant seals at Piedras Blancas, the first big cliff view at Ragged Point, then the whole Big Sur coast: sweepers, cliffs and McWay Falls dropping straight onto the sand. Highway 1 is open end to end again, for the first time in years."
    },
    {
      key: "nepenthe", day: 2, time: "12:30 PM",
      title: "Birthday lunch at Nepenthe",
      place: "Nepenthe, Big Sur",
      label: "Nepenthe",
      text: "The terrace eight hundred feet above the Pacific, open every day since 1949. The Ambrosia burger, a glass of something local, gluten-free choices on the menu, and the whole coast laid out below. This is the birthday meal."
    },
    {
      key: "bixby", day: 2, time: "Afternoon",
      title: "Bixby Bridge and Carmel",
      place: "Highway 1 north",
      label: "Bixby Bridge",
      text: "The classic photograph from the north-side pullout, then a walk down Ocean Avenue to Carmel Beach while the light is still good."
    },
    {
      key: "laselva", day: 2, time: "4:30 PM",
      title: "La Selva Beach",
      place: "The end of the road",
      label: "La Selva Beach",
      text: "Past Monterey and Moss Landing, and into La Selva Beach before dark. Family at the other end, and the whole coast behind us."
    }
  ]
};

/* Where each key sits on the map (SVG units, viewBox 0 0 820 780).
   Projected from real coordinates; move a point if a pin looks off. */
window.MAP_POINTS = {
  start:     [706.8, 670.0],
  malibu:    [607.2, 624.0],
  sb:        [440.7, 546.0],
  shell:     [280.8, 398.0],
  tolosa:    [290.5, 388.0],
  morro:     [253.0, 356.0],
  cambria:   [212.2, 316.0],
  seals:     [184.4, 298.0],
  bigsur:    [140.4, 226.0],
  mcway:     [120.8, 198.0],
  nepenthe:  [105.5, 185.5],
  bixby:     [83.2, 156.0],
  carmel:    [78.3, 120.0],
  laselva:   [88.1, 42.0]
};

/* Which side of the pin the map label sits on ("r" right, "l" left). */
window.MAP_LABEL_SIDE = {
  start: "l", malibu: "r", sb: "r", shell: "l", tolosa: "r", morro: "r",
  cambria: "r", seals: "r", bigsur: "r", nepenthe: "r", bixby: "r", laselva: "r"
};

/* Nudge a label (SVG units) when two sit close together. */
window.MAP_LABEL_OFFSET = {
  seals: [0, -8], cambria: [0, 8], nepenthe: [2, -5], bixby: [0, -10], tolosa: [2, -4], shell: [-2, 10]
};

/* The coastline and the road, as SVG path data (generated from real
   lat/lon points; land is the California coast from Dana Point to
   Davenport, the route is the actual roads: 405, PCH, 101, 227, Hwy 1). */
window.MAP_GEOMETRY = {
  land: "M786.8,754.0 C783.5,751.3 775.9,745.3 767.2,738.0 C758.5,730.7 742.7,716.7 734.5,710.0 C726.3,703.3 725.8,703.0 718.2,698.0 C710.6,693.0 696.7,681.7 688.8,680.0 C680.9,678.3 677.4,688.7 670.9,688.0 C664.4,687.3 652.6,680.3 649.6,676.0 C646.6,671.7 654.0,668.3 652.9,662.0 C651.8,655.7 645.8,643.7 643.1,638.0 C640.4,632.3 642.6,630.3 636.6,628.0 C630.6,625.7 615.6,623.7 607.2,624.0 C598.8,624.3 593.1,630.3 586.0,630.0 C578.9,629.7 571.6,624.7 564.8,622.0 C558.0,619.3 552.8,618.0 545.2,614.0 C537.6,610.0 525.6,604.3 519.1,598.0 C512.6,591.7 514.2,583.7 506.0,576.0 C497.8,568.3 480.7,556.7 470.1,552.0 C459.5,547.3 451.0,548.7 442.3,548.0 C433.6,547.3 432.6,550.0 417.9,548.0 C403.2,546.0 371.3,537.3 354.2,536.0 C337.1,534.7 326.4,543.7 315.0,540.0 C303.6,536.3 289.4,521.7 285.6,514.0 C281.8,506.3 292.7,504.7 292.2,494.0 C291.7,483.3 283.5,465.3 282.4,450.0 C281.3,434.7 287.2,411.3 285.6,402.0 C284.0,392.7 279.1,397.7 272.6,394.0 C266.1,390.3 250.0,386.3 246.5,380.0 C243.0,373.7 252.0,362.7 251.4,356.0 C250.8,349.3 250.0,346.7 243.2,340.0 C236.4,333.3 218.2,322.3 210.6,316.0 C203.0,309.7 202.1,305.0 197.5,302.0 C192.9,299.0 186.6,302.7 182.8,298.0 C179.0,293.3 179.6,282.3 174.7,274.0 C169.8,265.7 159.4,256.0 153.4,248.0 C147.4,240.0 144.4,234.3 138.7,226.0 C133.0,217.7 125.2,205.0 119.2,198.0 C113.2,191.0 106.9,186.7 102.8,184.0 C98.7,181.3 98.2,184.7 94.7,182.0 C91.2,179.3 83.8,172.3 81.6,168.0 C79.4,163.7 82.4,164.0 81.6,156.0 C80.8,148.0 77.5,128.7 76.7,120.0 C75.9,111.3 75.6,105.7 76.7,104.0 C77.8,102.3 79.9,112.0 83.2,110.0 C86.5,108.0 93.6,98.7 96.3,92.0 C99.0,85.3 101.0,78.3 99.6,70.0 C98.2,61.7 94.4,47.3 88.1,42.0 C81.8,36.7 71.0,40.3 62.0,38.0 C53.0,35.7 41.6,32.7 34.3,28.0 C27.0,23.3 20.7,13.0 18.0,10.0 L18,0 L820,0 L820,780 L786.8,780 Z",
  route: "M706.8,670.0 C700.5,667.3 679.3,659.7 669.2,654.0 C659.1,648.3 651.6,640.3 646.4,636.0 C641.2,631.7 644.7,630.0 638.2,628.0 C631.7,626.0 615.9,623.7 607.2,624.0 C598.5,624.3 593.1,630.3 586.0,630.0 C578.9,629.7 571.6,624.7 564.8,622.0 C558.0,619.3 552.3,618.3 545.2,614.0 C538.1,609.7 528.6,602.3 522.3,596.0 C516.0,589.7 516.0,583.3 507.6,576.0 C499.2,568.7 482.9,557.0 471.7,552.0 C460.5,547.0 449.9,547.3 440.7,546.0 C431.4,544.7 430.3,545.7 416.2,544.0 C402.1,542.3 365.1,542.0 355.8,536.0 C346.6,530.0 366.7,524.0 360.7,508.0 C354.7,492.0 327.8,454.3 319.9,440.0 C312.0,425.7 318.8,428.3 313.4,422.0 C308.0,415.7 292.7,406.0 287.3,402.0 C281.9,398.0 280.3,400.3 280.8,398.0 C281.3,395.7 290.0,392.0 290.5,388.0 C291.0,384.0 290.2,379.3 284.0,374.0 C277.8,368.7 259.5,361.7 253.0,356.0 C246.5,350.3 251.6,346.7 244.8,340.0 C238.0,333.3 219.8,322.3 212.2,316.0 C204.6,309.7 203.7,305.0 199.1,302.0 C194.5,299.0 188.2,302.7 184.4,298.0 C180.6,293.3 181.2,282.3 176.3,274.0 C171.4,265.7 161.1,256.0 155.1,248.0 C149.1,240.0 146.1,234.3 140.4,226.0 C134.7,217.7 126.8,205.0 120.8,198.0 C114.8,191.0 108.6,187.7 104.5,184.0 C100.4,180.3 99.8,178.7 96.3,176.0 C92.8,173.3 85.4,171.3 83.2,168.0 C81.0,164.7 84.0,164.0 83.2,156.0 C82.4,148.0 78.3,127.7 78.3,120.0 C78.3,112.3 79.9,114.7 83.2,110.0 C86.5,105.3 94.9,98.7 97.9,92.0 C100.9,85.3 102.8,78.3 101.2,70.0 C99.6,61.7 90.3,46.7 88.1,42.0"
};
