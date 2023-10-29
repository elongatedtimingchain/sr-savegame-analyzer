let gameInfo = {}

function toggleDarkMode() {
    const body = document.body;
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (body.classList.contains("dark-mode")) {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
        darkModeToggle.textContent = "Light Mode";
    } else {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
        darkModeToggle.textContent = "Dark Mode";
    }
} 

function addPercentage(elemClass) {
    for (const elem of document.getElementsByClassName(elemClass)) {
        numItemsFinished = elem.getElementsByClassName("done").length;
        numItemsTotal = elem.getElementsByClassName("objective").length;
        for (const cn of ["num_trucks", "num_upgrades", "num_watchpoints"]) {
            for (const li of elem.getElementsByClassName(cn)) {
                numItemsFinished += li.dataset.numCurrent;
                numItemsTotal += li.dataset.numTotal;
            }
        }
        elem.children[0].textContent = elem.dataset.name + ": " + (100.0 * numItemsFinished / numItemsTotal).toFixed(2) + "%";
    }
}

function getNumDiscoveredTrucksByLevel(savegame) {
    result = {};
    const discoveredTrucks = savegame.CompleteSave.SslValue.persistentProfileData.discoveredTrucks;
    for (level of gameInfo.map(x => x.maps).flat().map(x => x.key)) {
        result[level] = (level in discoveredTrucks) ? discoveredTrucks[level].current : 0;
    }
    return result;
}

function getNumDiscoveredUpgradesByLevel(savegame) {
    result = {};
    const discoveredUpgrades = savegame.CompleteSave.SslValue.persistentProfileData.discoveredUpgrades;
    for (level of gameInfo.map(x => x.maps).flat().map(x => x.key)) {
        result[level] = (level in discoveredUpgrades) ? discoveredUpgrades[level].current : 0;
    }
    return result;
}

function getNumDiscoveredWatchpointsByLevel(savegame) {
    result = {};
    const watchPoints = savegame.CompleteSave.SslValue.watchPointsData.data;
    for (level of gameInfo.map(x => x.maps).flat().map(x => x.key)) {
        result[level] = (level in watchPoints) ? Object.values(watchPoints[level]).reduce((sum, next) => sum + (next ? 1 : 0), 0)  : 0;
    }
    return result;   
}

function addProgress(progressByLevel, varName) {
    for (const [mapName, numCurrent] of Object.entries(progressByLevel)) {
        const liNode = document.getElementById(varName + "_" + mapName);
        if (liNode !== null) {
            liNode.dataset.numCurrent = Math.min(numCurrent, liNode.dataset.numTotal);
            liNode.textContent = liNode.dataset.name + ": " + liNode.dataset.numCurrent + " / " + liNode.dataset.numTotal;
        }        
    }    
}

function makeObjectiveLiNode(objective) {
    const liNode = document.createElement("li");
    liNode.id = objective.key;
    liNode.classList.add("objective");
    if (typeof(objective.type) !== "undefined") {
        liNode.classList.add("obj-kind-" + objective.type.toLowerCase())
    }
    const name = (typeof(objective.name) !== "undefined") ? objective.name : objective.key;
    liNode.textContent = name;
    return liNode;
}

function addUnknownObjective(objectiveKey) {
    const shortLevelId = objectiveKey.substr(0,8).toLowerCase();
    for (const objectivesLi of document.getElementsByClassName("objectives")) {
        if (objectivesLi.id.startsWith("objectives_level_" + shortLevelId)) {
            const ul = objectivesLi.children[0];
            const li = makeObjectiveLiNode({
                "key": objectiveKey,
                "type": "new"
            });
            ul.appendChild(li);
            return li;
        }
    }
}

function processSavegame(savegame) {
    const discoveredObjectives =savegame.CompleteSave.SslValue.discoveredObjectives;
    for (const obj in discoveredObjectives) {
        const objKey = discoveredObjectives[obj];
        const li = document.getElementById(objKey);
        if (!li) {
            // console.log(objKey);
            addUnknownObjective(objKey);
        }
    }
    const liObjectives = document.getElementsByClassName("objective");
    for (const li of liObjectives) {
        li.classList.add("pending");
    }
    const finishedObjectives = savegame.CompleteSave.SslValue.finishedObjs;
    for (const obj in finishedObjectives) {
        const objKey = finishedObjectives[obj];
        li = document.getElementById(objKey);
        if (!li) {
            continue;
        }
        li.classList.remove("pending");
        li.classList.add("done");
    }
    const divTrackedObjective = document.getElementById("tracked_objective");
    const trackedObjectiveKey = savegame.CompleteSave.SslValue.trackedObjective;
    if (trackedObjectiveKey !== "") {
        const trackedObjLi = document.getElementById(trackedObjectiveKey);
        const name = (trackedObjLi !== null) ? trackedObjLi.textContent : trackedObjectiveKey;
        divTrackedObjective.textContent = "Tracked Objective: " + name;
    }
    for (const elem of document.getElementsByClassName("objectives")) {
        numItemsFinished = elem.getElementsByClassName("done").length;
        elem.childNodes[0].textContent = elem.dataset.name + ": " + numItemsFinished + " / " + elem.dataset.numTotal;
    }
    addProgress(getNumDiscoveredTrucksByLevel(savegame), "num_trucks");
    addProgress(getNumDiscoveredUpgradesByLevel(savegame), "num_upgrades");
    addProgress(getNumDiscoveredWatchpointsByLevel(savegame), "num_watchpoints");
    addPercentage("region");
    addPercentage("map");
    addPercentage("employer");
}

