var fs = require('fs');

var file1= fs.readFileSync('../csv/India2011.csv','utf8');
var file2 = fs.readFileSync('../csv/IndiaSC2011.csv','utf8');
var file3 = fs.readFileSync('../csv/IndiaST2011.csv','utf8');

var append = function(data){
  if(data===file1){
    fs.truncate('../csv/AllCensus.csv', 0, function(){console.log('done')})
  }
  fs.appendFile('../csv/AllCensus.csv', data, function (err) {
  });
}
append(file1);
append(file2);
append(file3);

var censusfile = fs.readFileSync('../csv/AllCensus.csv','utf8');

var csvtojson = function(csv) {

  var states={};
  var lines = csv.split("\r\n");
  var headers = lines[0].split(",");

  for (var j = 1; j < lines.length; j++) {
     var currentLine = lines[j].split(",");
     if(currentLine[4] == "Total" && currentLine[5] == "All ages") {
        var currentState = currentLine[3];

        if(currentState in states) {

           var state = states[currentState];
           state.literateMales += parseInt(currentLine[13]);
           state.illiterateMales += parseInt(currentLine[10]);
           state.literateFemales += parseInt(currentLine[14]);
           state.illiterateFemales += parseInt(currentLine[11]);

        }
        else {
           states[currentState] = {
              literateMales : parseInt(currentLine[13]),
              literateFemales : parseInt(currentLine[14]),
              illiterateMales : parseInt(currentLine[10]),
              illiterateFemales :parseInt(currentLine[11])
           };
         }
       }
       var result=[];

       for(state in states) {
         var currentState = states[state];
         result.push( {
           'state': state.replace("State -", "").trim(),
            'LiterateMale' : currentState.literateMales,
            'LiterateFemale' : currentState.literateFemales,
            'IlliterateMale' : currentState.illiterateMales,
            'IlliterateFemale' : currentState.illiterateFemales
         });
      }
    }


     fs.writeFile("../json/Json_Statewise.json",JSON.stringify(result,null,4),function(err,data){
        if(err){
          return console.log(err);
        }
        console.log(result);
        console.log("Statewise results generated successfully");
     });
}

csvtojson(censusfile);
