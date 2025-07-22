function fillRomanNames() { // 依漢字人名，抓 name.js 資料填入羅馬字人名
  // var nodes = document.getElementById("EP7").getElementsByTagName("tr") + document.getElementById("EP8").getElementsByTagName("tr");
  var nodes = document.getElementById('generated').getElementsByTagName('tr');
  for (var i=0; i<nodes.length; i+=2) {
    if (nodes[i].classList.contains("fr")) {
      continue;
    }
    else {
      var k = i + 1; // 偶數行
      var name = nodes[k].getElementsByTagName('td')[0].innerHTML.replace("：","").replace(' ','').replace(' ','').replace("&nbsp;","");
      // var names = JSON.parse(document.getElementById('names').innerHTML);
      if (names[name] == undefined) {
        name = name.replace(/\d/,'').replace('：','');
        if (names[name] == undefined) {
          nodes[k].getElementsByTagName('td')[0].innerHTML = nodes[k].getElementsByTagName('td')[0].innerHTML.replace(/\d/,'').replace('：','');
          continue;
        }
        else {
          nodes[i].getElementsByTagName('td')[0].innerHTML = names[name][0] + ":&nbsp;";
        }
      }
      else {
        nodes[i].getElementsByTagName('td')[0].innerHTML = names[name][0] + ":&nbsp;";
      }

      // 較長的羅馬字名字：縮小字型、縮短長度
      if (nodes[i].getElementsByTagName('td')[0].innerHTML.includes('傷長')) {
        nodes[i].getElementsByTagName('td')[0].innerHTML = '<span class="condensed">' + nodes[i].getElementsByTagName('td')[0].innerHTML.replace('傷長','') + '</span>';
      }

      nodes[k].getElementsByTagName('td')[0].innerHTML = nodes[k].getElementsByTagName('td')[0].innerHTML.replace(/\d/,'').replace('Tuq：',''); // Tokitok 講客个時節，還係愛直接用佢个族語名，毋使用漢字
    }
  }
}

function useHL() {

  var nodes = document.getElementById('generated').querySelectorAll("tr:not(.lang2):not(.lang3):not(.lang4):not(.lang5):not(.lang6)"); // 最早是設計選取所有的 tr，但如果要支援多語內容，就必須略過非客話的列 ☞ :not() - CSS（层叠样式表） | MDN <https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not>
  for (var i=0; i<nodes.length; i+=2) {
    var j = i / 2;
    // nodes[i].getElementsByTagName('td')[0].innerHTML += " " + j; // 除錯用
    var rowclass = nodes[i].getAttribute('class');
    //if (nodes[i].hasAttribute('class')) {
    if (nodes[i].hasAttribute('class') && (rowclass.includes('fr') || rowclass.includes('lang'))) {
        continue;
      }
      else if (HL[j] == undefined) {
        nodes[i].getElementsByTagName('td')[1].innerHTML = "";
        // continue;
      }
      else {
        nodes[i].getElementsByTagName('td')[1].innerHTML = HL[j];
      }

    //}
    
    // 替換名字
    var k = i + 1;
    var name = nodes[k].getElementsByTagName('td')[0].innerHTML.replace("：","").replace(' ','').replace(' ','').replace("&nbsp;","");
    // var names = JSON.parse(document.getElementById('names').innerHTML);
    if (names[name] == undefined) {
      continue;
    }
    else {
      nodes[i].getElementsByTagName('td')[0].innerHTML = names[name][1] + ":&nbsp;";
      // 較長的羅馬字名字：縮小字型、縮短長度
      if (nodes[i].getElementsByTagName('td')[0].innerHTML.includes('忒長')) {
        nodes[i].getElementsByTagName('td')[0].innerHTML = '<span class="condensed">' + nodes[i].getElementsByTagName('td')[0].innerHTML.replace('忒長','') + '</span>';
      }
    }
  }

  var hakvar = document.getElementById('hakvar');
  hakvar.setAttribute('href', 'HL.css');
}

