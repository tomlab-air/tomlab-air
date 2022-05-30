//画面に画像を表示する
document.write( '<img id="id_t_icon_down0" class="t_icon_down" src="images/train_down.png">' );
document.write( '<img id="id_t_icon_down1" class="t_icon_down" src="images/train_down.png">' );
document.write( '<img id="id_t_icon_down2" class="t_icon_down" src="images/train_down.png">' );
document.write( '<img id="id_t_icon_down3" class="t_icon_down" src="images/train_down.png">' );
document.write( '<img id="id_t_icon_down4" class="t_icon_down" src="images/train_down.png">' );

document.write('<div id="id_balloon_down0" class="balloon_down"></div>');
document.write('<div id="id_balloon_down1" class="balloon_down"></div>');
document.write('<div id="id_balloon_down2" class="balloon_down"></div>');
document.write('<div id="id_balloon_down3" class="balloon_down"></div>');
document.write('<div id="id_balloon_down4" class="balloon_down"></div>');

var data_array_all;
var isHolidayToday = false;
var today = new Date();

// 祝日判定
function isHoliday(date) {
  var req = new XMLHttpRequest();
  req.open('get', 'csv/syukujitsu.csv', false);
  req.send(null);
  result = checkDate(req.responseText, date);
  // console.log(result);
  isHolidayToday = result;
}
function checkDate(str, date) {
  var data = [];
  var nDate = new Date(date);
  var dataArr = [];
  var checkDate = nDate.getFullYear() +
            '/' + (nDate.getMonth() + 1) +
            '/' + (nDate.getDate());
  var isHoliday = false;
  var tmp = str.split('\n');
  for (var i=0; i< tmp.length; i++) {
    dataArr = tmp[i].split(',');
    if (dataArr[0] === checkDate) {
      isHoliday = true;
      break;
    }
  }
  return isHoliday;
}

// CSVの読み込み
async function import_csv(csv_path)
{
    fetch(csv_path)
    .then((res) => {
        if(!res.ok) {
            console.log('正常にリクエストを処理できませんでした。');
        }
        return res.text();
    })
    .then((csv_data) => {
        convert_array(csv_data);
    })
    .catch((error) => {
        console.log('エラーが発生しました。');
    })
}

// テキストデータを配列に変換
function convert_array(csv_data)
{
    let data_array = [];
    const data_string = csv_data.split('\n');
    for (let i = 0; i < data_string.length; i++) {
        data_array[i] = data_string[i].split(',');
    }
    // compareTime(data_array);

    data_array_all = data_array;
}

// 現在時刻と時刻表時刻の比較
function compareTime(data_array)
{
    let match_array = [];

    var nowTime = new Date();
    let nowHour = nowTime.getHours();
    let nowMin  = nowTime.getMinutes();
    let nowSec  = nowTime.getSeconds();
    let nowMil  = nowTime.getMilliseconds();

    // 秒とミリ病の結合
    nowSec = nowSec+nowMil/1000.0;

    // 時刻が時刻表と一致した場合は0、間の場合は1
    let matchInt = 0;
    let betweenInt = 1;

    // 日時データを抽出し、比較する
    // 先頭はヘッダのためカット
    for (let i = 1; i < data_array.length; i++) {
      // 先頭２カラムは文字列のためカット
      for (let j = 2; j < data_array[i].length; j++) {
        // 時刻差の割合
        let gapRatio = 0;

        // nullチェック＆桁数チェック
        if(data_array[i][j] && data_array[i][j].length == 4) {
          let dataHour = Number(data_array[i][j].substr(0,2));
          let dataMin = Number(data_array[i][j].substr(2,2));
          let dataMinp = dataMin + 1;
          // 時刻の一致確認
          if(nowHour == dataHour && nowMin == dataMin) {
            match_array.push([i,j,matchInt,gapRatio])
          // 次の要素の存在チェック＆nullチェック＆桁数チェック
          } else if(j+1 < data_array[i].length && data_array[i][j+1] && data_array[i][j+1].length == 4) {
            let dataHourNext = Number(data_array[i][j+1].substr(0,2));
            let dataMinNext = Number(data_array[i][j+1].substr(2,2));

            // 時刻の間にいるか確認
            if(((nowHour == dataHour && nowHour == dataHourNext) && (nowMin >  dataMin && nowMin <  dataMinNext)) ||
               ((nowHour >  dataHour && nowHour == dataHourNext) && (nowMin <= dataMin && nowMin <  dataMinNext)) ||
               ((nowHour == dataHour && nowHour <  dataHourNext) && (nowMin >  dataMin && nowMin >= dataMinNext))) {
                // 割合の計算
                if(dataHour == dataHourNext) {
                  gapRatio = (nowMin-dataMinp)/(dataMinNext-dataMinp) + nowSec/((dataMinNext-dataMinp)*60.0);
                } else if(nowHour == dataHour) {
                  gapRatio = (nowMin-dataMinp)/((dataMinNext+60)-dataMinp) + nowSec/(((dataMinNext+60)-dataMinp)*60.0);
                } else {
                  gapRatio = ((nowMin+60)-dataMinp)/((dataMinNext+60)-dataMinp) + nowSec/(((dataMinNext+60)-dataMinp)*60.0);
                }
                match_array.push([i,j,betweenInt,gapRatio]);
            }
          }
        }
      }
    }
    // console.log(match_array);

    if(match_array.length > 0) {
      moveObj(match_array);
    } else {
      // 不要要素の非表示
      for(let i = 0; i < 5; i++) {
        document.getElementById('id_t_icon_down' + String(i)).style.display ="none";
        document.getElementById('id_balloon_down' + String(i)).style.display ="none";
      }
    }
}

