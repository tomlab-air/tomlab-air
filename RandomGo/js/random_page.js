// URL
var url_wikipedia = "http://ja.wikipedia.org/wiki/Special:Randompage"
var url_wiktionary = "http://ja.wiktionary.org/wiki/Special:Randompage"
var url_map = "https://randomstreetview.com/"

// 表示するURL
var display_url;

// 乱数取得
var randnum = Math.floor( Math.random() * 3);
//console.log(randnum);

if(randnum === 0) {
  display_url = url_wikipedia;
} else if(randnum === 1) {
  display_url = url_wiktionary;
} else if(randnum === 2) {
  display_url = url_map;
} else {
  display_url = url_wikipedia;
}

//画面にページを表示する
document.write( '<iframe  class= "frame_center" src=' + display_url +' frameborder=”0″></iframe>' );
