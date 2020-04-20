
testing = {};
// name_subsystem = "complete"
nodes_2 = {};
links_2 = {};
simulations_2 = {};
colors_2 = {};
var graphs = {};
// var simulation, color, link, node, g, svg;

// Generates a complete graph kn
function generateCompleteGraph(n, graphType) {
    var graph = {};
    // Number of vertices = n
    graph.vCount = n;

    // Number of edges (from Handshake Lemma)
    graph.eCount = (1/2) * n * (n - 1);

    // Generate vertices
    graph.nodes = [];
    for (var i = 0; i < n; i++) {
        graph.nodes.push({"id": i})
    }

    // Generate edges
    graph.links = [];

    if (graphType == "complete") {
        // Using Cartesian Product due to laziness
        // it works, but generates a lot of useless "parallel edges".
        // A better solution would be to generate C(n, 2) combinations.
        for (var u = 0; u < n; u++) {
            for (var v = 0; v < n; v++) {
                if (u != v) {
                    graph.links.push({"target": u, "source": v})
                }
            }
        }
    } else if (graphType == "cyclic") {
        var i;
        for (i = 0; i < n; i++) {
            if (i+1 == n) {
            // console.log(i + " "+1);
            graph.links.push({"target": i, "source": 0})
            continue;
          }
          graph.links.push({"target": i, "source": (i+1)})
        //   console.log(i + " "+(i+1))
        }
    }   
    return graph
}

function draw_graphs(name_subsystem, graph, graphType){  
    var svg = d3.select("#" + name_subsystem),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        color = d3.scaleOrdinal(d3.schemeCategory10);

        //desfault complete graph
        var strength = -1000
        var distance = 200

        if (graphType == "cyclic") {
            strength = -2000
            distance = 1
        } 
        
        var simulation = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody().strength(strength))
        .force("link", d3.forceLink(graph.links).distance(distance))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        // .alphaTarget(1)
        .on("tick", ticked);

    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
        link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
        node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

    nodes_2[name_subsystem] = node;
    links_2[name_subsystem] = link;
    simulations_2[name_subsystem] = simulation;
    colors_2[name_subsystem] = color;

    restart(graph.nodes,graph.links, color,name_subsystem);

    function ticked() {
        // console.log("Testing:" + name_subsystem);
        nodes_2[name_subsystem].attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
    
          links_2[name_subsystem].attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    }
}

function restart(nodes,links, color, name_subsystem) {
    console.log(nodes_2[name_subsystem]+""+ name_subsystem)
  // Apply the general update pattern to the nodes.
  nodes_2[name_subsystem] = nodes_2[name_subsystem].data(nodes, function(d) { return d.id;});
  nodes_2[name_subsystem].exit().remove();
  nodes_2[name_subsystem] = nodes_2[name_subsystem].enter().append("circle").attr("fill", function(d) { return color(d.id); }).attr("r", 8).merge(nodes_2[name_subsystem]);

  // Apply the general update pattern to the links.
  links_2[name_subsystem] = links_2[name_subsystem].data(links, function(d) { return d.source.id + "-" + d.target.id; });
  links_2[name_subsystem].exit().remove();
  links_2[name_subsystem] = links_2[name_subsystem].enter().append("line").merge(links_2[name_subsystem]);

//     // Make nodes draggable
//   d3.selectAll("circle")
//       .call(d3.drag()
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended));

  // Update and restart the simulation.
  simulations_2[name_subsystem].nodes(nodes);
  simulations_2[name_subsystem].force("link").links(links);
  simulations_2[name_subsystem].alpha(1).restart();
//   setTimeout(function() {
//     console.log("Stopping simulation.");
//     simulations_2[name_subsystem].stop();
//   }, 2000)

  function dragstarted(d) {
  if (!d3.event.active) simulations_2[name_subsystem].alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
    }

    function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
    }

    function dragended(d) {
    if (!d3.event.active) simulations_2[name_subsystem].alphaTarget(0);
    d.fx = null;
    d.fy = null;
    }
}


graphs["one"] = generateCompleteGraph(3, "complete")
graphs["two"] = generateCompleteGraph(3, "cyclic")

draw_graphs("complete", graphs["one"], "complete")
draw_graphs("complete_two", graphs["two"], "cyclic")


function incrementGraph() {
    var value = Number(document.getElementById("number_complete").value)
    console.log(typeof value)
    if (value < 0 || !Number.isInteger(value) ) {
        alert("Must be a natural number.");
        return false;
      } else if (value > 100) {
        alert("Sorry value must be less than 100.");
        return false;
      }
    console.log("ObtaineD: " + value)
    // Generate new graph
    // generateCompleteGraph(graph.vCount+1);
    name_subsystem = "complete";
    graphs["one"] = generateCompleteGraph(value, "complete")
    // Update view
    restart(graphs["one"].nodes,graphs["one"].links, colors_2[name_subsystem],name_subsystem);
    // initiateSvg(graph, "#complete")

}


function partialGraph() {
  var value = Number(document.getElementById("number").value)
  console.log(typeof value)
  if (value < 0 || !Number.isInteger(value) ) {
      alert("Must be a natural number.");
      return false;
    } else if (value > 25) {
      alert("Sorry value must be less than 100.");
      return false;
    }
  console.log("ObtaineD: " + value)
  // Generate new graph
  // Update view
  name_subsystem = "complete_two";
  graphs["two"] = generateCompleteGraph(value, "cyclic")
  // Update view
  restart(graphs["two"].nodes,graphs["two"].links, colors_2[name_subsystem],name_subsystem);
  // initiateSvg(graph, "#complete_two")

}

