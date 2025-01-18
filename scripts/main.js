const safeArea = 240; // => 240x240

const R = 8.31;
var nu = 1 / 8.31;

var typeOfGraphic = 0;
var numOfPoints = 0;
var oldTable = false;
var isIsoprocess = true;

var points = {
    1: {
        p: 0,
        V: 0,
        T: 0,
    },
    .1: {
        use: 0,
        dU: 0,
        A: 0,
        Q: 0,
    },
    2: {
        p: 0,
        V: 0,
        T: 0,
    },
    .2: {
        use: 0,
        dU: 0,
        A: 0,
        Q: 0,
    },
    3: {
        p: 0,
        V: 0,
        T: 0,
    },
    .3: {
        use: 0,
        dU: 0,
        A: 0,
        Q: 0,
    },
    4: {
        p: 0,
        V: 0,
        T: 0,
    },
    .4: {
        use: 0,
        dU: 0,
        A: 0,
        Q: 0,
    },
    5: {
        p: 0,
        V: 0,
        T: 0,
    },
    .5: {
        use: 0,
        dU: 0,
        A: 0,
        Q: 0,
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
    
    for (let i = 1; i <= 5; i++) {
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

    let pMax = points[1].p;
    let VMax = points[1].V;
    let TMax = points[1].T;

    for (let i = 1; i <= numOfPoints; i++) {
        arrValues.push(points[i]);

        if (i == 1) continue;

        pMax = Math.max(pMax, points[i].p);
        VMax = Math.max(VMax, points[i].V);
        TMax = Math.max(TMax, points[i].T);
    }
    
    createResultTable(arrValues, { p: pMax, V: VMax, T:TMax });
    // plotGraphics(pMax, VMax, TMax);
}

function createResultTable(values, maxValues) {
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
            
            // console.log((i+1)/2-1, values[(i+1)/2-1]);
            
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
            
            
            // let j = i;
            // console.log(i);
            
            for (let j = 1; j <= 3; j++) {
                cell = row.insertCell();
                cell.innerHTML = checkConst(delta, j);
                cells_.push(cell);
            }
            
            // console.log(i);
            
            cell = row.insertCell();
            cell.innerHTML = nameOfProcess(delta);
            cells_.push(cell);
            
            checkTransition(delta, i / 2 - 1);
        }
        
        cells.push(cells_);
    }
    
    //document.getElementById("result").removeChild("table");
    //if (oldTable) {
    //console.log(0, oldTable);

    document.getElementById("result").replaceChildren(table);

    if (!isIsoprocess) {
        const clearCan = id => {
            let can = document.getElementById(id);
            let ctx = can.getContext("2d");

            ctx.clearRect(0, 0, can.width, can.height);
        }

        clearCan("cvs-pV");
        clearCan("cvs-pT");
        clearCan("cvs-VT");

        // document.getElementById("resultStatsOfTransition").style.display = "block";
        document.getElementById("resultStatsOfTransition").innerHTML =
            `Обнаружен не изопроцесс &rArr; графики не вычисляются, 
            таблица показана как есть.`;
        
        isIsoprocess = true;
        return;
    } else {
        // document.getElementById("resultStatsOfTransition").style.display = "none";
        document.getElementById("resultStatsOfTransition").innerHTML =
            `Ошибок не возникло.`;
    }
    
    plotGraphics(maxValues.p, maxValues.V, maxValues.T);

    // document.getElementById("resultStatsOfTransition").innerHTML = checkKPD();

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
                return `↓ в ${(p[0] / p[1]).toFixed(1)} р.`;
            } else {
                return`↑ в ${(p[1] / p[0]).toFixed(1)} р.`;
            }

        case 2: // V
            if (V[0] == V[1]) {
                return "const";
            } else if (V[0] > V[1]) {
                return `↓ в ${(V[0] / V[1]).toFixed(1)} р.`;
            } else {
                return `↑ в ${(V[1] / V[0]).toFixed(1)} р.`;
            }

        default: // T
            if (T[0] == T[1]) {
                return "const";
            } else if (T[0] > T[1]) {
                return `↓ в ${(T[0] / T[1]).toFixed(1)} р.`;
            } else {
                return `↑ в ${(T[1] / T[0]).toFixed(1)} р.`;
            }
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
            isIsoprocess = false;
            return "[Не определён]<br>pV ~ T";
    }
}

/**delta values
 * @param {number} num
 * 
 * @param {*} dValues OfTransition Номер перехода
 */
