// Exemples utilisés :
// pour les infobulles : http://bl.ocks.org/lhoworko/7753a11efc189a936371
// pour le zoom/pan : https://bl.ocks.org/mbostock/eec4a6cda2f573574a11

/*// code javascript de la carte
$(function() {
	init();
});

function init() {*/
	
	// STRUCTURES
	
	// titre
/*	var titre = "<p>Superposition des lieux</p>";
	document.getElementById("titre").innerHTML = titre;
	// pied de page
	var footer = "<p>TERESMA - carte test</p>";
	document.getElementById("footer").innerHTML = footer;*/

//}

	// DONNEES


	
	// VARIABLES
	var width = 500,
    	height = 500;
    	//scale0 = (width - 1) / 2 / Math.PI;
    	scale0 = 6000
    	
    var zoom = d3.behavior.zoom()
    	//.translate([width / 2, height / 2])
    	.translate([350, 0])
    	.scale(scale0)
    	//.scaleExtent([scale0, 8 * scale0])
    	.on("zoom", zoomed);
    
    var svg = d3.select("#carte")
    	.append("svg")
    	.attr("width", width)
    	.attr("height", height);
    	
    var tooltip = d3.select('body').append('div')
            .attr('class', 'hidden tooltip');
            
    var projection = d3.geo.conicConformal() // Lambert-93
    	.center([2.454071, 47.279229]) // On centre la carte
    	//.scale(6000)
    	//.translate([350, 0]);
 
	var path = d3.geo.path()
		.projection(projection);
	
	// échelle de couleur pour les lieux
	var color = d3.scale.linear()
		.domain([1, 10])
		.range(["#f7fcf5", "#00441b"]);

//	g = svg.append("g");
	
	svg
    	.call(zoom)
    	.call(zoom.event);
    	
    queue()
    	.defer(d3.json, 'json/lieux_aplat.geojson')
    	.defer(d3.json, 'json/lieux.geojson')
    	.defer(d3.json, 'json/lieux_centroides.geojson')
    	.await(afficheCarte);
	
/*	// LANCEMENT
	afficheCarte();*/
	
//}


function afficheCarte(error, lieux_aplat, lieux, lieux_centroides) {
	
	console.log("hop");
	
//	if(error) { console.log(error); }
	
	svg.append('path')
		.data(lieux_aplat.features)
/*		.enter()
		.append('path')*/
		.attr("d", path)
		.attr("class", "lieux_aplat")
		.style("fill", function (d) {
			var value = d.properties.nb_lieux
			if (value) {
				return color(value)
			} else {
				return "#ccc"
			}
		});
	
	svg.selectAll('.lieux')
		.data(lieux.features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("class", "lieux")
		.on('mousemove', function (d) {
			var mouse = d3.mouse(svg.node()).map(function (d) {
				return parseInt(d);
			});
			tooltip.classed('hidden', false)
				.attr('style', 'left:' + (mouse[0] + 20) + 'px; top:' + (mouse[1] + 20) + 'px')
				.html(d.properties.lieu);
		})
		.on('mouseout', function () {
			tooltip.classed('hidden', true);
		});

	svg.selectAll('.lieux_centroides')
		.data(lieux_centroides.features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("class", "lieux_centroides")
		.style("fill", "black")
		.attr("r", 0.1);

	console.log("hup");
}


function zoomed() {
  projection
      .translate(zoom.translate())
      .scale(zoom.scale());

  svg.selectAll("path")
      .attr("d", path);
}
	