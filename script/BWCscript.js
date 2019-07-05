var stages = [];
var selectedStory =0;
var selectedChapter =0;
var selectedStage =0;
var cardNum = 0;
var storyName =['BTS', 'RM', 'JIN', 'SUGA', 'JHOPE', 'JIMIN', 'V', 'JUNGKOOK'];
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

function loadStoryData(i)
{
  if(storyName.length > i)
  {
    $.ajax({
      url: 'script/' + storyName[i] + '_story.csv',
      dataType: 'text',
      success: function(data){
        loadStageData(data);
        loadStoryData(++i);
      }
    });
  }
  else {
    addStorySelect();
  }
  /*
  for(var i = 0; i <storyName.length; i++)
  {
    var num = i;
    $.ajax({
      url: 'script/' + storyName[i] + '_story.csv',
      dataType: 'text',
      success: function(data){
        loadStageData(data);
      }
    });
  }
  addStorySelect();
  */
}

function loadStageData(data){
  var story = stages.length;
  stages[story] = [];
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
      stages[story][i]= [];
    }
    stages[story][i][j] =
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

function addStorySelect(){
  $("#story").append("<option value='-1'>Select</option>");
  for(var i=0; i <storyName.length; i++)
  {
    var option = "<option value='{0}'>{1}</option>".format(i,storyName[i]);
    $("#story").append(option);
  }
}

function addChapterSelect(){
  $("#chapter option").remove();
  $("#stage option").remove();
  selectedStory = $("#story option:selected").val();
  if(selectedStory < 0) return;
  $("#chapter").append("<option value='-1'>Select</option>");
  for(var i=0; i <stages[selectedStory].length; i++)
  {
    var option = "<option value='{0}'>{1}</option>".format(i,i+1);
    $("#chapter").append(option);
  }

  $("#stageTableBtn").empty();
  $("#stageTableBtn").append(storyName[selectedStory] + " Story Score Table");
}

function addStageSelect(){
  $("#stage option").remove();
  var chapter = $("#chapter option:selected").val();
  if(chapter < 0) return;
  $("#stage").append("<option value='-1'>Select</option>");
  for(var i=0; i <stages[selectedStory][chapter].length; i++)
  {
    var option = "<option value='{0}'>{1}</option>".format(i,stages[selectedStory][chapter][i]['num']);
    $("#stage").append(option);
  }
}

function changeStage(){
  $("#result").empty();
  selectedChapter = $("#chapter option:selected").val();
  selectedStage = $("#stage option:selected").val();
  if(selectedChapter < 0 || selectedStage < 0) return;
  var stage = stages[selectedStory][selectedChapter][selectedStage];
  cardNum = stage['card'];

  var table = '<table><thead><tr>';
  table += '<th>Stage</th>';
  table += '<th>Score</th>';
  table += "<th class='empathy'><img src='resource/empathy.jpg' width='20px'> Empathy</th>";
  table += "<th class='passion'><img src='resource/passion.jpg' width='20px'> Passion</th>";
  table += "<th class='stamina'><img src='resource/stamina.jpg' width='20px'> Stamina</th>";
  table += "<th class='wisdom'><img src='resource/wisdom.jpg' width='20px'> Wisdom</th>";
  table += '</tr></thead><tbody><tr>';

  table +=  "<td>{0}-{1}</td>".format(selectedChapter*1+1,stage['num']);
  table +=  "<td>{0}</td>".format(stage['score']);
  table +=  "<td class='empathy'>{0}%</td>".format(stage['empathy']);
  table +=  "<td class='passion'>{0}%</td>".format(stage['passion']);
  table +=  "<td class='stamina'>{0}%</td>".format(stage['stamina']);
  table +=  "<td class='wisdom'>{0}%</td>".format(stage['wisdom']);

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
  var stage = stages[selectedStory][selectedChapter][selectedStage];
  var empathyP = stage['empathy'];
  var passionP = stage['passion'];
  var staminaP = stage['stamina'];
  var wisdomP = stage['wisdom'];
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
  if(stage['score'] == 0){
    $("#result").append(" <b>Sorry! No score information! It will be updated soon!</b>");
  }
  else if(totalScore >= stage['score']){
    $("#result").append(' <b>Success!!!</b>');
  } else{
    $("#result").append(' <b>Fail... T_T</b>');
  }

}

function loadStageInfo(data){

  var table = "<br><fieldset id='stageT'> <legend>";
  table += storyName[selectedStory] + " Story ";
  table += "Score Table</legend>";
  table += '<table><thead><tr>';
  table += '<th>Stage</th>';
  table += "<th class='member'>Item</th>";
  table += '<th>Score</th>';
  table += "<th class='empathy'><img src='resource/empathy.jpg' width='20px'></th>";
  table += "<th class='passion'><img src='resource/passion.jpg' width='20px'></th>";
  table += "<th class='stamina'><img src='resource/stamina.jpg' width='20px'></th>";
  table += "<th class='wisdom'><img src='resource/wisdom.jpg' width='20px'></th>";
  table += '</tr></thead><tbody>';

  for(var i=0; i<stages[selectedStory].length; i++)
  {
    for(var j=0; j<stages[selectedStory][i].length; j++)
    {
      var stage = stages[selectedStory][i][j];
      table += "<tr>";
      table +=  "<td>{0}-{1}</td>".format(i*1+1,stage['num']);
      table +=  "<td class='member'>{0}</td>".format(stage['member']);
      table +=  "<td>{0}</td>".format(stage['score']);
      table +=  "<td class='empathy'>{0}%</td>".format(stage['empathy']);
      table +=  "<td class='passion'>{0}%</td>".format(stage['passion']);
      table +=  "<td class='stamina'>{0}%</td>".format(stage['stamina']);
      table +=  "<td class='wisdom'>{0}%</td>".format(stage['wisdom']);
      table += "</tr>";
    }
    table += "<tr></tr>";
  }

  table += '</tr></tbody></table></fieldset>';
  $('#stageTable').empty();
  $('#stageTable').append(table);
}
