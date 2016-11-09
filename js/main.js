/* 2016 
 * Tommy Dang (on the TxDot project, as Assistant professor, iDVL@TTU)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */



var margin = {top: 20, right: 80, bottom: 60, left: 120},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#graphContainer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var colorGreenRed = d3.scale.linear()
    .domain([0, 25])
    .range(["#0f0", "#f00"]);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var color =  colorGreenRed(d.y);
    var html = "#Punchouts per Mile: <span style='color:"+color+"; font-weight: bold'>" + parseFloat(d.y).toFixed(2) + "</span><br>";
    html += "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; Age (months):  <span style='color:white; font-weight: bold'>" + d.x + "</span>";

    return html;
  })
svg.call(tip);

var rowIndexStress = 9;
var row1 = [];
var rows = [];

function main(){
  d3.tsv("data/stress.csv", function(error, data) {
    if (error) throw error;

    rowIndexStress = 9;
    row1 = [];
    rows = [];

    row1.push( 1 );
    row1.push( row1[0]/ 12 );
    row1.push( +document.getElementById("F8").value);
    row1.push( 57000 / 7.5 * row1[2] / 1000 );
    row1.push( +data[rowIndexStress-2]["STR (T)"] );
    row1.push( data[rowIndexStress-2]["STR (E)"] * row1[3] / 5000 )
    row1.push( row1[4] + row1[5] )
    row1.push( row1[6] / row1[2] )
    row1.push( 11800 * Math.pow(row1[7],fatigue(+document.getElementById("F19").value)) )
    row1.push( lane(+document.getElementById("C24").value) 
      * document.getElementById("C25").value * 1000000 / 12 / document.getElementById("C18").value )
    row1.push( row1[9] / row1[8] )
    row1.push( row1[10] )
    row1.push( 18.985 / (1 + 5 * Math.pow(row1[11],-1.1)) )
    rows.push(row1);    // Add to the array

    //console.log(+document.getElementById("C18").value);
    for (var i=0; i<+document.getElementById("C18").value;i++){
      //debugger;
      if (i!=0)
        rowIndexStress = 8;
      for (var j=0;j<12; j++){
        if (i==0 && j==0)
          ;
          //If counterYear = 1 And counterMonth = 1 Then
          //      'If First Year than Omit Calculation of First Month, Already Done
        else {
          rowIndexStress = rowIndexStress + 1
          var row2 = [];
          row2.push( row1[0] + 1 )
          row2.push( row2[0]/ 12 );
          // Cells(rowIndex, 2) = Cells(rowIndex, 1).Value / 12
          row2.push( document.getElementById("F8").value
            * Math.pow((30 * row2[0] / (4 + 0.85 * 30 * row2[0])), 0.5) );
          // Cells(rowIndex, 3) = Sheets("Input").Range("F8").Value * ((30 * Cells(rowIndex, 1).Value / (4 + 0.85 * 30 * Cells(rowIndex, 1).Value))) ^ 0.5
          row2.push( 57000 / 7.5 * row2[2] / 1000 );
          // Cells(rowIndex, 4) = 57000 / 7.5 * Cells(rowIndex, 3) / 1000
          row2.push( +data[rowIndexStress-2]["STR (T)"] );
          // Cells(rowIndex, 5) = Sheets("Stress").Cells(rowIndexStress, 38).Value
          row2.push( data[rowIndexStress-2]["STR (E)"] * row2[3] / 5000 );
          // Cells(rowIndex, 6) = Sheets("Stress").Cells(rowIndexStress, 39).Value * Cells(rowIndex, 4) / 5000
          row2.push( row2[4] + row2[5] );
          // Cells(rowIndex, 7) = Cells(rowIndex, 5).Value + Cells(rowIndex, 6).Value
          row2.push( row2[6] / row2[2] );
          // Cells(rowIndex, 8) = Cells(rowIndex, 7).Value / Cells(rowIndex, 3).Value
          row2.push( 11800 * Math.pow(row2[7],fatigue(+document.getElementById("F19").value)) );
          // Cells(rowIndex, 9) = 11800 * Cells(rowIndex, 8).Value ^ fatigue(Sheets("Input").Range("F19").Value)
          row2.push( row1[9] );
          // Cells(rowIndex, 10) = Cells(rowIndex - 1, 10).Value
          row2.push( row2[9] / row2[8] );
          // Cells(rowIndex, 11) = Cells(rowIndex, 10).Value / Cells(rowIndex, 9).Value
          row2.push( row1[11] + row2[10] )
          // Cells(rowIndex, 12) = Cells(rowIndex - 1, 12).Value + Cells(rowIndex, 11).Value
          row2.push( 18.985 / (1 + 5 * Math.pow(row2[11],-1.1)) )
          // Cells(rowIndex, 13) = 18.985 / (1 + 5 * Cells(rowIndex, 12).Value ^ -1.1)
          if (rowIndexStress == 13)
            rowIndexStress = 1
          rows.push(row2);
          row1=row2;
        }
      }   
    }
    tableCreate();
    drawGraph();
  });   
}

function drawGraph(){
  var dataset =[];
  for (var i=0;i<rows.length;i++){
    var obj={};
    obj.x = rows[i][0];
    obj.y = rows[i][12];  
    dataset.push(obj);  
  }

var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d){ return d.x; })])
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d){ return d.y; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

var line = d3.svg.line()
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
  
  // Labelling x-axis
  svg.append("text")
    .attr("class", "xAxisText")
    .style("text-anchor", "middle")
    .style("text-shadow", "1px 1px 0 rgba(200, 200, 200, 0.7")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")  
    .attr("x", width/2)
    .attr("y", height+40)
    .text("Age (months)");
   svg.append("g").attr("transform","translate("+(-50)+","+height/2+")"+" rotate(-90)")
    .append("text")
      .attr("class", "YAxisText")
      .style("text-anchor", "middle")
      .style("text-shadow", "1px 1px 0 rgba(200, 200, 200, 0.7")
      .attr("font-family", "sans-serif")
      .attr("font-size", "16px")  
      .attr("x", 0)
      .attr("y", 0)
      .text("Number of Punchouts per Mile");
        
        
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  svg.append("path")
      .data([dataset])
      .attr("class", "line")
      .attr("d", line);    

  svg.selectAll(".point")
    .data(dataset).enter()
      .append("circle")
      .attr("class", "point")
      .attr("r", 4)
      .attr("cx", function(d){ return xScale(d.x);})
      .attr("cy", function(d){ return yScale(d.y);})
      .attr("fill", function(d){ return colorGreenRed(d.y);})
      .attr("stroke-width", 0.5) 
      .attr("stroke","#000")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide) ;
}
