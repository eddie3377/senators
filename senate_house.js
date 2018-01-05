//document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2);
/*eslint-env browser*/
/*eslint "no-console": "off"*/
/*eslint "no-undef": "off"*/
/*global $*/

/*This is to descriminate by senate or house*/
var urlSenate = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
var urlHouse = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
var url;

if($("#senataTable").hasClass("senate")) {
url = urlSenate;
} else {
url = urlHouse;
}

   
$.getJSON(url,function(data) {  
    var members = data.results[0].members;
    
    
    var templateTable = $('#senataTable').html();
    var html = Mustache.render(templateTable, data.results[0]);
    $('#senate-data').html(html); 
    
    filterStates(members);
    
    
/*this is to style the tables */    
$('.tabledata').DataTable({
    "bScrollCollapse": true,
    "fixedHeader": true,
    "paging": false
});
    
/*this is for colorbox */     
  $('a.gallery').colorbox({ 
      opacity:0.85, 
      rel:'group2',
      iframe: false,
      width: 800,
      height: 600});  
    

    
/*var table = document.getElementById("senate-data");*/

/*var chooseState = document.getElementById("state-filter");*/

/*for (var i = 0; i < members.length; i++) {
    var currentMember = members[i];

    var td1 = "<td>" + "<a href='" + currentMember.url + "'>" + currentMember.first_name + " " + currentMember.last_name + "</td>";
    var td2 = "<td class='party'>" + currentMember.party + "</td>";
    var td3 = "<td class='state'>" + currentMember.state + "</td>";
    var td4 = "<td>" + currentMember.seniority + "</td>";
    var td5 = "<td>" + currentMember.votes_with_party_pct + "</td>";

    table.innerHTML += td1 + td2 + td3 + td4 + td5;
    
    }*/
    
/*
    var stateByState = "<option>" + currentMember.state + "</option>";
    chooseState.innerHTML += stateByState;
*/

function partySenators() {
    
    var partySelected = $("input[name='filterStatus']:checked")
        .map(function () {
            return $(this).val();   
        })
        .get();
    
    $(".myTable").each(function (index, row) {
        
        var partyValue = $(row).find('.party').text();
        var stateValue = $(row).find('.state').text();
        var stateSelected = $("#state-filter").val();
        var showMe = (stateValue == stateSelected) || stateSelected == "states";
       
        
        if((partySelected.includes(partyValue) || partySelected.length == 0) && showMe ){
        
            $(row).show();
        }else {
            $(row).hide();
        }     
    });
}
    
    
$("input[name='filterStatus']").on("click", partySenators);
$("#state-filter").on("change", partySenators);
    
    function filterStates (statesArray){
        var dropdown = $("#state-filter")
        var noduplicates = [];
        
        var product = statesArray.sort(function (a,b){
            return (a.state > b.state) ? 1: ((b.state > a.state) ? -1 :0);
            });
        $(product).each(function (i, member){
            
            if (!noduplicates.includes(member.state)){
                noduplicates.push(member.state);
                dropdown.append($("<option/>").val(member.state).text(member.state));
            }
        });
    }    

});



