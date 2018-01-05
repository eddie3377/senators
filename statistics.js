/*eslint-env browser*/
/*eslint "no-console": "off"*/
/*global $*/

/*This is to descriminate by senate or house*/
var urlSenate = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
var urlHouse = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
var url;

if($("#senatorsTable").hasClass("senate")) {
url = urlSenate;
} else {
url = urlHouse;
}

/*First table*/
var statistics = {
    "Number_of_Democrat": "0",
    "Number_of_Republican": "0",
    "Number_of_Independent": "0",
    "Percentage_of_Democrat": "0",
    "Percentage_of_Republican": "0",
    "Percentage_of_Independent": "0",    

    "MostEngagedAttendance": [
      /*blah blah blah*/
    ],
    "LeastEngagedAttendance": [
    /*blah blah blah*/
    ],
}

$.getJSON(url,function(data) { 
/*var tableLeast = document.getElementById("tableLeast");   
var tableMost = document.getElementById("tableMost");    
var tableMostLoyal= document.getElementById("tableMostLoyal"); */
var members = data.results[0].members;
    
var numberDemocrats = membersParty(members, "D");
var numberRepublicans = membersParty(members, "R");
var numberIndependent = membersParty(members, "I");
var totalNum = membersParty(members, "D").length + membersParty(members, "R").length + membersParty(members, "I").length;
    
statistics.Number_of_Democrat = numberDemocrats.length;
statistics.Number_of_Republican = numberRepublicans.length;
statistics.Number_of_Independent = numberIndependent.length;
statistics.Total_number = totalNum;


var prctnumberDemocrats = getPercentage (numberDemocrats);
var prctnumberRepublicans = getPercentage (numberRepublicans);
var prctnumberIndependent = getPercentage (numberIndependent);
var prctTotalNumber = getPercentage (members);
    
statistics.Percentage_of_Democrat = prctnumberDemocrats;
statistics.Percentage_of_Republican = prctnumberRepublicans;
statistics.Percentage_of_Independent = prctnumberIndependent;
statistics.Total_prct = prctTotalNumber;
    
    
document.getElementById("generaltable").innerHTML = "<tr><td>Democrats</td><td>" + statistics.Number_of_Democrat + "</td><td>" + statistics.Percentage_of_Democrat + "</td></tr>" +
"<tr><td>Republicans</td><td>" + statistics.Number_of_Republican + "</td><td>" + statistics.Percentage_of_Republican + "</td></tr>" +
"<tr><td>Independent</td><td>" + statistics.Number_of_Independent + "</td><td>" + statistics.Percentage_of_Independent + "</td></tr>" + 
"<tr><td>Total</td><td>" + statistics.Total_number + "</td><td>" + statistics.Total_prct + "</td></tr>"

/*This is to deiscriminate by senate or house*/
    
if($("#attendancetable").hasClass("attendance"))    {
topTen(members);
bottomTen(members);  
} else {
bottomTenLoyal(members);
topTenLoyal(members);  
}
    
/*this is to style the tables */
    
$('.datatable').DataTable({
    "bScrollCollapse": true,
    "searching": false,
    "scrollY": 400,
    "paging": false,
    "order": [ 2 , 'asc' ]
});
   
$('.datatable1').DataTable({
    "bScrollCollapse": true,
    "searching": false,
    "scrollY": 400,
    "paging": false,
    "order": [ 2 , 'des' ]
});    

/*The correct way of doing it, but still need to check the links, as I am not getting what is to be expected    
createTableLeastEngaged();*/
  
console.log(statistics);
/*topTen(members);*/
/*bottomTen(members);*/
/*bottomTenLoyal(members);*/
    


/*para sacar el numero de R D I*/
function membersParty(membersArray,partyValue){
    var outPut = [];
    for (var i=0; i< membersArray.length; i++){
        var currentMember = membersArray[i];
        
        if (currentMember.party === partyValue){
            outPut.push(currentMember);
        }
    }
    return outPut;
}

/*para sacar el numero de votos*/
function getPercentage(membersArray){
    var sumPrct = 0;
    for (var i =0; i< membersArray.length; i++){
        sumPrct += +(membersArray[i].votes_with_party_pct);
    }
    var average = sumPrct / membersArray.length;
    var integer = average.toFixed();
    return integer;
}  

/*para ordenar el array de attendace*/
function sortArray (membersArray){
    var myArray = membersArray.sort (function (a,b){
      return a.missed_votes - b.missed_votes;  
    });

    return myArray;
}

function topTen (Array){
    var sortedArray = (sortArray(Array));
    var limitNumber = Math.round(((sortedArray.length) * 0.1) - 1);
    var tableLeast = document.getElementById("tableLeast");
    
   
    for (var i = 0; i <= limitNumber; i++) {
        
        var newRow = document.createElement("tr");
        
            while (sortedArray[limitNumber].missed_votes == sortedArray[limitNumber + 1].missed_votes) {
       limitNumber++
   }
        /* Need to check the names again, as I am only getting back a line with just the name and last name*/
 /*       var objectLeastEngagedAttendance = {};
        
        objectLeastEngagedAttendance.name = sortedArray[i].first_name +" "+ sortedArray[i].last_name;
        objectLeastEngagedAttendance.votes = sortedArray[i].missed_votes;
        objectLeastEngagedAttendance.percentage = sortedArray[i].missed_votes_pct;
        statistics.LeastEngagedAttendance.push(objectLeastEngagedAttendance);*/ 
        
        newRow.insertCell().innerHTML = sortedArray[i].first_name +" "+ sortedArray[i].last_name;
        newRow.insertCell().innerHTML = sortedArray[i].missed_votes;
        newRow.insertCell().innerHTML = sortedArray[i].missed_votes_pct ;
        tableLeast.appendChild(newRow);
    }
}

/*function createTableLeastEngaged (){
    var tableLeast = document.getElementById("tableLeast")
   
    for (var i=0; i< statistics.LeastEngagedAttendance.lenght; i++);{   
    var newRow = document.createElement("tr");
    
    newRow.insertCell().innerHTML = statistics.LeastEngagedAttendance[i].name;
    newRow.insertCell().innerHTML = statistics.LeastEngagedAttendance[i].votes;
    newRow.insertCell().innerHTML = statistics.LeastEngagedAttendance[i].percentage;
    tableLeast.appendChild(newRow)
 }
}*/

/* para voltear el array*/
function invertedArray (membersArray){
    var theArray = membersArray.reverse (function (a,b){
      return a.missed_votes - b.missed_votes;  
    });

    return theArray;
}

function bottomTen (Array){
    var reversedArray = (invertedArray(Array));
    var limitNumber = Math.round(((reversedArray.length) * 0.1) - 1);
    var tableMost = document.getElementById("tableMost");
    
    for (var i = 0; i <= limitNumber; i++) {
        
        var newRow = document.createElement("tr");
        
               while (reversedArray[limitNumber].missed_votes == reversedArray[limitNumber + 1].missed_votes) {
       limitNumber++
   }
        
        newRow.insertCell().innerHTML = reversedArray[i].first_name +" "+ reversedArray[i].last_name;
        newRow.insertCell().innerHTML = reversedArray[i].missed_votes;
        newRow.insertCell().innerHTML = reversedArray[i].missed_votes_pct;
        tableMost.appendChild(newRow);
    }
}
/*para hacer la parte de Loyal = total votes - missed votes * percentage % 100*/

function getThePartyVotes(membersArray){
    return ((membersArray.total_votes - membersArray.missed_votes)* membersArray.votes_with_party_pct)/100;
}

function sortArrayLoyal (membersArray){
    var myArrayLoyal = membersArray.sort (function (a,b){
      return a.votes_with_party_pct - b.votes_with_party_pct;  
    });

    return myArrayLoyal;
}

function topTenLoyal (Array){
    var sortedArrayLoyal = (sortArrayLoyal(Array));
    var limitNumber = Math.round(((sortedArrayLoyal.length) * 0.1) - 1);
    var tableLeastLoyal = document.getElementById("tableLeastLoyal");
    
    for (var i = 0; i <= limitNumber; i++){
        
        var newRow = document.createElement("tr");
        
        while (sortedArrayLoyal[limitNumber].votes_with_party_pct == sortedArrayLoyal[limitNumber + 1].votes_with_party_pct) {
       limitNumber++
   }
        
        newRow.insertCell().innerHTML = sortedArrayLoyal[i].first_name +" "+ sortedArrayLoyal[i].last_name;
        newRow.insertCell().innerHTML = getThePartyVotes(sortedArrayLoyal[i]).toFixed();
        newRow.insertCell().innerHTML = sortedArrayLoyal[i].votes_with_party_pct;
        tableLeastLoyal.appendChild(newRow);
    }
    
}

function invertedArrayLoyal (membersArray){
    var theArrayLoyal = membersArray.sort (function (a, b){
      return b.votes_with_party_pct - a.votes_with_party_pct;  
    });
console.log(membersArray);
    return theArrayLoyal;
}

function bottomTenLoyal (membersArray){
    var reversedArrayLoyal = (invertedArrayLoyal(membersArray));
    var limitNumber = Math.round(((reversedArrayLoyal.length) * 0.1) - 1);
    var tableMostLoyal = document.getElementById("tableMostLoyal");
    
    for (var i = 0; i <= limitNumber; i++){
        
        var newRow = document.createElement("tr");
        
        while (reversedArrayLoyal[limitNumber].votes_with_party_pct == reversedArrayLoyal[limitNumber + 1].votes_with_party_pct) {
       limitNumber++
   }
        
        newRow.insertCell().innerHTML = reversedArrayLoyal[i].first_name +" "+ reversedArrayLoyal[i].last_name;
        newRow.insertCell().innerHTML = getThePartyVotes(reversedArrayLoyal[i]).toFixed();
        newRow.insertCell().innerHTML = reversedArrayLoyal[i].votes_with_party_pct;
        tableMostLoyal.appendChild(newRow);
    }
    
}

});


