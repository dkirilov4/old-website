const MIN_SOLAR_RADIUS = 0.04;
const MAX_SOLAR_RADIUS = 71.23;

const MIN_PLANET_RADIUS = 0.336;
const MAX_PLANET_RADIUS = 77.342;

const CONTENT_WIDTH = 2500000;

const TEXTURED_PLANETS = ["earth", "jupiter", "mars", "mercury", "neptune", "saturn", "uranus", "venus", "tau cet e", "tau cet f", 
                              "trappist-1 b", "trappist-1 c", "trappist-1 d", "trappist-1 e", "trappist-1 f", "trappist-1 g", "trappist-1 h"]

var lengthAU;

// Data:
var systems;

// Panels:
var panels = [];
var contentWidth;
var contentHeight;

var solarSystem, p2, p3;

// Scaling:
var distanceScale = 100;

// Selector:
var select;

var toolTip;
var createBtn;
var creationMenu;
var creationMenuShown = false;

function init()
{
    for (const key in systems)
    {
        var e = systems[key];

        e.St_HabitableInner = "NA";
        e.St_HabitableOuter = "NA";

        if (e.St_Luminosity != "NA" && e.St_Luminosity != "N/A")
        {
            //inner edge of the hab zone = 0.95 * (Luminosity of this star / Luminosity of our sun) in astronomical units
            //outer edge of the hab zone  = 1.4 * (Luminosity of this star / Luminosity of our sun) in astronomical units
            var luminosity = Math.pow(10, e.St_Luminosity);

            e.St_HabitableInner = luminosity * 0.95;
            e.St_HabitableOuter = luminosity * 1.60;
        }

    }

    toolTip = d3.select("#main").append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("text-align", "center")

    createBtn = d3.select(".create-btn");

    creationMenu = d3.select("#creationMenu")
        .style("opacity", 0)
    //     .attr("id", "creationMenu")
    //     .style("opacity", 0)
    
    // makeCreationForm();


    createSelectorBox();
    create2DPanels();
    addDraggability();
}


function createSelectorBox()
{
    $(".dropdown-select").select2({
        placeholder: 'Select a System:',
        data: Object.keys(systems)
    });
}

function create2DPanels()
{
    solarSystem = new Panel(systems["Sun"], panels.length);
    solarSystem.createPanel();
    panels.push(solarSystem);

    p2 = new Panel(systems["TRAPPIST-1"], panels.length);
    p2.createPanel();
    panels.push(p2);

    p3 = new Panel(systems["tau Cet"], panels.length);
    p3.createPanel();
    panels.push(p3);
}

function addDraggability()
{
    $("#all-systems").sortable({
        placeHolder: "system-placeholder",
        handle: ".drag",
        axis: "y",
        revert: true,
        scroll: false,
        
        cursor: "move",
    })
}

function calculateAuLength()
{
    return solarSystem.getScaledPlanetDistance(systems["Sun"].Planets[2]);
}

function calculateSolarSystemStarSize()
{
    var minSize = solarSystem.contentHeight / 10;

    return scale(solarSystem.system.St_RadiusSolar, MIN_SOLAR_RADIUS, MAX_SOLAR_RADIUS, minSize, solarSystem.contentHeight);
}




function addSystemPanel()
{
    var newSystem = systems[$("#dropdown-select").val()];

    var p = new Panel(newSystem, panels.length);
    p.createPanel();
    panels.push(p);
}

function sortSystemList()
{
    var sortOption = $("input[name='sort']:checked").val();

    if (sortOption == "Most Planets")
    {
        var sortedSystems = sortByMostPlanets();

        $('select').select2().empty().select2({data: sortedSystems});
    } else if (sortOption == "Most Habitable Planets")
    {
        var sortedSystems = sortByMostHabitablePlanets();

        $('select').select2().empty().select2({data: sortedSystems});
    }
}

function sortByMostPlanets()
{
    var sortedSystems;

    sortedSystems = Object.keys(systems).sort(function(a, b)
    {
        if (systems[a].Planets.length > systems[b].Planets.length) {return -1 }
        if (systems[a].Planets.length < systems[b].Planets.length) {return 1 }
        return 0;
    })

    return sortedSystems;
}

