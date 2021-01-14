function main(vertices) {
  var canvas = document.getElementById("myCanvas");
  var gl = canvas.getContext("webgl");
  canvas.height = window.innerHeight;
  
  gl.viewport(canvas.width/5, -100, canvas.width/2, canvas.height - 100)

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    // Ibaratnya di bawah ini adalah .c
    var vertexShaderSource = `
      attribute vec2 a_Position;
      attribute vec3 a_Color;
      varying vec3 v_Color;
      uniform vec2 d;
      void main() {
        mat4 translasi = mat4(
          1.0, 0.0, 0.0, 0.0,
          0.0, 1.0, 0.0, 0.0,
          0.0, 0.0, 1.0, 0.0,
          d, 0.0, 1.0
        );
        gl_Position = translasi * vec4(a_Position, 0.0, 1.0);
        v_Color = a_Color;
      }
    `;
    var fragmentShaderSource = `
      precision mediump float;
      varying vec3 v_Color;
      void main() {
        gl_FragColor = vec4(v_Color, 1.0);
      }
    `;
  
    // Ibaratnya di bawah ini adalah .o
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
    // Ibarat mengetikkan teks source code ke dalam penampung .c
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
  
    // Ibarat mengompilasi .c menjadi .o
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
  
    // Ibarat membuatkan penampung .exe
    var shaderProgram = gl.createProgram();
  
    // Ibarat memasukkan "adonan" .o ke dalam penampung .exe
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
  
    // Ibarat menggabung-gabungkan "adonan" yang ada di dalam penampung .exe
    gl.linkProgram(shaderProgram);
  
    // Ibarat memulai menggunakan "cat" .exe ke dalam konteks grafika (penggambaran)
    gl.useProgram(shaderProgram);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var aPosition = gl.getAttribLocation(shaderProgram, "a_Position");
    var aColor = gl.getAttribLocation(shaderProgram, "a_Color");
    gl.vertexAttribPointer(
      aPosition, 
      2, 
      gl.FLOAT, 
      false, 
      5 * Float32Array.BYTES_PER_ELEMENT, 
      0);
    gl.vertexAttribPointer(
      aColor, 
      3, 
      gl.FLOAT, 
      false, 
      5 * Float32Array.BYTES_PER_ELEMENT, 
      2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);
  
  
    var d = [0, 1.0];
    var uD = gl.getUniformLocation(shaderProgram, 'd');
  
    var primitive = gl.TRIANGLES;
    var offset = 0;
    var nVertex = 6;
  
    gl.uniform2fv(uD, d);
      gl.clearColor(1, 1, 1, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(primitive, 0, nVertex);
      gl.drawArrays(primitive, 6, nVertex);
      gl.drawArrays(primitive, 12, nVertex);
};

function clear(){
  var canvas = document.getElementById("myCanvas");
  var gl = canvas.getContext("webgl");
  gl.clearColor(1, 1, 1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

var map = L.map('map').setView({lon: 117.9213, lat: -1.7893}, 5);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.scale().addTo(map);

var geojsonLayer

var provinsi = new Object();

var info = L.control();

info.onAdd = function (map) 
{
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

var red = [0.863, 0.078, 0.235];
var yellow = [1, 0.647, 0];
var green = [0 , 0.8, 0];

info.update = function (props) 
{
  this._div.innerHTML = '<h4>Kasus COVID-19</h4>Arahkan kursor ke Suatu Provinsi';

  clear();

  if (props)
  {
    var current_provinsi = provinsi[`${props.Propinsi}`];
    
    var pos = -1 + (current_provinsi.positif/100000);
    if(pos < -0.7)
      colorPos = green;
    else if(pos > -0.1)
      colorPos = red;
    else
      colorPos = yellow;

      var pos = -1 + (current_provinsi.positif/70000);
    if(pos < -0.7)
      colorPos = green;
    else if(pos > -0.1)
      colorPos = red;
    else
      colorPos = yellow;

    var sem = -1 + (current_provinsi.sembuh/60000);
      if(sem < -0.7)
        colorSem = green;
      else if(pos > -0.1)
        colorSem = red;
      else
        colorSem = yellow;
    
    var men = -1 + (current_provinsi.meninggal/5000);
      if(men < -0.7)
        colorMen = red;
      else if(pos > -0.1)
        colorMen = green;
      else
        colorMen = yellow;

    vertices = [

      -0.6, pos, colorPos[0],colorPos[1],colorPos[2],      // Titik A
      -1, pos, colorPos[0],colorPos[1],colorPos[2],       // Titik B
      -0.6, -1, colorPos[0],colorPos[1],colorPos[2],      // Titik C
      -1, pos, colorPos[0],colorPos[1],colorPos[2],      // Titik A
      -0.6, -1, colorPos[0],colorPos[1],colorPos[2],      // Titik C
      -1, -1, colorPos[0],colorPos[1],colorPos[2],      // Titik D

      -0.2, sem, colorSem[0],colorSem[1],colorSem[2],      // Titik A
      0.2, sem, colorSem[0],colorSem[1],colorSem[2],       // Titik B
      0.2, -1, colorSem[0],colorSem[1],colorSem[2],      // Titik C
      -0.2, sem, colorSem[0],colorSem[1],colorSem[2],      // Titik A
      0.2, -1, colorSem[0],colorSem[1],colorSem[2],      // Titik C
      -0.2, -1, colorSem[0],colorSem[1],colorSem[2],      // Titik D

      0.6, men, colorMen[0],colorMen[1],colorMen[2],      // Titik A
      1, men, colorMen[0],colorMen[1],colorMen[2],       // Titik B
      1, -1.0, colorMen[0],colorMen[1],colorMen[2],      // Titik C
      0.6, men, colorMen[0],colorMen[1],colorMen[2],      // Titik A
      1, -1, colorMen[0],colorMen[1],colorMen[2],      // Titik C
      0.6, -1, colorMen[0],colorMen[1],colorMen[2],      // Titik D

    ];
    main(vertices);
    
    this._div.innerHTML = '<h4>Kasus COVID-19</h4>' + (props ? '<b>' + props.Propinsi + '</b><br />' : 'Arahkan ke Suatu Provinsi') + 
      (current_provinsi ?
      'Jumlah Positif : ' + current_provinsi.positif + ' orang<br />' +
      'Jumlah Sembuh : ' + current_provinsi.sembuh + ' orang<br />' +
      'Jumlah Meninggal : ' + current_provinsi.meninggal + ' orang'
      : '');
  }
};

info.addTo(map);

function newFunction() {
  clear(); {
    var gl = canvas.getContext("webgl");
    gl.clearColor(1, 1, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };
}

function categorycolor(f)
{
  var current_provinsi = provinsi[`${f.properties['Propinsi']}`];
  
  var positif = 0;

  if (current_provinsi)
  {
    positif = current_provinsi.positif;
    
    if(positif > 10000) 
    {
      color = '#DC143C';
      return color;
    }
    else if (positif > 1000)
    {
      color = '#FFA500';
      return color;
    }
    else if (positif > 0)
    {
      color = '#FFFF33';
      return color;
    }
    else if (!positif)
    {
      color = '#00cc00';
      return color;
    }
  }
  else 
  {
    color = '#A9A9A9';
    return color;
  }
}

function stylecolor(feature) 
{
  return {
    fillColor: categorycolor(feature),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function highlightFeature(e) 
{
  var layer = e.target;

  layer.setStyle(
    {
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) 
  {
    layer.bringToFront();
  }
  info.update(layer.feature.properties);
}

function resetHighlight(e) 
{
  geojsonLayer.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) 
{
  map.fitBounds(e.target.getBounds());
  highlightFeature(e);
}

function onEachFeature(feature, layer) 
{
  layer.on(
  {
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

$.getJSON('https://indonesia-covid-19.mathdro.id/api/provinsi', function(data)
{
  for (datum in data.data)
  {
    var new_object = data.data[datum];
    var provinsi_name = new_object.provinsi.toUpperCase();
    provinsi[provinsi_name] = Object.assign({},
    {
      positif : new_object["kasusPosi"],
      sembuh : new_object["kasusSemb"],
      meninggal : new_object["kasusMeni"],
    })
  }
  geojsonLayer = new L.GeoJSON.AJAX(["assets/json/indonesia-province.json"], {onEachFeature:onEachFeature, style:stylecolor});       
  geojsonLayer.addTo(map);
});

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) 
{
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1000, 10000],
    labels = [];
    
    var color = ['#00cc00', '#FFFF33', '#FFA500', '#DC143C'];

    div.innerHTML += '<div class="text-left"><i style="background:' + color[0] + '"></i> ' + grades[0] + '</div>';

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<div class="text-left"><i style="background:' + color[i+1] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '</div>' : '+');
    }
    return div;
};

legend.addTo(map);