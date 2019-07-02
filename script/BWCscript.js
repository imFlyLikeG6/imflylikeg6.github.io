var stages = [];
var selectedChapter =0;
var selectedStage =0;
var cardNum = 0;
/*
stages
 - num
 - card
 - score
 - empathy
 - passion
 - stamina
 - wisdom
*/

$('.num_only').keyup(function () {
  this.value = this.value.replace(/[^0-9]/g,''); // input 박스에 숫자만 입력 가능하게한다
});

String.prototype.format = function() {
  var theString = this;

    for (var i = 0; i < arguments.length; i++) {
        var regExp = new RegExp('\\{' + i + '\\}', 'gm');
        theString = theString.replace(regExp, arguments[i]);
    }

    return theString;
}

function loadStageData(data){
  var allRows = data.split(/\r?\n|\r/);
  var i = -1;
  var j = 0;
  for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
    var rowCells = allRows[singleRow].split(',');
    if(rowCells.length <= 5){
      continue;
    }
    if(rowCells[0] - 1 != i)
    {
      i++;
      j = 0;
      stages[i]= [];
    }
    stages[i][j] =
    {
      'card' :rowCells[1],
      'num' : rowCells[2],
      'score' : rowCells[3],
      'empathy' : rowCells[4],
      'passion' : rowCells[5],
      'stamina' : rowCells[6],
      'wisdom' : rowCells[7],
      'member' : rowCells[8]
    }
    j++;
  }
}

function addChapterSelect(){
  $("#chapter").append("<option value='-1'>선택</option>");
  for(var i=0; i <stages.length; i++)
  {
    var option = "<option value='{0}'>{1}</option>'".format(i,i+1);
    $("#chapter").append(option);
  }
}

function addStageSelect(){
  $("#stage option").remove();
  var chapter = $("#chapter option:selected").val();
  if(chapter < 0) return;
  $("#stage").append("<option value='-1'>선택</option>");
  for(var i=0; i <stages[chapter].length; i++)
  {
    var option = "<option value='{0}'>{1}</option>'".format(i,stages[chapter][i]['num']);
    $("#stage").append(option);
  }
}

function changeStage(){
  $("#result").empty();
  selectedChapter = $("#chapter option:selected").val();
  selectedStage = $("#stage option:selected").val();
  if(selectedChapter < 0 || selectedStage < 0) return;
  cardNum = stages[selectedChapter][selectedStage]['card'];

  var table = '<table><thead><tr>';
  table += '<th>Stage</th>';
  table += '<th>Score</th>';
  table += "<th class='empathy'><img src='resource/empathy.jpg' width='20px'> Empathy</th>";
  table += "<th class='passion'><img src='resource/passion.jpg' width='20px'> Passion</th>";
  table += "<th class='stamina'><img src='resource/stamina.jpg' width='20px'> Stamina</th>";
  table += "<th class='wisdom'><img src='resource/wisdom.jpg' width='20px'> Wisdom</th>";
  table += '</tr></thead><tbody><tr>';

  table +=  "<td>{0}-{1}</td>".format(selectedChapter*1+1,stages[selectedChapter][selectedStage]['num']);
  table +=  "<td>{0}</td>".format(stages[selectedChapter][selectedStage]['score']);
  table +=  "<td class='empathy'>{0}%</td>".format(stages[selectedChapter][selectedStage]['empathy']);
  table +=  "<td class='passion'>{0}%</td>".format(stages[selectedChapter][selectedStage]['passion']);
  table +=  "<td class='stamina'>{0}%</td>".format(stages[selectedChapter][selectedStage]['stamina']);
  table +=  "<td class='wisdom'>{0}%</td>".format(stages[selectedChapter][selectedStage]['wisdom']);

  table += '</tr></tbody></table>';
  $('#stageInfo').empty();
  $('#stageInfo').append(table);

  $("#cardInfo").show();
  for(var i = 1; i <= 4; i++)
  {
    var tmp = "#card" + i;
    if(cardNum >= i)
      var card1 = $(tmp).show();
    else
      var card1 = $(tmp).hide();
  }
}

function calculate(){
  var totalScore = 0;
  var empathyP = stages[selectedChapter][selectedStage]['empathy'];
  var passionP = stages[selectedChapter][selectedStage]['passion'];
  var staminaP = stages[selectedChapter][selectedStage]['stamina'];
  var wisdomP = stages[selectedChapter][selectedStage]['wisdom'];
  for(var i =0; i <= cardNum; i++)
  {
      totalScore += Math.floor($("#empathy"+i).val() * empathyP / 100);
      totalScore += Math.floor($("#passion"+i).val() * passionP / 100);
      totalScore += Math.floor($("#stamina"+i).val() * staminaP / 100);
      totalScore += Math.floor($("#wisdom"+i).val() * wisdomP / 100);
  }

  $("#result").empty();
  $("#result").append('Total Score => ');
  $("#result").append(totalScore);
  if(totalScore >= stages[selectedChapter][selectedStage]['score']){
    $("#result").append(' <b>Success!!!</b>');
  } else{
    $("#result").append(' <b>Fail... T_T</b>');
  }

}

function loadStageInfo(data){

  var table = "<fieldset id='stageT'> <legend>Stage Table</legend>";
  table += '<table><thead><tr>';
  table += '<th>Stage</th>';
  table += "<th class='member'>Member</th>";
  table += '<th>Score</th>';
  table += "<th class='empathy'><img src='resource/empathy.jpg' width='20px'></th>";
  table += "<th class='passion'><img src='resource/passion.jpg' width='20px'></th>";
  table += "<th class='stamina'><img src='resource/stamina.jpg' width='20px'></th>";
  table += "<th class='wisdom'><img src='resource/wisdom.jpg' width='20px'></th>";
  table += '</tr></thead><tbody>';

  for(var i=0; i<stages.length; i++)
  {
    for(var j=0; j<stages[i].length; j++)
    {
      table += "<tr>";
      table +=  "<td>{0}-{1}</td>".format(i*1+1,stages[i][j]['num']);
      table +=  "<td class='member'>{0}</td>".format(stages[i][j]['member']);
      table +=  "<td>{0}</td>".format(stages[i][j]['score']);
      table +=  "<td class='empathy'>{0}%</td>".format(stages[i][j]['empathy']);
      table +=  "<td class='passion'>{0}%</td>".format(stages[i][j]['passion']);
      table +=  "<td class='stamina'>{0}%</td>".format(stages[i][j]['stamina']);
      table +=  "<td class='wisdom'>{0}%</td>".format(stages[i][j]['wisdom']);
      table += "</tr>";
    }
    table += "<tr></tr>";
  }

  table += '</tr></tbody></table></fieldset>';
  $('#stageTable').empty();
  $('#stageTable').append(table);
}