function sortByMostHabitablePlanets()
{
    var sortedSystems;

    sortedSystems = Object.keys(systems).sort(function(a, b)
    {
        var numHabitablePlanets_a = 0;
        var numHabitablePlanets_b = 0;

        var planets = systems[a].Planets;
        var hi = systems[a].St_HabitableInner;
        var ho = systems[a].St_HabitableOuter;

        for (var i = 0; i < planets.length; i++)
        {
            var sa = planets[i].Pl_SemiMajorAxis;

            if (sa != "NA" || sa != "N/A" || hi != "NA" || ho != "NA")
            {
                if (sa >= hi && sa <= ho)
                    numHabitablePlanets_a++;
            }
        }

        var planets = systems[b].Planets;
        var hi = systems[b].St_HabitableInner;
        var ho = systems[b].St_HabitableOuter;

        for (var i = 0; i < planets.length; i++)
        {
            var sa = planets[i].Pl_SemiMajorAxis;

            if (sa != "NA" || sa != "N/A" || hi != "NA" || ho != "NA")
            {
                if (sa >= hi && sa <= ho)
                    numHabitablePlanets_b++;
            }
        }

        if (numHabitablePlanets_a > numHabitablePlanets_b) {return -1 }
        if (numHabitablePlanets_a < numHabitablePlanets_b) {return 1 }
        return 0;
    })

    return sortedSystems;
}

function toggleCreationMenu()
{
    console.log("@toggleCreationMenu")
    creationMenuShown = !creationMenuShown;

    if (creationMenuShown) {

        creationMenu.transition()
            .duration(250)
            .style("opacity", 0.9)

        creationMenu
            .style("left", (createBtn.node().offsetLeft - 10) + "px")
            .style("top", (createBtn.node().offsetTop + createBtn.node().clientHeight + 10) + "px")

        var forms = document.getElementsByClassName("input-form");
        for (var i = 0; i < forms.length; i++)
        {
            forms[i].value = ""
        }

        

    } else {
        creationMenu.style("opacity", 0)
    }
}

function addPlanetToNewSystem(){

}

function addStarToNewSystem(){

}




