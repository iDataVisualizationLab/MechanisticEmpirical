/* 2016 
 * Tommy Dang (on the Scagnostics project, as Assistant professor, iDVL@TTU)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */


function main(){
  console.log("I am here main()");
  tableCreate();
}



function tableCreate() {
  // Set readonlye for imputs
  document.getElementById("F13").readOnly = true;
  document.getElementById("F14").readOnly = true;
  document.getElementById("F15").readOnly = true;
  document.getElementById("F16").readOnly = true;
  document.getElementById("F17").readOnly = true;
  document.getElementById("F19").readOnly = true;

  document.getElementById("F7").readOnly = true;
  document.getElementById("F8").readOnly = true;

  document.getElementById("C18").readOnly = true;
  document.getElementById("C19").readOnly = true;
  document.getElementById("C24").readOnly = true;
  document.getElementById("C25").readOnly = true;

 // document.getElementById("submitButton").disabled = true;

  d3.tsv("data/stress.csv", function(error, data) {
    if (error) throw error;


    var rowIndexStress = 9;
    var row1 = [];
    var rows = [];

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

  // Compute color scale
  var minArray = [];
  var maxArray = [];    
  for (var j=0; j<rows[0].length; j++){
    minArray.push(1000000000);
    maxArray.push(0);
  }  
  for (var i=0;i<rows.length;i++){
    for (var j=0;j<rows[i].length;j++){
      if (rows[i][j]>maxArray[j])
        maxArray[j] = rows[i][j];
      if (rows[i][j]<minArray[j])
        minArray[j] = rows[i][j];
    }  
  }
  var colorRedBlues = [];
  for (var j=0; j<rows[0].length; j++){
    var colorScale = d3.scale.linear()
      .domain([minArray[j], (minArray[j]+maxArray[j])/2, maxArray[j]])
      .range(["#55f", "white", "#f55"]);
    colorRedBlues.push(colorScale);  
  }       

  var colorGreenRed = d3.scale.linear()
    .domain([0, 25])
    .range(["#0f0", "#f00"]);
 
  // Final CRCP PERFORMANCE ****************************************************
  
  var html = '<b>CRCP PERFORMANCE</b><br>' ;
  var r =  12 * document.getElementById("C18").value-1;
  var color = colorGreenRed(rows[r][12]);
  html += 'Number of Punchouts per Mile: ' ;      
  html += '<INPUT TYPE="TEXT" readonly="readonly" style="background-color:'+color
          +'; text-align: center; font-size: 17; font-weight: bold;" value="'+parseFloat(rows[r][12]).toFixed(2)+'" size="7"><br><br>';

  var titles = ["Age (Month)","Age (Year)", "Modulus of Rupture (psi)","Modulus of Elasticity (ksi)"
    ,"Concrete Stress (T) (psi)"
    ,"Concrete Stress (E) (psi)"
    ,"Total Concrete Stress (psi)"
    ,"Stress to Strength Ratio (psi/psi)"
    ,"Number of Load Repetitions to Failure"
    ,"Number of Load Repetitions"
    ,"Pavement Damage"
    ,"Cumulative Damage"
    ,"Number of Punchouts per Mile"]


    html += '<b>Analysis Result</b>' ;
    html += '<table style="width:99%;font-size: 12px;" border="1">'; 



    // Add the variable labels
    html+='<tr style="background-color:#888">';   
    for (var i=0;i<titles.length;i++){
      html+='<td>';
      html+= titles[i];
      html+='</td>';
    }
    html+='</tr>';    
    
    for (var i=0;i<rows.length;i++){
      html+='<tr>';   
      for (var j=0;j<rows[i].length;j++){
        if (j==12){
          var color = colorGreenRed(rows[i][j]);
          html+='<td  style="text-align: right; background-color:'+color
          +'; padding-right: 10px; padding-top: 0px; padding-bottom: 0px;">';
        }
        else {
          var color = colorRedBlues[j](rows[i][j]);
          html+='<td  style="text-align: right; background-color:'+color
          +'; padding-right: 10px; padding-top: 0px; padding-bottom: 0px;">';
        }
        //else
        //  html+='<td  style="text-align: right">';
        if (j==1 || j==12)
          html+= parseFloat(rows[i][j]).toFixed(2);
        else if (j==2 || j==3 || j==8 || j==9)
          html+= parseFloat(rows[i][j]).toFixed(0);
        else if (j==5 || j==6)
          html+= parseFloat(rows[i][j]).toFixed(1);
        else if (j==7)
          html+= parseFloat(rows[i][j]).toFixed(3);
        else if (j==10 || j==11)
          html+= parseFloat(rows[i][j]).toFixed(4);
        else  
          html+= rows[i][j];


        html+='</td>';
      }
      html+='</tr>';       
    }
    html += '</table> <br>';

    $('#analysisContainer').append(html);
  });  
}

function lane(n) {
  if (n <= 2)
    return 1;
  else if (n >= 4)
    return 0.6;
  else 
    return 0.7;
}

function fatigue(k) {
  if (k < 200)
      return k * 0.0221 - 15.97;
  else if (k < 300)
      return k * 0.0164 - 14.83;
  else if (k < 500)
      return k * 0.0038 - 11.05;
  else if (k < 1000)
      return k * 0.00033 - 9.31;
  else
      return k * 0.00071 - 9.69;
}
