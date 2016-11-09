/* 2016 
 * Tommy Dang (on the TxDot project, as Assistant professor, iDVL@TTU)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

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
