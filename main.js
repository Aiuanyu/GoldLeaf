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

  for (var i=0; i<data.length; i++) {

    var ep = document.createElement("div");
    ep.setAttribute("id", "EP"+data[i].EP);
    ep.setAttribute("class", "episode");
    if (data[i].draft == true) {ep.setAttribute("class","draft episode");}
    var h1 = document.createElement("h1");
    h1.innerHTML = "<p>EP" + data[i].EP + " " + data[i].title + "</p>";
    ep.appendChild(h1);

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

        if (data[i].sections[j].rows[k][3] == 3 || data[i].sections[j].rows[k][3] == 4) { // 排灣、英文
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
          tr1.innerHTML = '<td></td><td>' + trans + data[i].sections[j].rows[k][2] + '</td>'; // 跟其他語文漢字放第 2 列不同，是把華文字幕放在右邊，類似 sidenote
          tr2.innerHTML = '<td>' + namelang + '</td><td></td>'; // 這列還是要有，讓 fillHakNames() 去抓族語名，但再用 display:none 同英、法文
        }
        else { // 非排灣
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

        if (data[i].sections[j].rows[k][4] == '典') {
          var tds = tr1.getElementsByTagName('td');
          tds[1].classList += 'classic';
        }

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

// html - Loading javascript in body onload with 2 functions - Stack Overflow <https://stackoverflow.com/questions/10122555/loading-javascript-in-body-onload-with-2-functions>
function init() {
  create();
  fillRomanNames();
}