function handleFileSelect(input) {
    const invalidSavegame = function() {
        alert("Invalid Savegame!");
    }
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;
            try {
                const savegame = JSON.parse(fileContent.replace(/\0/g, ''));
                processSavegame(savegame);
            } catch (e) {
                console.error(e);
                invalidSavegame();
                return;
            }
        }
        reader.readAsText(file);
    }
}

function makeObjectivesUlNode(objectives) {
    const ulNode = document.createElement("ul");
    ulNode.classList.add("objective-list");
    if (typeof(objectives) !== "undefined") {
        for (const objective of objectives) {
            ulNode.appendChild(makeObjectiveLiNode(objective));
        }
    }
    return ulNode;
}

function createMapInfoListItem(map, varName, prettyName, isCount=false) {
    if (typeof(map[varName]) === "undefined") {
        return null;
    }
    const liNode = document.createElement("li");
    if (isCount) {
        liNode.dataset.numTotal = map[varName].length
    } else {
        liNode.dataset.numTotal = map[varName];
    }
    liNode.id = varName + "_" + map.key;
    liNode.dataset.name = prettyName;
    liNode.textContent = prettyName + ": " + liNode.dataset.numTotal;
    liNode.classList.add(varName);
    return liNode;
}

function createDetailsNode(summary) {
    const detailsNode = document.createElement("details");
    const summaryNode = document.createElement("summary");
    summaryNode.textContent = summary;
    detailsNode.appendChild(summaryNode);
    return detailsNode;
}

function createPNode(text) {
    const pNode = document.createElement("p");
    pNode.textContent = text;
    return pNode;
}

function processGameInfo() {
    for (const region of gameInfo) {
        const detailsNodeRegion = createDetailsNode(region.name);
        detailsNodeRegion.classList.add("region");
        detailsNodeRegion.dataset.name = region.name
        if (typeof(region.maps) !== "undefined") {
            detailsNodeRegion.appendChild(createPNode("Maps:"));
            for (const map of region.maps) {
                const detailsNodeMap = createDetailsNode(map.name);
                detailsNodeMap.classList.add("map");
                detailsNodeMap.dataset.name = map.name;
                const ulNode = document.createElement("ul");
                const mapVars = {
                    "num_trucks": "Trucks",
                    "num_upgrades": "Upgrades",
                    "num_watchpoints": "Watchpoints"
                }
                for (const [varName, prettyName] of Object.entries(mapVars)) {
                    const liNode = createMapInfoListItem(map, varName, prettyName);
                    if (liNode) {
                        ulNode.appendChild(liNode);
                    }
                }
                const liNode = createMapInfoListItem(map, "objectives", "Tasks / Contests", true);
                if (liNode) {
                    liNode.appendChild(makeObjectivesUlNode(map.objectives));
                    ulNode.appendChild(liNode);
                }
                detailsNodeMap.appendChild(ulNode);
                detailsNodeRegion.appendChild(detailsNodeMap);
            }
        }
        if (typeof(region.contracts) !== "undefined") {
            detailsNodeRegion.appendChild(createPNode("Contracts:"));
            for (const employer of region.contracts) {
                const detailsNodeEmployer = createDetailsNode(employer.name);
                detailsNodeEmployer.classList.add("employer");
                detailsNodeEmployer.dataset.name = employer.name;
                detailsNodeEmployer.appendChild(makeObjectivesUlNode(employer.objectives));
                detailsNodeRegion.appendChild(detailsNodeEmployer);
            }
        }
        document.getElementById("main").appendChild(detailsNodeRegion);
    }
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('main').style.display = '';

    const params = new URLSearchParams(window.location.search);
    if (params.has("savegame")) {
        const savegamePath = params.get("savegame");
        fetch(savegamePath, { cache: "reload" })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Unable to fetch file.");
                }
                return response.text();
            })
            .then(function(text) {
                processSavegame(JSON.parse(text.replace(/\0/g, '')));
            })
            .catch(function(error) {
                console.error("Error loading savegame:", error);
            });
    }
}

fetch('game_info.json')
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Unable to fetch file");
        }
        return response.json();
    })
    .then(function(responseJson) {
        gameInfo = responseJson;
        processGameInfo();
    })
    .catch(function(error) {
        console.error("Error loading game info:", error);
    });
