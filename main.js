// calculate rate per box
// calculate rate per packs

var extraRarity = Math.random(2); // max 1
var xRare = 3;
var mRare = Math.random(2) + 5; // max 6
var tRare = 6;
// fow now we will not care about how many box per case
var rDupes = 2;
var cDupes = 4;
var boxResult = new Object();
var packResults = [];
var rarityPool = [];

var MAX_RARE_AMOUNT = 12;
var displayedPackAmount = 20;

// common is 0, Rare is 1, MRare is 2, TRare is 3, XRare is 4, Extra is 5
var common, rare, xrare, extra;

var RARITY_COMMON = 0;
var RARITY_RARE = 1;
var RARITY_MASTER_RARE = 2;
var RARITY_REBIRTH_RARE = 3;
var RARITY_X_RARE = 4;
var RARITY_EXTRA_RARE = 5;

var rarityRates = {
    5 : Math.floor(Math.random() * 2),
    4 : 3,
    3 : Math.floor(Math.random() * 2) + 5,
    2 : 6
}

var rarityName = {
    5: "Congratulations!",
    4: "X-Rare",
    3: "Rebirth Rare",
    2: "Master Rare",
    1: "Rare",
    0: "Common"
}

var currentPack = 0;
var currentDisplayedPack = 0;
var currentPackContents = [];

var TEMPORARY_LIST_HACK = "001;Evangelion Production Model Unit-02 Revised Beta;0$003;Evangelion Production Model (WILLE Custom) Unit-08 Beta;0$006;Evangelion Production Model Unit-02 Revised Gamma -Machine Gun-;0$007;"
+ "Evangelion Production Model (WILLE Custom) Unit-08 Beta -Sniper Rifle-;0$012;EVANGELION Mark. 09 -Wunder Raiding-;0$014;EVANGELION Mark.04 Code 4A;0$015;EVANGELION Mark.04 Code 4B;0$016;Evangelion Test Type Unit-01"
+ "-Dummy System-;0$018;EVANGELION Mark.04 Code 4C;0$019;EVANGELION Mark.06;0$022;Evangelion Unit-13 -Defense Unit-;0$029;The 3rd Apsotle;0$031;The 5th Apostle;0$032;The 12th Apostle;0$034;The 7th Apostle;0$035;The 9th "
+ "Apostle;0$041;Dummy System;0$044;WILLE;0$046;SEELE;0$052;Central Dogma's Deepest Part;0$053;The 2nd Apostle Lilith;0$056;This Is The Last One!;0$057;Adults Know The Right Time To Be Sly;0$059;We've Won;0$060;"
+ "Go! Shinji-kun;0$062;Pattern Blue;0$009;Evangelion Production Model Unit-02 -To Work a Miracle-;2$011;Evangelion Production Model New Unit-02 Alpha;2$021;Evangelion Test Type Unit-01 -To Work a Miracle-;2$026;"
+ "Evangelion Prototype Unit-00 (Revised) -To Work A Miracle-;2$037;The 10th Apostle;2$038;Shikinami Asuka Langley -WILLE-;2$039;Ayanami-Rei (Tentative Name);2$042;The Spear of Longinus;2$054;Ikari Gendo;2$002;Evangelion "
+ "Production Model (WILLE Custom) Unit-08 Alpha;1$004;Evangelion Production Model Unit-02 Revised Gamma;1$010;Evangelion Production Model (WILLE Custom) Unit-08 Beta Temporary Combat Form;1$017;EVANGELION Mark.09;1$020;"
+ "The First Adam's Vessel;1$023;Evangelion Unit-13 Pseudo-Synthesis 3+ Form (Estimated);1$024;Evangelion Provisional Unit-05 -Spear of Longinus Basic Type (Pseudo-Restoration)-;1$025;Evangelion Prototype Unit-00 "
+ "(Revised) -N2 Warhead Bomb-;1$027;The 10th Apostle -Unit-00 Devoured-;1$028;The 13th Apostle;1$030;The 4th Apostle;1$033;The 6th Apostle;1$036;The 8th Apostle;1$040;Ikari Shinji -Unit-13 Plugsuit-;1$043;AAA Wunder;1$048;"
+ "Akagi Ritsuko;1$055;I Know That Already!;1$058;Now The Promised Time Has Come, Ikari Shinji-kun. This Time, I'll Definitely Make You Happy;1$061;You Won't Die. Because I'll Protect You;1$005;Evangelion Production Model Unit-02 -Thunder Spear- / Evangelion Production Model Unit-02 Beast Form 2nd Phase (Type 1);3$008;Evangelion Production Model Unit-02 Revised Gamma -Wunder Saving- / Evangelion Production Model Unit-02 Revised Gamma -Code 777-;3$013;Evangelion Test Type Unit-01 -First Activation- / Evangelion Test Type Unit-01 -Berserk-;3$045;Shikinami Asuka Langley -Uniform- / Shikinami Asuka Langley -Plugsuit-;3$047;Nagisa Kaworu / Nagisa Kaworu -Mark. 06 Plugsuit-;3$049;Ikari Shinji -Uniform- / Evangelion Unit-01 Pilot Ikari Shinji;3$050;Makinami Mari Illustrious -Uniform- / Makinami Mari Illustrious -Plugsuit-;3$051;Ayanami Rei -Uniform- / Ayanami Rei -Plugsuit-;3$S09;Evangelion Production Model Unit-02 -To Work a Miracle-;5$S21;Evangelion Test Type Unit-01 -To Work a Miracle-;5$S26;Evangelion Prototype Unit-00 (Revised) -To Work A Miracle-;5$S38;Shikinami Asuka Langley -WILLE-;5$S39;Ayanami-Rei (Tentative Name);5$S40;Ikari Shinji -Unit-13 Plugsuit-;5$SX05;Nagisa Kaworu -Unit-13 Plugsuit-;5$X01;EVANGELION Mark. 06 -Spear of Cassius-;4$X02;Evangelion Unit-13;4$X03;Evangelion Test Type Unit-01 Pseudo-Synthesis 2nd Form;4$X04;Shikinami Asuka Langley -Test Suit-;4$X05;Nagisa Kaworu -Unit-13 Plugsuit-;4$X06;Ayanami Rei -Feeling Warm-;4$XX01;Ikari Yui;5";

