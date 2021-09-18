function fillHakNames() {
  // var nodes = document.getElementById("EP7").getElementsByTagName("tr") + document.getElementById("EP8").getElementsByTagName("tr");
  var nodes = document.getElementsByTagName('tr');
  for (var i=0; i<nodes.length; i+=2) {
    if (nodes[i].classList.contains("fr")) {
      continue;
    }
    else {
      var k = i + 1; //奇數行
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
      nodes[k].getElementsByTagName('td')[0].innerHTML = nodes[k].getElementsByTagName('td')[0].innerHTML.replace(/\d/,'');
    }
  }
}

function useHL() {

  var nodes = document.getElementsByTagName("tr");
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
    
    var k = i + 1;
    var name = nodes[k].getElementsByTagName('td')[0].innerHTML.replace("：","").replace(' ','').replace(' ','').replace("&nbsp;","");
    // var names = JSON.parse(document.getElementById('names').innerHTML);
    if (names[name] == undefined) {
      continue;
    }
    else {
      nodes[i].getElementsByTagName('td')[0].innerHTML = names[name][1] + ":&nbsp;";
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

      var time = document.createElement("span");
      time.classList.add("time");
      time.innerHTML = data[i].sections[j].t;
      section.appendChild(time);

      var table = document.createElement("table");

      for (var k=0; k<data[i].sections[j].rows.length; k++) {
        var tr1 = document.createElement("tr");
        var tr2 = document.createElement("tr");
        if (data[i].sections[j].rows[k][2] === undefined) {
          data[i].sections[j].rows[k][2] = "";
        }
        tr1.innerHTML = '<td></td><td>' + data[i].sections[j].rows[k][2] + '</td>';
        var name = data[i].sections[j].rows[k][0];
        var lang = data[i].sections[j].rows[k][3];
        name = (lang === undefined) ? name : name+lang;
        if (name !== '') {
          name += "："
        }
        tr2.innerHTML = '<td>' + name + '</td><td>' + data[i].sections[j].rows[k][1] + '</td>';

        if (lang !== undefined) {
          tr1.classList += "lang"+data[i].sections[j].rows[k][3];
          tr2.classList += "lang"+data[i].sections[j].rows[k][3];
        }

        table.appendChild(tr1);
        table.appendChild(tr2);
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
  fillHakNames();
}