function create() {
  // 參考另一個 branch 的進度：Seqalu-hak/hak-lines.html at aec3dad6f0a0c71777a41b5f0c2cce41896de1f4 · GJRobert/Seqalu-hak <https://github.com/GJRobert/Seqalu-hak/blob/aec3dad6f0a0c71777a41b5f0c2cce41896de1f4/hak-lines.html>

  var contentContainer = document.getElementById("generated");
  var toc = document.getElementById('floatedTOC');

  for (var i=0; i<data.length; i++) {

    var ep = document.createElement("div");
    ep.setAttribute("class", "epLevel");
    var h1 = document.createElement("h1");
    var tocItem = document.createElement('li'); // 順便製作 EP 目錄
    if (data[i].EP==undefined) { // 非 EP
      ep.setAttribute("id", data[i].title);
      h1.innerHTML = "<a id='" + data[i].title + "'></a><p>" + data[i].title + "</p>";
      tocItem.innerHTML = "<a href='#" + data[i].title + "'>" + data[i].title + "</a>";
    } else { // 一般 EP
      ep.setAttribute("id", "EP"+data[i].EP);
      ep.classList.add("episode");
      h1.innerHTML = "<a id='ep" + data[i].EP + "'></a><p>EP" + data[i].EP + "</p>";
      tocItem.innerHTML = "<a href='#ep" + data[i].EP + "'>" + data[i].EP + "</a>";
    }
    if (data[i].draft == true) {ep.classList.add("draft");}
    ep.appendChild(h1);
    toc.appendChild(tocItem);

    for (var j=0; j<data[i].sections.length; j++) {

      var section = document.createElement("section");
      section.classList.add("noHak");

      var time = document.createElement("span");
      time.classList.add("time");
      time.innerHTML = data[i].sections[j].t;
      section.appendChild(time);

      var table = document.createElement("table");

      for (var k=0; k<data[i].sections[j].rows.length; k++) {
        var tr1 = document.createElement("tr");
        var tr2 = document.createElement("tr");
        if (data[i].sections[j].rows[k][2] === undefined) { // 還沒有羅馬字就先空著
          data[i].sections[j].rows[k][2] = "";
        }

        if (data[i].sections[j].rows[k][3] == 3 || data[i].sections[j].rows[k][3] == 4) { // 非漢語族（排灣、英文，左原文右翻譯）
          var name = data[i].sections[j].rows[k][0];
          var lang = data[i].sections[j].rows[k][3];
          var namelang = (lang === undefined) ? name : name+lang;
          if (name !== '') {
            name += "："
          }
          var trans = '';
          if (data[i].sections[j].rows[k][1] !== '') { // 加這道，處理「空的翻譯」的情形（有翻譯，才產生 trans 方塊；像如果排灣文是打「...」那就不會有翻譯了）
            trans = '<div class="trans"><span class="tranName">' + name.replace(/\d/,'') + '</span>' + data[i].sections[j].rows[k][1] + '</div>'; // 本來前後有加括號的
          }

          var ellipsisCell = new RegExp('^\\.\\.\\.'); // 用正規表示式檢查的方法 ☞ jquery - javascript check if regex apply - Stack Overflow <https://stackoverflow.com/questions/6390695/javascript-check-if-regex-apply>
          if (data[i].sections[j].rows[k][3] == '3' && data[i].sections[j].rows[k][2].match(ellipsisCell)) { // 若排灣文只有「...」，則用百步蛇紋代替，比較不會那麼乾
            data[i].sections[j].rows[k][2] = data[i].sections[j].rows[k][2].replace(/^\.\.\./,'<span class="payuanEllipsis">◆◆◆◆◆◆◆◆◆◆◆◆◆</span>');
            // data[i].sections[j].rows[k][2] = '◆◆◆◆◆◆◆◆◆◆';
          }
          tr1.innerHTML = '<td></td><td>' + trans + data[i].sections[j].rows[k][2] + '</td>'; // 跟其他語文漢字放第 2 列不同，是把華文字幕放在右邊，類似 sidenote
          tr2.innerHTML = '<td>' + namelang + '</td><td></td>'; // 這列還是要有，讓 fillHakNames() 去抓族語名，但再用 display:none 同英、法文
        }
        else { // 漢語族（上排羅馬字、下排漢字）
          tr1.innerHTML = '<td></td><td>' + data[i].sections[j].rows[k][2] + '</td>';
          var name = data[i].sections[j].rows[k][0];
          var lang = data[i].sections[j].rows[k][3];
          name = (lang === undefined) ? name : name+lang;
          if (name !== '') {
            name += "："
          }
          tr2.innerHTML = '<td>' + name + '</td><td>' + data[i].sections[j].rows[k][1] + '</td>';
        }


        if (lang !== undefined) {
          tr1.classList += "lang"+data[i].sections[j].rows[k][3];
          tr2.classList += "lang"+data[i].sections[j].rows[k][3];
        }

        if (data[i].sections[j].rows[k][4] == '典') { // 排灣經典句
          var tds = tr1.getElementsByTagName('td');
          tds[1].classList += 'classic';
        }

        /* if (data[i].sections[j].rows[k][3] != '3') { // 這一小段可以用來做簡單快速的除錯
          tr1.innerHTML = '';
          tr2.innerHTML = '';
        }*/

        table.appendChild(tr1);
        table.appendChild(tr2);
      }

      for (var k=0; k<data[i].sections[j].rows.length; k++) {
        if (data[i].sections[j].rows[k][3] == undefined) {
          section.classList.remove("noHak");
          break;
        }
      }

      section.appendChild(table);
      ep.appendChild(section);
    }

    if (data[i].misc !== undefined) {
      var misc = document.createElement("p");
      misc.innerHTML = data[i].misc;
      ep.appendChild(misc);
    }

    contentContainer.appendChild(ep);

  }


}

function collapsibles() { // How To Create a Collapsible <https://www.w3schools.com/howto/howto_js_collapsible.asp>
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  } 
}

