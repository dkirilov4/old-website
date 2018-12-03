class Panel
{
    /**
     * @member {system}           - Stellar System
     * @member {whichPanel}       - Panel Number
     * 
     * @member {systemDiv}        - Parent Div (D3)
     * @member {infoDiv}          - Info Div (D3)
     * @member {contentDiv}       - Content Div (D3)
     * 
     * @member {svg}              - SVG for Star & Planets
     * @member {contentWidth}     - SVG/Content Width
     * @member {contentHeight}    - SVG/Content Height
     * 
     * @member curPlanet        The Current Planet Index in the Navigator:
     */

    constructor(_system, _whichPanel)
    {
        this.system = _system;
        this.whichPanel = _whichPanel;

        this.curPlanet = 0;
    }

    createPanel()
    {
        this.createDivs();

        this.populateInfoDiv();
        this.populateContentDiv();
    }

    removePanel()
    {
        this.systemDiv.remove();
    }

    createDivs()
    {
        this.systemDiv = d3.select("#all-systems").append("div")
            .attr("class", "system-2d")
            .attr("id", "system" + this.whichPanel);

        this.createInfoDiv();
        this.createContentDiv();
    }

    createInfoDiv()
    {
        var self = this;

        this.infoDiv = this.systemDiv.append("div")
        .attr("class", "system-info")
        .attr("id", "system" + this.whichPanel + "-info");

        this.infoDiv.append("button")
            .attr("class", "btn minus")
            .on("click", () => this.removePanel() )
            .append("i")
            .attr("class", "fa fa-close")

        this.infoDiv.append("span")
            .attr("class", "btn drag")
            .append("i")
            .attr("class", "fa fa-arrows")

        this.infoDiv.append("button")
            .attr("class", "btn right-arrow")
            .on("click", function() { self.gotoNextPlanet(1) })
            .append("i")
            .attr("class", "fa fa-arrow-right")

        this.infoDiv.append("button")
            .attr("class", "btn left-arrow")
            .on("click", function() { self.gotoNextPlanet(-1) })
            .append("i")
            .attr("class", "fa fa-arrow-left")

        this.infoDiv.select(".left-arrow").style("opacity", 0.3)
        this.infoDiv.select(".left-arrow").style("cursor", "default")

        this.infoDiv.append("p")
            .attr("class", "system-text-main");

        this.infoDiv.append("p")
            .attr("class", "system-text-sub1");
        this.infoDiv.append("p")
            .attr("class", "system-text-sub2");
        this.infoDiv.append("p")
            .attr("class", "system-text-sub3");
    }

    // DirectioN:  1: Right
    // Direction: -1: Left
    gotoNextPlanet(dir)
    {
        console.log("@gotoNextPlanet")
        // Get all Planets:
        var planets = this.contentDiv.selectAll(".planet").nodes();

        // Increment/Decrement Current Planet:
        this.curPlanet += dir;
        this.curPlanet = clamp(this.curPlanet, 0, planets.length - 1)

        // Gray out Buttons:
        if (this.curPlanet == 0) {
            this.infoDiv.select(".left-arrow").style("opacity", 0.3)
            this.infoDiv.select(".left-arrow").style("cursor", "default")
        } else if (this.curPlanet == planets.length - 1) {
            this.infoDiv.select(".right-arrow").style("opacity", 0.3)
            this.infoDiv.select(".right-arrow").style("cursor", "default")
        } else {
            this.infoDiv.select(".left-arrow").style("opacity", 1)
            this.infoDiv.select(".right-arrow").style("opacity", 1)
            this.infoDiv.select(".left-arrow").style("cursor", "pointer")
            this.infoDiv.select(".right-arrow").style("cursor", "pointer")
        }

        // Remove Previous Marker:
        this.contentDiv.select("#planet-marker").remove();

        // Draw Marker:
        var x = planets[this.curPlanet].x.baseVal.value;
        var y = planets[this.curPlanet].y.baseVal.value;
        var h = planets[this.curPlanet].height.baseVal.value

        this.svg.append('text')
            .text(function(d) { return '\uf0d7' })
            .attr("id", "planet-marker")
            .attr('font-family', 'FontAwesome')
            .attr('font-size', 16 + "px")
            .attr("x", x + h/2 - 5)
            .attr("y", y + (h) - 20)
            .style("fill", "green");

            
        // Move Scrollbar:
        
        var offset = this.contentDiv.node().clientWidth / 2;
        console.log(offset)

        x = clamp((x - offset), 0, this.contentWidth);

        this.contentDiv.node().scrollLeft = x;
    }

    createContentDiv()
    {
        this.contentDiv = this.systemDiv.append("div")
            .attr("class", "system-content");
    }

    populateInfoDiv()
    {
        // Name:
        this.infoDiv.select(".system-text-main").node().innerText = this.system.St_Name;
        // Age:
        this.infoDiv.select(".system-text-sub1").node().innerText = "Age: " + this.system.St_Age + " GY";
        // Distance:
        this.infoDiv.select(".system-text-sub2").node().innerText = "Distance: " + this.system.St_Distance + " AU";
        // Planets:
        this.infoDiv.select(".system-text-sub3").node().innerText = "Planets: " + this.system.Planets.length;
    }

    populateContentDiv()
    {
        // Create SVG:
        this.contentWidth  = CONTENT_WIDTH;
        this.contentHeight = this.contentDiv.node().clientHeight;
    
        this.svg = this.contentDiv.append("svg")
            .attr("width", this.contentWidth)
            .attr("height", this.contentHeight);

        // Star:
       this.createStar();

       // Habitable Zone:
       this.createHabitableZone();

       // Planets
       this.createPlanets();

       // Ruler
       this.createRuler();
    }

    //
    // Star:
    //
    createStar()
    {
        var self = this;

        var starGroup = this.svg.append("g")
            .attr("class", "star-group");

        var size = this.getScaledStarSize();

        starGroup.append("svg:image")
            .attr("class", "star")
            .attr("xlink:href", "./assets/star " + getSpectralType(this.system) + " full.png")
            .attr("height", size)
            .attr("width", size)
            .attr("y", this.contentHeight / 2 - size / 2)
            .on("mouseover", function() {self.handleStarMouseOver(this, self.system) })
            .on("mouseout", function() {self.handlePlanetMouseOut(this, self.system) })

        // this.svg.append("text")
        //     .text("Star Scale: " + Math.floor(scaledStarInfo.multiplier) + "x")
        //     .attr("class", "system-text-sub1")
        //     .attr("y", contentHeight)
    }

    getScaledStarSize()
    {
        var minSize = this.contentHeight / 10;

        var starSize = +this.system.St_RadiusSolar || 0;
        return scale(starSize, MIN_SOLAR_RADIUS, MAX_SOLAR_RADIUS, minSize, this.contentHeight);
    }

    // Habitable Zone:
    createHabitableZone()
    {
        // Inner Edge = 0.95 * (Luminosity of Star / Luminosity of our Sun) AU
        // Outer Edge = 1.60 * (Luminosity of Star / Luminosity of our Sun) AU
    
        if (this.system.St_HabitableInner != "NA" && this.system.St_HabitableInner != "NA")
        {
            this.svg.append("rect")
            .attr("width", this.AUtoPixels(this.system.St_HabitableOuter) - this.AUtoPixels(this.system.St_HabitableInner))
            .attr("height", this.contentHeight)
            .attr("x", this.AUtoPixels(this.system.St_HabitableInner))
            .attr("y", 0)
            .style("fill", "green")
            .style("opacity", 0.3)
        }
    }

    //
    // Planets:
    //
    createPlanets()
    {
        var self = this;

        var planetsGroup = this.svg.append("g")
            .attr("class", "planets-group");

        this.system.Planets.forEach(planet => {
            var distance = this.getScaledPlanetDistance(planet);
            var size = this.getScaledPlanetSize(planet);

            var x = distance + calculateSolarSystemStarSize();
            var y = this.contentHeight / 2 - size / 2;

            planetsGroup.append("svg:image")
                .attr("class", "planet")
                .attr("xlink:href", getPlanetTexture(planet))
                .attr("x", x)
                .attr("y", y)
                .attr("width", size)
                .attr("height", size)
                .on("mouseover", function() {self.handlePlanetMouseOver(this, planet) })
                .on("mouseout", function() {self.handlePlanetMouseOut(this, planet) })
        });
    }

    getScaledPlanetDistance(planet)
    {
        if (planet.Pl_SemiMajorAxis == "NA" || planet.Pl_SemiMajorAxis == "N/A")
            return 0;
        else
            return scale(planet.Pl_SemiMajorAxis, 0, 2500, 0, this.contentWidth - this.contentHeight);
    }

    getScaledPlanetSize(planet)
    {
        var minSize = this.contentHeight / 10;

        return scale(planet.Pl_RadiusEarth, MIN_PLANET_RADIUS, MAX_PLANET_RADIUS, minSize, this.contentHeight);
    }

    
    handlePlanetMouseOver(d, planet)
    {
        toolTip.html("");

        toolTip.transition()
            .duration(250)
            .style("opacity", 0.9)

        toolTip
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 20) + "px")

        // Name:
        toolTip.append("text")
            .text(function() {
                var planetName = planet.Pl_Name;
                if (planet.Pl_Letter != "NA" || planet.Pl_Letter != "N/A")
                    planetName + " " + planet.Pl_Letter

                return planetName;
             })
             .attr("class", "tooltip-text-title")

        // Discovery Method + Discovery Year
        toolTip.append("br")
        toolTip.append("text").text("Discovery: ").attr("class", "tooltip-text-main")
        toolTip.append("text")
             .text(function() {
                 var discovery = planet.Pl_DiscoveryMethod
                 if (planet.Pl_DiscoveryYear != "NA" || planet.Pl_DiscoveryYear != "N/A")
                    discovery + " (" + planet.Pl_DiscoveryYear + ")"
                
                return discovery;
             }).attr("class", "tooltip-text-sub")
             

        // Semi Major Axis
        toolTip.append("br")
        toolTip.append("text").text("Semi Major Axis: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(planet.Pl_SemiMajorAxis + " AU").attr("class", "tooltip-text-sub")

        // Radius Earth
        toolTip.append("br")
        toolTip.append("text").text("Radius Earth: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(planet.Pl_RadiusEarth + " Earth Radii").attr("class", "tooltip-text-sub")
        
        // Mass Earth
        toolTip.append("br")
        toolTip.append("text").text("Mass Earth: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(planet.Pl_MassEarth + " Earth Mass").attr("class", "tooltip-text-sub")

        // Orbital Period
        toolTip.append("br")
        toolTip.append("text").text("Orbital Period: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(planet.Pl_OrbitalPeriod + " Days").attr("class", "tooltip-text-sub")
        
        // Density
        toolTip.append("br")
        toolTip.append("text").text("Density: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(planet.Pl_Density + " g/cm^3").attr("class", "tooltip-text-sub")
        
        // Eccentricity
        toolTip.append("br")
        toolTip.append("text").text("Eccentricity: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(planet.Eccentricity).attr("class", "tooltip-text-sub")

        // Equilibrium Temperature
        toolTip.append("br")
        toolTip.append("text").text("Equilibrium Temp: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(planet.Pl_EquilibriumTemp + " K").attr("class", "tooltip-text-sub")
    }

    handleStarMouseOver(d, star)
    {
        toolTip.html("");

        toolTip.transition()
            .duration(250)
            .style("opacity", 0.9)

        toolTip
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 20) + "px")

        // Name:
        toolTip.append("text")
        .text(star.St_Name)
        .attr("class", "tooltip-text-title")

        // Age:
        toolTip.append("br")
        toolTip.append("text").text("Age: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(star.St_Age + " GY").attr("class", "tooltip-text-sub")

        // Distance:
        toolTip.append("br")
        toolTip.append("text").text("Distance: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(star.St_Distance + " pc").attr("class", "tooltip-text-sub")

        // Temp:
        toolTip.append("br")
        toolTip.append("text").text("Temperature: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(star.St_EffectiveTemp + " K").attr("class", "tooltip-text-sub")

        // Luminosity: 
        toolTip.append("br")
        toolTip.append("text").text("Luminosity: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(star.St_Luminosity + " Solar Lum.").attr("class", "tooltip-text-sub")

        // Mass: 
        toolTip.append("br")
        toolTip.append("text").text("Mass: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(star.St_MassSolar + " Solar Mass").attr("class", "tooltip-text-sub")

        // Radius: 
        toolTip.append("br")
        toolTip.append("text").text("Radius: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(star.St_RadiusSolar + " Solar Radius").attr("class", "tooltip-text-sub")

        // Spectral Type: 
        toolTip.append("br")
        toolTip.append("text").text("Spectral Type: ").attr("class", "tooltip-text-main")
        toolTip.append("text").text(star.St_SpectralType).attr("class", "tooltip-text-sub")
    }

    handlePlanetMouseOut(d)
    {

        toolTip.transition()
            .duration(500)
            .style("opacity", 0)
    }

    //
    // Ruler:
    //
    createRuler()
    {
        // Length of 1 AU in Pixels:
        var auLength = Math.floor(calculateAuLength());

        // Size of our Sun:
        var sunSize = calculateSolarSystemStarSize();

        // Ruler Width & Height:
        var rulerWidth  = this.contentWidth - sunSize;

        // Create Base:
        var ruler = this.svg.append("g")
            .attr("class", "ruler");

        var base = ruler.append("line")
            .attr("class", "ruler-base")
            .attr("x1", sunSize)
            .attr("y1", 0)
            .attr("x2", sunSize + this.contentWidth)
            .attr("y2", 0)
            .style("stroke", "white")

        // Create Ticks:
        var ticks = ruler.append("g")
            .attr("class", "ruler-ticks")

        var majorTickWidth  = 2;
        var majorTickHeight = 10;
        // var majorTickSpacing = auLength;

        var minorTickWidth  = 1;
        var minorTickHeight = 6;
        var minorTickSpacing = Math.floor(auLength/4)
        var majorTickSpacing = minorTickSpacing * 4;

        for (var i = 0; i < rulerWidth; i += minorTickSpacing)
        {
            if (i % majorTickSpacing == 0)
            {
                ticks.append("rect")
                    .attr("class", "tick-major")
                    .attr("width", majorTickWidth)
                    .attr("height", majorTickHeight)
                    .attr("x", i + sunSize)
                    .attr("y", 0)
                    .style("fill", "white")

                ticks.append("text")
                    .attr("class", "tick-major-label")
                    .text(Math.floor(i / majorTickSpacing) + " AU")
                    .attr("x", i + sunSize)
                    .attr("y", 12 + majorTickHeight)
                    .attr("font-size", "12px")
                    .attr("fill", "white")
                    .attr("text-anchor", "middle")
                
            } else if (i % minorTickSpacing == 0)
            {
                ticks.append("rect")
                .attr("class", "tick-minor")
                .attr("width", minorTickWidth)
                .attr("height", minorTickHeight)
                .attr("x", i + sunSize)
                .attr("y", 0)
                .style("fill", "white")
            }
        }
        
        // d3.selectAll(".tick-major").attr("display", "none")
        // d3.selectAll(".tick-major-label").attr("display", "none")
        // d3.selectAll(".tick-minor").attr("display", "none")
    }

    // General:
    AUtoPixels(au)
    {
        return scale(au, 0, 2500, 0, this.contentWidth)
    }
}