function checkTransition(dValues, numOfTransition) {
    numOfTransition = (numOfTransition + 1) / 10;

    let p = dValues.p;
    let V = dValues.V;
    let T = dValues.T;
    let dU, A;
    
    switch (true) {
        case p[0] == p[1] && V[0] != V[1] && T[0] != T[1]:
            let dV = V[1] - V[0];

            dU = 3 / 2 * p[0] * dV;
            A = p[0] * dV;

            // points[numOfTransition].dU = dU;
            // points[numOfTransition].A = A;
            // points[numOfTransition].Q = dU + A;
            // return "Изобарный<br>V/T = const";
            break;
        case V[0] == V[1] && p[0] != p[1] && T[0] != T[1]:
            let dp = p[1] - p[0];

            dU = 3 / 2 * V[0] * dp;
            A = 0;
            // return "Изохорный<br>p/T = const";
            break;
        case T[0] == T[1] && p[0] != p[1] && V[0] != V[1]:
            dU = 0;
            A = nu * R * T[0] * Math.log(p[0] / p[1]);
            // return "Изотермический<br>pV = const";
            break;
        default:
            dU = 0;
            A = 0;
            // return "[Не удалось опрелелить]<br>pV ~ T";
            break;
    }

    points[numOfTransition].use = 1;
    points[numOfTransition].dU = dU;
    points[numOfTransition].A = A;
    points[numOfTransition].Q = dU + A;

    // console.log(points[numOfTransition]);

    // checkKPD();
}