function openHeadTOC() {
  var headTOCButton = document.getElementById("headTOCButton");
  var floatedTOCButton = document.getElementById('floatedTOCButton');
  headTOCButton.addEventListener("click", function() {
    floatedTOCButton.classList.toggle("active");
    var toc = document.getElementById('floatedTOCContainer');
    if (toc.style.display === "block") {
      toc.style.display = "none";
    } else {
      toc.style.display = "block";
    }
    if (floatedTOCButton.classList.contains('active')) {
      headTOCButton.innerHTML = "收起導覽";
    } else {
      headTOCButton.innerHTML = "導覽";
    }
  });
}

function localFileIndicator() {
  if (/file\:/.test(window.location.href)) { /* javascript - How to check if the URL contains a given string? - Stack Overflow <https://stackoverflow.com/questions/4597050/how-to-check-if-the-url-contains-a-given-string> */
    document.title = "💻" + document.title;
  }
}
var namohNote = document.getElementById("namoh").innerHTML;
var ikeaNote = document.getElementById("ikea").innerHTML;
var lizuktumazNote = document.getElementById("lizuk-tumaz").innerHTML;
var giljawNote = document.getElementById("giljaw").innerHTML;
var ngayawNote = document.getElementById("ngayaw").innerHTML;

function generateCards() { // 產生字卡
  var cardsContainer = document.getElementById("cards");

  for (var i = 0; i < cards.length; i++) {
    var card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("id", "card"+(i+1));
    var cardAnchor = document.createElement("a");
    var cardAnchorNum = i+1;
    cardAnchor.setAttribute("name", cardAnchorNum);
    var cardInner = document.createElement("div");
    /*card.classList.add("grid-item");*/
    var hanji = document.createElement("div");
    hanji.classList.add("cardHanji");
    var roman = document.createElement("div");
    roman.classList.add("cardRoman");
    /*roman.classList.add("fit");*/
    roman.classList.add("fit-this-text");
    roman.classList.add("fitter");
    var notes = document.createElement("div");
    notes.classList.add("cardNotes");
    var qr = document.createElement("div");
    qr.classList.add("cardQR");
    hanji.innerHTML = cards[i][0];
    roman.innerHTML = cards[i][1];
    if (cards[i][2]!=undefined) {
      notes.innerHTML = cards[i][2];
    }
    var langLogo = document.createElement("div");
    langLogo.classList.add('cardLangLogo');
    cardInner.classList.add('hak');
    if (cards[i][3]!=undefined) {
      cardInner.classList.remove('si');
      switch (cards[i][3]) {
        case "2":
          cardInner.classList.add('nan');
          langLogo.innerHTML = "<br>鶴"
          break;
        case "3":
          cardInner.classList.add('jp');
          card.classList.add('jp');
          break;
        case "4":
          cardInner.classList.add('uk');
          card.classList.add('uk');
          card.classList.add('roman');
          // langLogo.innerHTML = "";
          break;
        case "5":
          cardInner.classList.add('fox');
          card.classList.add('fox');
          card.classList.add('roman');
          langLogo.innerHTML = "原";
          break;
        case "sv":
          cardInner.classList.add('sv');
          card.classList.add('sv');
          card.classList.add('roman');
          // langLogo.innerHTML = "";
          break;
        case "en":
          cardInner.classList.add('en');
          card.classList.add('en');
          card.classList.add('roman');
          langLogo.innerHTML = "en";
          break;
        default:
          cardInner.classList.add('hak');
          langLogo.innerHTML = "<br>客";
          break;
      }
    }
    if (cards[i][4]!=undefined) {
      var romanInner = document.createElement("span");
      romanInner.innerHTML = roman.innerHTML;
      romanInner.style.fontSize = cards[i][4]+'%';
      romanInner.style.lineHeight = cards[i][4]+'%';
      roman.innerHTML = '';
      roman.appendChild(romanInner);
    }
    cardInner.appendChild(langLogo);
    cardInner.appendChild(roman);
    cardInner.appendChild(hanji);
    cardInner.appendChild(notes);
    cardInner.appendChild(qr);
    card.appendChild(cardAnchor);
    card.appendChild(cardInner);
    cardsContainer.appendChild(card);
  }

  /* Masonry <https://masonry.desandro.com/> */
  var elem = document.querySelector('#cards');
  var msnry = new Masonry( elem, {
    // options
    itemSelector: '.card',
    columnWidth: 500,
    gutter: 15
  });

  /* Fitty */
  /*var cardRoman = document.getElementsByClassName('cardRoman');
  fitty(cardRoman);
  fitty('.cardRoman');*/

  /* FitText */
  /*window.fitText(document.getElementsByClassName('cardRoman'));*/

  /* fitext */
  /*import fitext from 'fitext'*/
  /*const EVENTS = ['DOMContentLoaded', 'resize']
  EVENTS.forEach( e => window.addEventListener( e, fitext ) )*/


}

// html - Loading javascript in body onload with 2 functions - Stack Overflow <https://stackoverflow.com/questions/10122555/loading-javascript-in-body-onload-with-2-functions>
function init() {
  create();
  fillRomanNames();
  collapsibles();
  openHeadTOC();
  localFileIndicator();
}
function cardsInit() {
  localFileIndicator();
  generateCards();
}