function generateBox() {
    rarityRates[RARITY_RARE] = MAX_RARE_AMOUNT - rarityRates[RARITY_EXTRA_RARE] - rarityRates[RARITY_MASTER_RARE];
    // booster content is 4 C + 1 R + 1R or higher
    // generate 20 packs and then randomize
    buildPoolList();
    generateSummary();
    document.querySelector('#generate_image_button').addEventListener('click', generateImage);

    for (const [key, value] of Object.entries(rarityRates)) {
        generatePacks(value, key);
    }

    shuffle(packResults);
}

function generatePacks(amount, extra) {
    for(var i = 0; i<amount; i++) {
        generatePack(extra);
    }
}

function generatePack(extra) {
    packResults.push([]);
    currentPackContents = [];
    //generate commons
    generateCards(4, RARITY_COMMON);
    //generate fixed R
    generateCards(1, RARITY_RARE);
    //generate random R
    generateCards(1, extra);

    currentPack++;
}

function generateCards(amount, rarity) {
    for(var i = 0; i<amount; i++) {
        generateCard(rarity);
    }
}

function generateCard(rarity) {
    //while not different, generate card
    var result=-1;
    var pool = boxResult[rarity];
    while(result < 0) {
        result = Math.floor(Math.random() * pool.length);
        //need to fix issue for dupe in the same pack
        if(boxResult[rarity][result]['amount'] < getDupeCount(rarity) && false == currentPackContents.includes(result)) {
            boxResult[rarity][result]['amount']++;
            updateSummary(boxResult[rarity][result]['code'], rarity, boxResult[rarity][result]['amount']);
            packResults[currentPack].push("CB21 - " + boxResult[rarity][result]['code'] + " " + boxResult[rarity][result]['name']);
            currentPackContents.push(result);
        } else {
            result = -1;
        }
    }
}

function updateSummary(code, rarity, amount) {
    document.getElementById("header_" + rarity).style.display = "";
    if(rarity == RARITY_X_RARE || rarity == RARITY_EXTRA_RARE) {
        var columns = document.getElementsByClassName("column-" + code);
        
        for(var i = 0; i < columns.length; i++){
            columns[i].style.display = "";
        }
    } else {
        document.getElementById("amount_" + code).textContent = amount;
    }
}

//move to object later
function getDupeCount(rarity) {
    switch (rarity) {
        case 0: return cDupes;
        case 1: return rDupes;
        default: return 1;
    }
}

function buildPoolList() {
    var list = TEMPORARY_LIST_HACK.split('$');
    var temp;

    list.forEach(function(item) {
        temp = item.split(";");
        if(typeof boxResult[temp[2]] == 'undefined') {
            boxResult[temp[2]] = [];
        }
        boxResult[temp[2]].push({'code': ("" + temp[0]),'name': temp[1], 'amount': 0});
    });
}

