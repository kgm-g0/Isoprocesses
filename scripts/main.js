const R = 8.31;
var nu = 1 / 8.31;

var typeOfGraphic = 0;
var numOfPoints = 0;
var oldTable = false;

var points = {
    1: {
        p: 1,
        V: 1,
        T: 1,
    },
    2: {
        p: 1,
        V: 1,
        T: 1,
    },
    3: {
        p: 1,
        V: 1,
        T: 1,
    },
    4: {
        p: 1,
        V: 1,
        T: 1,
    }, //...
};


function step1(el) {
    let value = el.value;
    typeOfGraphic = +value;
    if (numOfPoints != 0) refreshTextOfInput();
    
    document.getElementById("step2Elem").style.display = "block";
    document.getElementById("resultWindow").style.display = "none";
    //console.log(value);
}

function step2(el) {
    let value = el.value;
    numOfPoints = +value;
    
    document.getElementById("step3Elem").style.display = "block";
    document.getElementById("resultWindow").style.display = "none";
    
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`${i}Point`).style.display = "none";
        document.getElementById(`${i}PointTable`).style.borderBottom = "1px solid black";
    }
    
    for (let i = 1; i <= numOfPoints; i++) {
        document.getElementById(`${i}Point`).style.display = "block";
    }
    
    document.getElementById(`${numOfPoints}PointTable`).style.borderBottom = "none";
    
    refreshTextOfInput();
}

function submit() {
    let id = id => document.getElementById(id);
    id("resultWindow").style.display = "block";
    
    switch (typeOfGraphic) {
        case 1: // p(V)
            for (let i = 1; i <= numOfPoints; i++) {
                let V_ = id(`1Label${i}Point`).value;
                let p_ = id(`2Label${i}Point`).value;
                
                points[i].V = V_ != "" ? +V_ : 1;
                points[i].p = p_ != "" ? +p_ : 1;
                points[i].T = points[i].p * points[i].V / (nu * R);
            }
            
            break;
        case 2: // p(T)
            for (let i = 1; i <= numOfPoints; i++) {
                let T_ = id(`1Label${i}Point`).value;
                let p_ = id(`2Label${i}Point`).value;
                
                points[i].T = T_ != "" ? +T_ : 1;
                points[i].p = p_ != "" ? +p_ : 1;
                points[i].V = nu * R * points[i].T / points[i].p;
            }
            
            break;
        default: // V(T)
            for (let i = 1; i <= numOfPoints; i++) {
                let T_ = id(`1Label${i}Point`).value;
                let V_ = id(`2Label${i}Point`).value;
                
                points[i].T = T_ != "" ? +T_ : 1;
                points[i].V = V_ != "" ? +V_ : 1;
                points[i].p = nu * R * points[i].T / points[i].V;
            }
            
            break;
    }
    
    let arrValues = [];
    for (let i = 1; i <= numOfPoints; i++)
        arrValues.push(points[i]);
    
    createResultTable(arrValues);
    plotGraphics();
}

function createResultTable(values) {
    const table = document.createElement("table");
    table.style.textAlign = "center";
    let rows = [];
    let cells = [];
    
    //console.log(values.length);
    
    for (let i = 0; i < (values.length > 2 ? values.length * 2 + 1 : values.length * 2); i++) {
        rows.push(table.insertRow());
    }
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let cells_ = [];
        
        if (i == 0) {
            for (const text of ["Состояние, переход", "p, Па", "V, м<sup>3</sup>", "T, К", "Процесс"]) {
                let cell = row.insertCell();
                cell.innerHTML = text;
                cell.style.fontWeight = "bold";
                cells_.push(cell);
            }
        } else if (i % 2 != 0) {
            let cell;
            cell = row.insertCell();
            cell.innerHTML = `Точка ${(i+1)/2}`;
            cells_.push(cell);
            
            //console.log(i, (i+1)/2-1, values[(i+1)/2-1]);
            
            for (j in values[(i+1)/2-1]) {
                cell = row.insertCell();
                cell.innerHTML = values[(i+1)/2-1][j];
                cells_.push(cell);
            }
            
            cell = row.insertCell();
            cell.innerHTML = "";
            cells_.push(cell);
        } else {
            let cell;
            cell = row.insertCell();
            if (rows.length != 4)
                cell.innerHTML = `Переход ${i/2}-${i/2+1 < rows.length/2?i/2+1:1}`;
            else
                cell.innerHTML = "Переход 1-2";
            cells_.push(cell);
            
            let delta = {
                p: [
                    values[i/2-1].p,
                    values[i/2<values.length?i/2:0].p,
                ],
                V: [
                    values[i/2-1].V,
                    values[i/2<values.length?i/2:0].V,
                ],
                T: [
                    values[i/2-1].T,
                    values[i/2<values.length?i/2:0].T,
                ],
            }
            
            for (let i = 1; i <= 3; i++) {
                cell = row.insertCell();
                cell.innerHTML = checkConst(delta, i);
                cells_.push(cell);
            }
            
            cell = row.insertCell();
            cell.innerHTML = nameOfProcess(delta);
            cells_.push(cell);
        }
        
        cells.push(cells_);
    }
    
    //document.getElementById("result").removeChild("table");
    //if (oldTable) {
        //console.log(0, oldTable);
    document.getElementById("result").replaceChildren(table);
        //table.id = "oldTable";
        //console.log(1, oldTable);
    //} else {
    //    oldTable = document.getElementById("result").appendChild(table);
     //   table.id = "oldTable";
     //   oldTable = true;
      //  //console.log(2, oldTable);
    //}
}

