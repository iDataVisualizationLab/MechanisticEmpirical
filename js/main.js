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
  d3.tsv("data/stress.csv", function(error, data) {
    if (error) throw error;


    var rowIndexStress = 9;
    var row1 = [];
    var rows = [];

    row1.push(1);
    row1.push( row1[0]/ 12 );
    row1.push( +document.getElementById("F8").value);
    row1.push( 57000 / 7.5 * row1[2] / 1000 );
    row1.push( +data[7]["STR (T)"] );
    row1.push( data[7]["STR (E)"] * row1[3] / 5000 )
    row1.push( row1[4] + row1[5] )
    row1.push( row1[6] / row1[2] )
    row1.push( 11800 * Math.pow(row1[7],fatigue(+document.getElementById("F19").value)) )
    row1.push( lane(+document.getElementById("C24").value) 
      * document.getElementById("C25").value * 1000000 / 12 / document.getElementById("C18").value )
    row1.push( row1[9] / row1[8] )
    row1.push( row1[10] )
    row1.push( 18.985 / (1 + 5 * Math.pow(row1[11],-1.1)) )
    rows.push(row1);    // Add to the array


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


    var html = '<br><b>Analysis Result</b>' 
    var html = '<table style="width:99%;" border="1">' 



    // Add the variable labels
    html+='<tr style="background-color:#999">';   
    for (var i=0;i<titles.length;i++){
      html+='<td>';
      html+= titles[i];
      html+='</td>';
    }
    html+='</tr>';    
   
    for (var i=0;i<rows.length;i++){
      html+='<tr>';   
      for (var j=0;j<rows[i].length;j++){
        html+='<td>';
        //html+= data[i]["Average Temperature"];
        html+= rows[i][j];
        html+='</td>';
      }
      html+='</tr>';       
    }
    html += '</table>';

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