function scale (num, in_min, in_max, out_min, out_max)
{
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function clamp(num, min, max) {
    if      (num < min) { return min }
    else if (num > max) { return max }
    else                { return num }
  }

/**
 * @param planet {object} planet object from the solar system data
 */
function getPlanetTexture(planet)
{
    var path;

    if (TEXTURED_PLANETS.includes(planet.Pl_Name.toLowerCase())) {
        path = "./assets/" + planet.Pl_Name.toLowerCase() + ".png"
    } else
    {
        var closestPlanet = TEXTURED_PLANETS[0];
        var minDistance = Infinity;

        TEXTURED_PLANETS.forEach(p => {
            var a = getSystemContainingPlanet(p).planet;

            var curDistance = comparePlanetSimilarity(a, planet)
            if (curDistance < minDistance) {
                closestPlanet = p;
                minDistance = curDistance;
            } 
        });

        path = "./assets/" + closestPlanet + ".png"
        // path = "./assets/" + "trappist-1 e" + ".png";
    }

    return path;

    // $.ajax({
    //     url: "./assets/" + planet.Pl_Name + ".png",
    //     type: "HEAD",
    //     async: false,
    //     error: function()
    //     {
    //         path = "./assets/" + "trappist-1 e" + ".png";
    //     },
    //     success: function()
    //     {
    //         path = "./assets/" + planet.Pl_Name + ".png";
    //     }
    // });
}

function comparePlanetSimilarity(a, b)
{
    // Weights:
    var w_density = 1;
    var w_mass = 10;
    var w_radius = 10;
    var w_semimajor = 5;

    // Scores:
    var s_density = 0;
    var s_mass = 0;
    var s_radius = 0;
    var s_semimajor = 0;

    // Get Differences:

    // Density
    if (a.Pl_Density != "N/A" && b.Pl_Density != "N/A" && a.Pl_Density != "NA" && b.Pl_Density != "NA") {
        s_density = (a.Pl_Density - b.Pl_Density) * w_density;
        s_density *= s_density;
    }

    // Mass
    if (a.Pl_MassEarth != "N/A" && b.Pl_MassEarth != "N/A" && a.Pl_MassEarth != "NA" && b.Pl_MassEarth != "NA") {
        s_mass = Math.abs(a.Pl_MassEarth - b.Pl_MassEarth) * w_mass;
        s_mass *= s_mass;
    }

    // Radius
    if (a.Pl_RadiusEarth != "N/A" && b.Pl_RadiusEarth != "N/A" && a.Pl_RadiusEarth != "NA" && b.Pl_RadiusEarth != "NA") {
        s_radius = Math.abs(a.Pl_RadiusEarth - b.Pl_RadiusEarth) * w_radius;
        s_radius *= s_radius;
    }

    // Semi Major Axis
    if (a.Pl_SemiMajorAxis != "N/A" && b.Pl_SemiMajorAxis != "N/A" && a.Pl_SemiMajorAxis != "NA" && b.Pl_SemiMajorAxis != "NA") {
        s_semimajor = Math.abs(a.Pl_SemiMajorAxis - b.Pl_SemiMajorAxis) * w_semimajor;
        s_semimajor *= s_semimajor;
    }

    // Calculate Distance: Smaller -> Closer
    // console.log("Density: " + s_density, "Mass: " + s_mass, "Radius: " + s_radius, "Semi-Major: " + s_semimajor)
    var dist = Math.sqrt(s_density + s_mass + s_radius + s_semimajor);
    // console.log(a.Pl_Name, b.Pl_Name, dist)

    return dist;
}

/**
 * @param system {object} solar system object
*/
function getSpectralType(system)
{
    var spectralType = "";
    if (system.St_SpectralType != "")
        spectralType = system.St_SpectralType[0];
    else if (system.St_Effective_Temp != "NA")
        spectralType = getSpectralTypeFromTemperature(system.St_EffectiveTemp);
    
    return spectralType;
}

/**
 * @param temp {number} temperature in K
*/
function getSpectralTypeFromTemperature(temp)
{
    if (temp < 3500)
        return "M";
    else if (temp >= 3500 && temp < 5000)
        return "K"
    else if (temp >= 5000 && temp < 6000)
        return "G";
    else if (temp >= 6000 && temp < 7500)
        return "F"
    else if (temp >= 7500 && temp < 10000)
        return "A"
    else if (temp >= 10000 && temp < 28000)
        return "B"
    else if (temp >= 28000)
        return "O"
}

/**
 * @param field {string} string corresponding to a field in the systems.Planets objects
*/
function getPlanetsSummary(field)
{
    var sysMin= systems[Object.keys(systems)[0]]
    var sysMax = systems[Object.keys(systems)[0]]
    var min = Infinity;
    var max = -1;

    // loop through systems:
    for (const key in systems) {
        if (systems.hasOwnProperty(key)) {
            const e = systems[key];

            // loop through planets in system:
            for (var i = 0; i < e.Planets.length; i++) 
            {
                // max:
                if (e.Planets[i][field] > max) {
                    max = e.Planets[i][field]
                    sysMax = e;
                }

                // min:
                if (e.Planets[i][field] < min) {
                    min = e.Planets[i][field]
                    sysMin = e;
                }
                    
            }
        }
    }

    return {systemMax: sysMax, max: max, systemMin: sysMin, min: min}
}

/**
 * @param field {string} string corresponding to a field in the systems.Planets objects
*/
function getSystemsSummary(field)
{
    var sysMin= systems[Object.keys(systems)[0]]
    var sysMax = systems[Object.keys(systems)[0]]
    var min = Infinity;
    var max = -1;

    // loop through systems:
    for (const key in systems) {
        if (systems.hasOwnProperty(key)) {
            const e = systems[key];

            // max
            if (e[field] > max) {
                max = e[field]
                sysMax = e;
            }

            // min:
            if (e[field] < min) {
                min = e[field]
                sysMin = e;
            }
        }
    }

    return {systemMax: sysMax, max: max, systemMin: sysMin, min: min}
}

function getSystemContainingPlanet(planetName)
{
    planetName = planetName.toLowerCase();

    var planet;
    var system;

    for (const key in systems) {
        const s = systems[key];

        for (var i = 0; i < s.Planets.length; i++) {
            if (s.Planets[i].Pl_Name.toLowerCase() == planetName) {
                planet = s.Planets[i];
                system = s;
                break;
            }
        }    
    }

    return {system: system, planet: planet};
}


/**
 * @param system {object} which system to get the summary for
 * @param field {string} string corresponding to a field in the systems.Planets objects
*/
function getSystemPlanetsSummary(system, field)
{
    var min = Infinity;
    var max = -1;

    for (var i = 0; i < system.Planets.length; i++) 
    {
        // max:
        if (system.Planets[i][field] > max) {
            max = system.Planets[i][field]
        }

        // min:
        if (system.Planets[i][field] < min) {
            min = system.Planets[i][field]
        }  
    }

    return {min: min, max: max}
}

$.getJSON("data/ss.json", function(data) {
    systems = data;

    init();
});