//動かす
function moveObj(match_array) {
  let y = 0.0;

  // match_arrayの中身の数分実施する
  for(let i = 0; i < match_array.length; i++) {
    if(match_array[i][1] == 2) {
      y = -90.0 + ((-75.0)-(-90.0))*match_array[i][3];
    }else if(match_array[i][1] == 3) {
      y = -75.0 + ((-60.0)-(-75.0))*match_array[i][3];
    }else if(match_array[i][1] == 4) {
      y = -60.0 + ((-45.0)-(-60.0))*match_array[i][3];
    }else if(match_array[i][1] == 5) {
      y = -45.0 + ((-30.0)-(-45.0))*match_array[i][3];
    }else if(match_array[i][1] == 6) {
      y = -30.0 + ((-15.0)-(-30.0))*match_array[i][3];
    }else if(match_array[i][1] == 7) {
      y = -15.0 + (   0.0 -(-15.0))*match_array[i][3];
    }else if(match_array[i][1] == 8) {
      y =   0.0 + (  15.0 -   0.0 )*match_array[i][3];
    }else if(match_array[i][1] == 9) {
      y =  15.0 + (  30.0 -  15.0 )*match_array[i][3];
    }else if(match_array[i][1] == 10) {
      y =  30.0 + (  45.0 -  30.0 )*match_array[i][3];
    }else if(match_array[i][1] == 11) {
      y =  45.0 + (  60.0 -  45.0 )*match_array[i][3];
    }else if(match_array[i][1] == 12) {
      y =  60.0 + (  75.0 -  60.0 )*match_array[i][3];
    }else if(match_array[i][1] == 13) {
      y =  75.0 + (  90.0 -  75.0 )*match_array[i][3];
    }else if(match_array[i][1] == 14) {
      y =  90.0
    }
    // 位置決定&表示
    document.getElementById('id_t_icon_down' + String(i)).style.top = y + "%";
    document.getElementById('id_t_icon_down' + String(i)).style.display ="block";

    // 吹き出し位置&文字
    document.getElementById('id_balloon_down' + String(i)).style.top = (y+8) + "%";
    document.getElementById('id_balloon_down' + String(i)).textContent = data_array_all[match_array[i][0]][1] + "行き";
  }

  // 不要要素の非表示
  for(let i = match_array.length; i < 5; i++) {
    document.getElementById('id_t_icon_down' + String(i)).style.display ="none";
    document.getElementById('id_balloon_down' + String(i)).style.display ="none";
  }
}

// 吹き出し表示&非表示
document.addEventListener('click', showEvent);
document.addEventListener('touchend', showEvent);
touchFlg = true;
function showEvent(e) {
  if(touchFlg) {
    touchFlg = false;
    if(e.target.closest('#id_t_icon_down0')) {
      document.getElementById('id_balloon_down0').style.display ="block";
      document.getElementById('id_balloon_down1').style.display ="none";
      document.getElementById('id_balloon_down2').style.display ="none";
      document.getElementById('id_balloon_down3').style.display ="none";
      document.getElementById('id_balloon_down4').style.display ="none";
    } else if(e.target.closest('#id_t_icon_down1')) {
      document.getElementById('id_balloon_down0').style.display ="none";
      document.getElementById('id_balloon_down1').style.display ="block";
      document.getElementById('id_balloon_down2').style.display ="none";
      document.getElementById('id_balloon_down3').style.display ="none";
      document.getElementById('id_balloon_down4').style.display ="none";
    } else if(e.target.closest('#id_t_icon_down2')) {
      document.getElementById('id_balloon_down0').style.display ="none";
      document.getElementById('id_balloon_down1').style.display ="none";
      document.getElementById('id_balloon_down2').style.display ="block";
      document.getElementById('id_balloon_down3').style.display ="none";
      document.getElementById('id_balloon_down4').style.display ="none";
    } else if(e.target.closest('#id_t_icon_down3')) {
      document.getElementById('id_balloon_down0').style.display ="none";
      document.getElementById('id_balloon_down1').style.display ="none";
      document.getElementById('id_balloon_down2').style.display ="none";
      document.getElementById('id_balloon_down3').style.display ="block";
      document.getElementById('id_balloon_down4').style.display ="none";
    } else if(e.target.closest('#id_t_icon_down4')) {
      document.getElementById('id_balloon_down0').style.display ="none";
      document.getElementById('id_balloon_down1').style.display ="none";
      document.getElementById('id_balloon_down2').style.display ="none";
      document.getElementById('id_balloon_down3').style.display ="none";
      document.getElementById('id_balloon_down4').style.display ="block";
    } else {
      document.getElementById('id_balloon_down0').style.display ="none";
      document.getElementById('id_balloon_down1').style.display ="none";
      document.getElementById('id_balloon_down2').style.display ="none";
      document.getElementById('id_balloon_down3').style.display ="none";
      document.getElementById('id_balloon_down4').style.display ="none";
    }
  }
  touchFlg = true;
}

// 祝日判定
if (isHoliday(today) || today.getDay()==6 || today.getDay()==0) {
  // 休日用のcsvインポート
  import_csv('csv/down_holiday.csv');
} else {
  // 平日用のcsvインポート
  import_csv('csv/down_weekday.csv');
}

// インターバル処理
setInterval('compareTime(data_array_all)',500);