//Knuth's shuffle
function shuffle(array) {
let currentIndex = array.length,  randomIndex;

// While there remain elements to shuffle...
while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

function appendResult() {
    var container = document.getElementById("result_container");
    var newDiv = document.createElement("div");
    
    appendText("Result of Pack " + (currentDisplayedPack + 1), newDiv)
    packResults[currentDisplayedPack].forEach(function(item){
        appendText(item, newDiv);
    });
    container.insertBefore(newDiv, container.firstChild);
    currentDisplayedPack++;
    document.getElementById("pack_count").innerHTML = --displayedPackAmount;
    if(displayedPackAmount == 0) {
        document.getElementById("next_open_button").remove();
        document.getElementById("toggle_summary_button").style.display = "";
    }
}

function appendText(text, target) {
    textDiv = document.createElement("div");
    textNode = document.createTextNode(text);
    textDiv.appendChild(textNode);
    target.appendChild(textDiv);
}

function generateSummary() {
    createContainer(RARITY_EXTRA_RARE);
    generateRareTable(RARITY_EXTRA_RARE);
    createContainer(RARITY_X_RARE);
    generateRareTable(RARITY_X_RARE);
    createContainer(RARITY_REBIRTH_RARE);
    generateNormalTable(RARITY_REBIRTH_RARE);
    createContainer(RARITY_MASTER_RARE);
    generateNormalTable(RARITY_MASTER_RARE);
    createContainer(RARITY_RARE);
    generateNormalTable(RARITY_RARE);
    createContainer(RARITY_COMMON);
    generateNormalTable(RARITY_COMMON);
}

function createContainer(rarity) {
    var summaryDiv = document.createElement("div");
    summaryDiv.setAttribute("id", "summary_" + rarity);
    var header = document.createElement("h3");
    header.textContent = rarityName[rarity];
    header.setAttribute("id", "header_" + rarity);
    header.style.display = "none";
    summaryDiv.appendChild(header);
    document.getElementById("summary_container").appendChild(summaryDiv);
}

function generateRareTable(rarity) {
    var summaryDiv = document.getElementById("summary_" + rarity);
    var tableElement = document.createElement("table");
    var trNode, tdNode;

    var imgNode, codeNode, nameNode;

    // print image
    trNode = document.createElement('tr');
    boxResult[rarity].forEach(function(item) {
        tdNode = document.createElement('td');
        
        imgNode = new Image();
        imgNode.src = "assets/" + item['code'] + ".png";

        tdNode.appendChild(imgNode);
        tdNode.setAttribute("class", "column-" + item['code']);
        tdNode.setAttribute("style", "display:none;");
        trNode.appendChild(tdNode);
    });
    tableElement.appendChild(trNode);

    //print names
        trNode = document.createElement('tr');
    boxResult[rarity].forEach(function(item) {
        tdNode = document.createElement('td');
        codeNode = document.createElement('b');
        codeNode.textContent = "CB21-" + item['code'] + " ";
        nameNode = document.createTextNode(item['name']);
        
        tdNode.appendChild(codeNode);
        tdNode.appendChild(nameNode);
        tdNode.setAttribute("class", "column-" + item['code']);
        tdNode.setAttribute("style", "display:none;");
        trNode.appendChild(tdNode);
    });
    tableElement.appendChild(trNode);

    //print amounts and hide
    trNode = document.createElement('tr');
    boxResult[rarity].forEach(function(item) {
        tdNode = document.createElement('td');

        tdNode.textContent = item['amount'];
        tdNode.setAttribute("id", "amount_" + item['code']);
        tdNode.setAttribute("style", "display:none;");
        trNode.appendChild(tdNode);
    });
    tableElement.appendChild(trNode);
    summaryDiv.appendChild(tableElement);
}

function generateNormalTable(rarity) {
    var summaryDiv = document.getElementById("summary_" + rarity);
    var tableElement = document.createElement("table");
    var thName, thCode, thAmount, trNode, tdName, tdCode, tdAmount;

    trNode = document.createElement('tr');
    thCode = document.createElement('th');
    thCode.textContent = "Code";
    thName = document.createElement('th');
    thName.textContent = "Name";
    thAmount = document.createElement('th');
    thAmount.textContent = "Amount";

    trNode.appendChild(thCode);
    trNode.appendChild(thName);
    trNode.appendChild(thAmount);

    tableElement.appendChild(trNode);

    boxResult[rarity].forEach(function(item) {
        trNode = document.createElement('tr');
        tdName = document.createElement('td');
        tdCode = document.createElement('td');
        tdAmount = document.createElement('td');

        tdName.textContent = "CB21-" + item['code'];
        trNode.appendChild(tdName);
        tdCode.textContent = item['name'];
        trNode.appendChild(tdCode)
        tdAmount.textContent = item['amount'];
        tdAmount.setAttribute("id", "amount_" + item['code']);
        trNode.appendChild(tdAmount);
        
        tableElement.appendChild(trNode);
    });
    summaryDiv.appendChild(tableElement);
}

var SHOW_PACK = 0;
var SHOW_SUMMARY = 1;
var currentDisplayStep = 0;

function toggleView() {
    var buttons = document.getElementsByClassName("containers");
    currentDisplayStep = (currentDisplayStep + 1) % 2;

    for (var i = 0; i<buttons.length; i++) {
        buttons[i].style.display = "none";
    }

    switch(currentDisplayStep) {
        case SHOW_PACK:
            document.getElementById("result_container").style.display = "";
            break;
        case SHOW_SUMMARY:
            document.getElementById("summary_container").style.display = "";
            break;
    }
}

// probably we'll revisit in future updates
function generateImage() {
    const filename = "BS Box Unboxing Result.png";

    html2canvas(document.querySelector('#summary_container')).then(canvas => {
        const dataURL = canvas.toDataURL();
        const imgButton = document.querySelector('#generate_image_button'); // change with the genrate image button

        imgButton.removeEventListener('click', generateImage);
        imgButton.innerHTML = '';
        imgButton.insertAdjacentHTML('beforeend', `<a href="${dataURL}" download="${filename}">Download Image</a><br><br>`);
    });
}


// generate list
// show one pack result
// generate image

generateBox();