function refreshTextOfInput() {
    for (let i = 1; i <= numOfPoints; i++) {
        let id = id => document.getElementById(id);
        let text = ["", ""];
        
        switch (typeOfGraphic) {
            case 1:
                // p(V)
                text[0] = "V [м<sup>3</sup>]:";
                text[1] = "p [Па]:";
                break;
            case 2:
                // p(T)
                text[0] = "T [К]:";
                text[1] = "p [Па]";
                break;
            default:
                // V(T)
                text[0] = "T [К]";
                text[1] = "V [м<sup>3</sup>]:";
                break;
        }
        
        id(`1Label${i}PointLabel`).innerHTML = text[0];
        id(`2Label${i}PointLabel`).innerHTML = text[1];
    }
}

function checkConst(values, param) {
    let p = values.p;
    let V = values.V;
    let T = values.T;
    
    let text;
    
    switch (param) {
        case 1: // p
            if (p[0] == p[1]) {
                return "const";
            } else if (p[0] > p[1]) {
                return `↓ в ${p[0] / p[1]} р.`;
            } else {
                return`↑ в ${p[1] / p[0]} р.`;
            }
            
            break;
        case 2: // V
            if (V[0] == V[1]) {
                return "const";
            } else if (V[0] > V[1]) {
                return `↓ в ${V[0] / V[1]} р.`;
            } else {
                return `↑ в ${V[1] / V[0]} р.`;
            }
            
            break;
        default: // T
            if (T[0] == T[1]) {
                return "const";
            } else if (T[0] > T[1]) {
                return `↓ в ${T[0] / T[1]} р.`;
            } else {
                return `↑ в ${T[1] / T[0]} р.`;
            }
            
            break;
    }
}

function nameOfProcess(values) {
    let p = values.p;
    let V = values.V;
    let T = values.T;
    
    switch (true) {
        case p[0] == p[1] && V[0] != V[1] && T[0] != T[1]:
            return "Изобарный<br>V/T = const";
        case V[0] == V[1] && p[0] != p[1] && T[0] != T[1]:
            return "Изохорный<br>p/T = const";
        case T[0] == T[1] && p[0] != p[1] && V[0] != V[1]:
            return "Изотермический<br>pV = const";
        default:
            return "[Не удалось опрелелить]<br>pV ~ T";
    }
}

function numberToExponent(num) {
    if (num == 0) return [0, 0];

    let exponent = Math.floor(Math.log10(num));
    let mantissa = num / Math.pow(10, exponent);

    mantissa = Math.round(mantissa * 10) / 10;
    
    if (mantissa == 10) {
        exponent++;
        mantissa = 1;
    }

    return [mantissa, exponent];
}

/**
 * Возвращает человекопонятную запись числа
 * мантиссой-экспонентой
 * @param {Number} m Мантисса
 * @param {Number} e Экспонента
 * @return {String}
 */
const exponentaToString = (m, e) =>
    e <= 2 && e >= -2 || m == 0 ? `${Math.round(m * Math.pow(10, e))}` : `${m.toString().replaceAll(".", ",")} * 10^${e}`;

function plotGraphics() {
    graphicPV();
    graphicPT();
    graphicVT();
}