function checkKPD() {
    let Qh = 0;
    let Qc = 0;

    let Th = points[1].T; // max
    let Tc = points[1].T; // min

    for (let i = 1; i <= numOfPoints; i++) {
        let j = i / 10;

        // console.log(points[j]);
        let Q = points[j].Q;

        if (Q > 0) {
            Qh += Q;
        } else {
            Qc -= Math.abs(Q);
        }
    }

    for (let i = 2; i <= numOfPoints; i++) {
        let T = points[i].T;

        Th = Math.max(Th, T);
        Tc = Math.min(Tc, T);
    }

    let KPD = ( Qh - Math.abs(Qc) ) / Qh;
    let KPDmax = ( Th - Tc ) / Th;

    return (
        `Q<sub>н</sub> = ${Qh.toFixed(1)} Дж<br>
        Q<sub>х</sub> = ${Qc.toFixed(1)} Дж<br>
        A<sub>п</sub> = ${( Qh - Math.abs(Qc) ).toFixed(1)} Дж <br>
        &#951; = ${KPD.toFixed(3)} = ${( KPD * 100 ).toFixed(1)} %<br>
        T<sub>н</sub> = ${Th.toFixed(1)} К<br>
        T<sub>х</sub> = ${Tc.toFixed(1)} К<br>
        &#951;<sub>max</sub> = ${KPDmax.toFixed(3)} = ${( KPDmax * 100 ).toFixed(1)} %`
    );
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

function plotGraphics(pMax, VMax, TMax) {
    graphicPV( { x: VMax, y: pMax } );
    graphicPT( { x: TMax, y: pMax } );
    graphicVT( { x: TMax, y: VMax } );
}

/**
 * draw system of coordinates
 * @param {HTMLCanvasElement} cvs canvas
 * @param {number} scale scale
 * @param {string} textX text of x
 * @param {string} textY text of y
 */
function drawSystemOfCoordinates(cvs, scale, textX="x", textY="y", expX=0, expY=0) {
    // console.log(scale);

    const ctx = cvs.getContext("2d");
    
    const w = cvs.clientWidth;
    const h = cvs.clientHeight;
    // console.log(w, h);
    // const centerX = w / 2;
    // const centerY = h / 2;
    // const scale = 26;
    const gridStep = safeArea / 20;
    
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

    let textOfXFinal = textX;
    let textOfYFinal = textY;

    if (expX < -1 || expX > 2) textOfXFinal = `${textX} × 10^${expX}`;

    if (expY < -1 || expY > 2) textOfYFinal = `${textY} × 10^${expY}`;
    
    ctx.fillText(textOfXFinal, w - getWidth(textOfXFinal) - 6, h - 20 - fontH); // + 5 + h
    ctx.fillText(textOfYFinal, 20 + 5, fontH + 5);
    
    // Нуль
    // let widthOfZero = (ctx.measureText("0")).width;
    ctx.fillText("0", 20 - 5 - getWidth("0"), h - 20 + 5 + fontH); // 20 - до оси, 5 отступ, fontH высота шрифта
    
    // Оцифровка осей
    //console.log(w - Math.ceil(ctx.measureText(textX).width * 1.25));
    // x
    // 26 - scale
    for (let x = 0; x + gridStep * 2 < w - /*getWidth(`${textX} x 10^${expX}`) * 1.25*/ 20; x += gridStep * 2) {
        //console.log(x);
        if (x !== 0) {
	        const canvasX = 20 + x;
            let valueOfX;

            if (expX < -1 || expX > 2) {
                valueOfX = Math.round(x / scale.x / Math.pow(10, expX) * 10) / 10;
            } else {
                valueOfX = Math.round(x / scale.x * 10) / 10;
            }

	        ctx.fillText(
                valueOfX,
                canvasX - ( valueOfX < 20 ? getWidth(valueOfX) : 20 ) / 2,
                h - 20 + 5 + fontH,
                20
            );

            // console.log(valueOfX);
	        
	        ctx.beginPath();
	        
	        ctx.moveTo(canvasX, h - 20 - 3);
	        ctx.lineTo(canvasX, h - 20 + 3);
	        
	        ctx.stroke();
	    }
	}
	
	// y
	for (let y = 0; y + gridStep * 2 < h - fontH * 1.5; y += gridStep * 2) {
		if (y !== 0) {
			const canvasY = h - 20 - y;
            let valueOfY;
            if (expY < -1 || expY > 2) {
                valueOfY = Math.round(y / scale.y / Math.pow(10, expY) * 10) / 10;
            } else {
                valueOfY = Math.round(y / scale.y * 10) / 10;
            }

			ctx.fillText(
                valueOfY,
                ( 17 - ( getWidth(valueOfY) < 14 ? getWidth(valueOfY) : 14 ) ) / 2,
                canvasY + fontH / 2 - 2,
                14
            );

            // console.log(valueOfY);
			
			ctx.beginPath();
			
			ctx.moveTo(20 - 3, canvasY);
			ctx.lineTo(20 + 3, canvasY);
			
			ctx.stroke();
		}
	}
	
	ctx.restore();
}

function graphicPV(maxValues) {
    const cvs = document.getElementById("cvs-pV");
    const ctx = cvs.getContext("2d");

    let k = [
        safeArea / maxValues.x,
        safeArea / maxValues.y
    ];

    const scale_def = {
        x: k[0] < 1 ? k[0] : Math.floor(k[0]),
        y: k[1] < 1 ? k[1] : Math.floor(k[1]),
    };

    // let koef_scale_sc = numOfPoints !== 2 ? 1 : 0.5;

    // const scale_sc = {
    //     x: k[0] < 1 ? k[0] * koef_scale_sc : Math.floor(k[0] * koef_scale_sc),
    //     y: k[1] < 1 ? k[1] * koef_scale_sc : Math.floor(k[1] * koef_scale_sc),
    // };
    

    const exponentX = numberToExponent(maxValues.x);
    const exponentY = numberToExponent(maxValues.y);

    // console.log(exponentX, exponentY);
    
    // drawLine(cvs, ctx, 0, 0, 100, 100);
    
    drawSystemOfCoordinates(cvs, scale_def, "V, м³", "p, Па", exponentX[1], exponentY[1]);
    
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
            drawHyperbola(cvs, ctx, scale_def, coords[i-1][0], coords[i-1][1], coords[t-1][0], coords[t-1][1]);
        } else {
            drawLine(cvs, ctx, scale_def, "red", [coords[i-1], coords[t-1]]);
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

function graphicPT(maxValues) {
    const cvs = document.getElementById("cvs-pT");
    const ctx = cvs.getContext("2d");

    // const scale = Math.floor(260 / maxValue);
    let k = [
        safeArea / maxValues.x,
        safeArea / maxValues.y
    ];

    let koef_scale = numOfPoints !== 2 ? 1 : 1;

    const scale = {
        x: k[0] < 1 ? k[0] * koef_scale : Math.floor(k[0] * koef_scale),
        y: k[1] < 1 ? k[1] * koef_scale : Math.floor(k[1] * koef_scale),
    };

    // if (scaleK === 1) {
    //     let rangeEl = document.getElementById("range-pT");

    //     rangeEl.min = (scale.x + scale.y) / 20;
    //     rangeEl.step = (scale.x + scale.y) / 4;
    //     rangeEl.max = (scale.x + scale.y) * 5;
    //     rangeEl.value = (scale.x + scale.y) / 2;

    //     rangeEl.addEventListener("change", () => {
    //         graphicPT(maxValues, this.value);
    //         console.log(this.value);
    //     });
    // }

    const exponentX = numberToExponent(maxValues.x);
    const exponentY = numberToExponent(maxValues.y);
    
    drawSystemOfCoordinates(cvs, scale, "T, К", "p, Па", exponentX[1], exponentY[1]);
    
    let coords = {};
    
    for (let i = 1; i <= numOfPoints; i++) {
        // console.log(points[i]["V"], points[i]["p"], points[i + 1 <= numOfPoints ? i + 1 : 1]["V"], points[i + 1 <= numOfPoints ? i + 1 : 1]["p"]);
        coords[i - 1] = [points[i]["T"], points[i]["p"]];
    }
    
    drawLine(cvs, ctx, scale, "green", coords);
}

function graphicVT(maxValues) {
    const cvs = document.getElementById("cvs-VT");
    const ctx = cvs.getContext("2d");

    let k = [
        safeArea / maxValues.x,
        safeArea / maxValues.y
    ];

    let koef_scale = numOfPoints !== 2 ? 1 : 1;

    const scale = {
        x: k[0] < 1 ? k[0] * koef_scale : Math.floor(k[0] * koef_scale),
        y: k[1] < 1 ? k[1] * koef_scale : Math.floor(k[1] * koef_scale),
    };

    // const scale = {
    //     x: k[0] < 1 ? k[0] : Math.floor(k[0]),
    //     y: k[1] < 1 ? k[1] : Math.floor(k[1]),
    // }

    const exponentX = numberToExponent(maxValues.x);
    const exponentY = numberToExponent(maxValues.y);
    
    drawSystemOfCoordinates(cvs, scale, "T, К", "V, м³", exponentX[1], exponentY[1]);
    
    let coords = {};
    
    for (let i = 1; i <= numOfPoints; i++) {
        // console.log(points[i]["V"], points[i]["p"], points[i + 1 <= numOfPoints ? i + 1 : 1]["V"], points[i + 1 <= numOfPoints ? i + 1 : 1]["p"]);
        coords[i - 1] = [points[i]["T"], points[i]["V"]];
    }
    
    drawLine(cvs, ctx, scale, "blue", coords);
}

function drawLine(cvs, ctx, scale, color, coords) {
    let w = cvs.clientWidth;
    let h = cvs.clientHeight;
    
    // let x0 = (w - 20) / 2;
    // let y0 = (h - 20) / 2;
    
    // let scale = 26;
    
    //ctx.fillRect(1*scale+w/2,1*scale+h/2,10,10);
    
    ctx.save();
    
    ctx.beginPath();
    
    //ctx.translate(150, 150);
    
    //console.log(coords);
    //ctx.moveTo(0,0)
    
    let coords0 = convertToCanvasCoords(
        coords[0][0] * scale.x,
        coords[0][1] * scale.y,
        w, h
    );
    
    ctx.moveTo(coords0[0], coords0[1]);
    //ctx.fillText("1", coords0[0] + 30, coords0[1]);
    // console.log(coords[0][0], coords[0][1])
    /*if (coords[0][0] % 1 == 0/* || Math.ceil(x) - x == .5)
        ctx.fillText(coords[0][0], coords[0][0] * scale + x0 - 5, y0 + 20);
    if (coords[0][1] % 1 == 0)
        ctx.fillText(coords[0][1], 10 + 20, 10 + coords[0][1] * scale + 5);*/
    for (i in coords) {
        let coords_ = convertToCanvasCoords(
            coords[i][0] * scale.x,
            coords[i][1] * scale.y,
            w, h
        );
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
    
    let coords0 = convertToCanvasCoords(x0 * scale.x, y0 * scale.y, w, h);
    let coordsK = convertToCanvasCoords(xk * scale.x, yk * scale.y, w, h);
    
    k = x0 * y0;
    
    //scale = 50
    
    //console.log(k)
    //k2 = xk * yk;
    //console.log(k, k2);
    
    ctx.save();
    
    ctx.beginPath();
    ctx.strokeStyle = "red";
    
    //console.log(x0, xk)
    let iterator = (xk - x0) / 20;
    
    for (
        let x = x0;
        x0 < xk ? x <= xk : x >= xk;
        x += iterator) {
        if (x !== 0) {
            y = k / x;
            
            //console.log(scale)
            
            let coords_ = convertToCanvasCoords(x * scale.x, y * scale.y, w, h)
            
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
