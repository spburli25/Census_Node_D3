var fs = require('fs');

var filel= fs.readFileSync('../csv/India2011.csv','utf8');
var file2 = fs.readFileSync('../csv/IndiaSC2011.csv','utf8');
var file3 = fs.readFileSync('../csv/IndiaST2011.csv','utf8');

var result={};

var nestates = {"ARUNACHAL PRADESH":"northEast","NAGALAND":"northEast","MIZORAM":"northEast","TRIPURA":"northEast","MEGHALAYA":"northEast","ASSAM":"northEast","MANIPUR":"northEast"};
var csvtojson = function(csv) {

   var lines = csv.split("\n");
   var headers=lines[0].split(",");

   for (var j = 1; j < lines.length; j++) {

      var currentLine = lines[j].split(",");
      if(currentLine[4] == "Total" && currentLine[5] == "All ages") {

        var states ={literateMales:0, illiterateMales:0,literateFemales:0,illiterateFemales:0};
        var currentState = currentLine[3].replace("State -", "").trim();

        if(currentState in nestates) {
            if(result[currentState] == undefined){
              states.literateMales = parseInt(currentLine[13]);
              states.illiterateMales = parseInt(currentLine[10]);
              states.literateFemales = parseInt(currentLine[14]);
              states.illiterateFemales = parseInt(currentLine[11]);
              result[currentState]=states;
        }
        else{
              result[currentState].literateMales += parseInt(currentLine[13]);
              result[currentState].illiterateMales += parseInt(currentLine[10]);
              result[currentState].literateFemales += parseInt(currentLine[14]);
              result[currentState].illiterateFemales += parseInt(currentLine[11]);
            }
        }
      }
    }
  }

csvtojson(filel.toString());
csvtojson(file2.toString());
csvtojson(file3.toString());

fs.writeFile("../json/Json_Northeast.json",JSON.stringify(result,null,4),function(err,data){
   if(err){
     return console.log(err);
   }
   console.log(result);
   console.log("North East states results generated successfully");
});