function drawSystemOfCoordinates(cvs, textX="x", textY="y") {
    const ctx = cvs.getContext("2d");
    
    const w = cvs.clientWidth;
    const h = cvs.clientHeight;
    // console.log(w, h);
    const centerX = w / 2;
    const centerY = h / 2;
    const scale = 26;
    const gridStep = scale / 2;
    
    ctx.save();
    
    ctx.clearRect(0, 0, w, h);
    
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    
    // Рисование сетки
    ctx.strokeStyle = 'lightgray';
    for (let x = 20 - gridStep; x <= w; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for (let y = w - 20 + gridStep; y >= 0; y -= gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
    
    ctx.restore();
    
    
    ctx.save();
    
    //ctx.clearRect(0, 0, w, h);
    
    //ctx.translate(20, h - 20)
    
    // Рисование осей
    ctx.beginPath();
    
    ctx.moveTo(20, 0);
    ctx.lineTo(20, h);
    //ctx.moveTo()
    
    ctx.moveTo(0, h - 20);
    ctx.lineTo(w, h - 20);
    
    ctx.strokeStyle = 'black';
    ctx.stroke();
    
    // Рисование стрелок (by KGM)
    ctx.beginPath();
    
    ctx.moveTo(20 - 4, 6);
    ctx.lineTo(20, 0);
    ctx.lineTo(20 + 4, 6);
    
    ctx.moveTo(w - 6, h - 20 - 4);
    ctx.lineTo(w, h - 20);
    ctx.lineTo(w - 6, h - 20 + 4);
    
    ctx.strokeStyle = 'black';
    ctx.stroke();
    
    // Подписи
    ctx.font = '12px Arial';
    
    let getWidth = text => Math.ceil(ctx.measureText(text).width);
    
    let fontH = getWidth("M");
    
    ctx.fillText(textX, w - getWidth(textX) * 1.25, h - 20 + 5 + fontH);
    ctx.fillText(textY, 20 + 5, fontH + 5);
    
    // Нуль
    // let widthOfZero = (ctx.measureText("0")).width;
    ctx.fillText("0", 20 - 5 - getWidth("0"), h - 20 + 5 + fontH); // 20 - до оси, 5 отступ, fontH высота шрифта
    
    // Оцифровка осей
    //console.log(w - Math.ceil(ctx.measureText(textX).width * 1.25));
    // x
    // 26 - scale
    for (let x = 0; x + 26 < w - getWidth(textX) * 1.25; x += 26) {
        //console.log(x);
        if (x / 26 != 0) {
	        const canvasX = 20 + x;
	        ctx.fillText(x / 26, canvasX - getWidth(x / 26) / 2, h - 20 + 5 + fontH);
	        
	        ctx.beginPath();
	        
	        ctx.moveTo(canvasX, h - 20 - 3);
	        ctx.lineTo(canvasX, h - 20 + 3);
	        
	        ctx.stroke();
	    }
	    
	    //console.log(x/constScale, x, width/2 + constScale);
	}
	
	// y
	for (let y = 0; y + 26 < h - fontH * 1.5; y += 26) {
		if (y / 26 != 0) {
			const canvasY = h - 20 - y;
			ctx.fillText(y / 26, 20 - getWidth(y / 26) - 5, canvasY + fontH / 2 - 2);
			
			ctx.beginPath();
			
			ctx.moveTo(20 - 3, canvasY);
			ctx.lineTo(20 + 3, canvasY);
			
			ctx.stroke();
		}
	}
	
	ctx.restore();
}

function graphicPV() {
    const cvs = document.getElementById("cvs-pV");
    const ctx = cvs.getContext("2d");
    
    // drawLine(cvs, ctx, 0, 0, 100, 100);
    
    drawSystemOfCoordinates(cvs, "V, м³", "p, Па");
    
    let coords = {};
    
    for (let i = 1; i <= numOfPoints; i++) {
        // console.log(points[i]["V"], points[i]["p"], points[i + 1 <= numOfPoints ? i + 1 : 1]["V"], points[i + 1 <= numOfPoints ? i + 1 : 1]["p"]);
        coords[i - 1] = [points[i]["V"], points[i]["p"]];
    }
    
    for (let i = 1; i <= numOfPoints; i++) {
        let t = i+1 <= numOfPoints ? i+1 : 1;
        // console.log(i, coords);
        //console.log(points[i+1].V, points[t].p);
        if (points[i]["T"] == points[t]["T"]){
            //console.log(coords[i-1], coords[t]);
            drawHyperbola(cvs, ctx, 26, coords[i-1][0], coords[i-1][1], coords[t-1][0], coords[t-1][1]);
        } else {
            drawLine(cvs, ctx, "red", [coords[i-1], coords[t-1]]);
        }
    }
    
    //drawLine(cvs, ctx, coords);
    
    
    //drawHyperbola(cvs, ctx, 26, 1, 1, .25, 4);
    
    /*drawLine(cvs,ctx,{
        0: [1, 4],
        1: [4, 1],
    })*/
    
    /*drawLine(cvs, ctx, {
        0: [0, 0],
        1: [0, 10],
        2: [10, 10],
        3: [10, 0],
    });*/
}

function graphicPT() {
    const cvs = document.getElementById("cvs-pT");
    const ctx = cvs.getContext("2d");
    
    drawSystemOfCoordinates(cvs, "T, К", "p, Па");
    
    let coords = {};
    
    for (let i = 1; i <= numOfPoints; i++) {
        // console.log(points[i]["V"], points[i]["p"], points[i + 1 <= numOfPoints ? i + 1 : 1]["V"], points[i + 1 <= numOfPoints ? i + 1 : 1]["p"]);
        coords[i - 1] = [points[i]["T"], points[i]["p"]];
    }
    
    drawLine(cvs, ctx, "green", coords);
}

function graphicVT() {
    const cvs = document.getElementById("cvs-VT");
    const ctx = cvs.getContext("2d");
    
    drawSystemOfCoordinates(cvs, "T, К", "V, м³");
    
    let coords = {};
    
    for (let i = 1; i <= numOfPoints; i++) {
        // console.log(points[i]["V"], points[i]["p"], points[i + 1 <= numOfPoints ? i + 1 : 1]["V"], points[i + 1 <= numOfPoints ? i + 1 : 1]["p"]);
        coords[i - 1] = [points[i]["T"], points[i]["V"]];
    }
    
    drawLine(cvs, ctx, "blue", coords);
}

function drawLine(cvs, ctx, color, coords) {
    let w = cvs.clientWidth;
    let h = cvs.clientHeight;
    
    let x0 = (w - 20) / 2;
    let y0 = (h - 20) / 2;
    
    let scale = 26;
    
    //ctx.fillRect(1*scale+w/2,1*scale+h/2,10,10);
    
    ctx.save();
    
    ctx.beginPath();
    
    //ctx.translate(150, 150);
    
    //console.log(coords);
    //ctx.moveTo(0,0)
    
    let coords0 = convertToCanvasCoords(coords[0][0] * scale, coords[0][1] * scale, w, h);
    
    ctx.moveTo(coords0[0], coords0[1]);
    //ctx.fillText("1", coords0[0] + 30, coords0[1]);
    // console.log(coords[0][0], coords[0][1])
    /*if (coords[0][0] % 1 == 0/* || Math.ceil(x) - x == .5)
        ctx.fillText(coords[0][0], coords[0][0] * scale + x0 - 5, y0 + 20);
    if (coords[0][1] % 1 == 0)
        ctx.fillText(coords[0][1], 10 + 20, 10 + coords[0][1] * scale + 5);*/
    for (i in coords) {
        let coords_ = convertToCanvasCoords(coords[i][0] * scale, coords[i][1] * scale, w, h);
        let x = coords_[0];
        let y = coords_[1];
        
        ctx.lineTo(x, y);
        //console.log(x,y)
    }
    ctx.lineTo(coords0[0], coords0[1]);
    
    ctx.strokeStyle = color;
    
    //ctx.moveTo(0, 0);
    //ctx.lineTo(50, 50);
    
    ctx.stroke();
    
    ctx.restore();
    /*ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(60, 50);
    ctx.stroke();*/
}

function drawHyperbola(cvs, ctx, scale, x0, y0, xk, yk) {
    const w = cvs.clientWidth;
    const h = cvs.clientHeight;
    
    let coords0 = convertToCanvasCoords(x0 * scale, y0 * scale, w, h);
    let coordsK = convertToCanvasCoords(xk * scale, yk * scale, w, h);
    
    k = x0 * y0;
    
    //scale = 50
    
    //console.log(k)
    //k2 = xk * yk;
    //console.log(k, k2);
    
    ctx.save();
    
    ctx.beginPath();
    ctx.strokeStyle = "red";
    
    //console.log(x0, xk)
    
    for (let x = x0; x0 < xk ? x <= xk : x >= xk; x += x0 < xk ? 1 / 16 : -1 / 16) {
        if (x != 0) {
            y = k / x;
            
            //console.log(scale)
            
            let coords_ = convertToCanvasCoords(x * scale, y * scale, w, h)
            
            ctx.lineTo(coords_[0], coords_[1]);
            
            // console.log(coords_, x, y);
            
            // if (x % 1 == 0)
            //     ctx.fillText(x, coords_[0], h - 5);
            // if (y % 1 == 0 || Math.ceil(y) - y == .5)
            //     ctx.fillText(y, 2, coords_[1]);
        } else {
            ctx.stroke();
            ctx.beginPath();
        }
    }
    
    ctx.stroke();
    
    ctx.restore();
}

function convertToCanvasCoords(xPrime, yPrime, W, H) {
    // Переводим координаты из (со') в (со)
    const x = xPrime + 20;
    const y = H - 20 - yPrime;
    return [ x, y ];
}

function convertToPrimeCoords(x, y, W, H) {
    // Переводим координаты из (со) в (со')
    const xPrime = x - 20;
    const yPrime = H - 20 - y;
    return [ xPrime, yPrime ];
}

//console.log(convertToCanvasCoords(0, 0, 300, 300));
//console.log(convertToPrimeCoords(20, 280, 300, 300))
