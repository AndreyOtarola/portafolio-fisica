/* ==========================================================
   Simulaciones interactivas — Portafolio de Física I
   Cada bloque controla el canvas de una semana usando
   directamente las ecuaciones vistas en el tema.
   ========================================================== */

const $ = (id) => document.getElementById(id);
const onInput = (id, fn) => $(id) && $(id).addEventListener("input", fn);
const onClick = (id, fn) => $(id) && $(id).addEventListener("click", fn);

/* ---------- SEMANA 1: MRUA ---------- */
(() => {
    const canvas = $("canvasMRUA");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const escala = 55; // px por metro
    let v0 = 2, a = 1, t = 0, animando = false, raf;

    const dibujar = (x, v) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.moveTo(20, 140); ctx.lineTo(680, 140); ctx.stroke();

        const px = Math.min(20 + x * escala, 660);
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.arc(px, 120, 14, 0, Math.PI * 2);
        ctx.fill();

        $("outT").textContent = t.toFixed(1);
        $("outV").textContent = v.toFixed(1);
        $("outX").textContent = x.toFixed(1);
    };

    const paso = () => {
        t += 0.05;
        const x = v0 * t + 0.5 * a * t * t;
        const v = v0 + a * t;
        dibujar(Math.max(x, 0), v);
        if (x * escala < 640 && x >= 0) {
            raf = requestAnimationFrame(paso);
        } else {
            animando = false;
        }
    };

    onInput("sliderV0", (e) => { v0 = +e.target.value; $("valV0").textContent = v0; });
    onInput("sliderA", (e) => { a = +e.target.value; $("valA").textContent = a; });

    onClick("btnMRUA", () => {
        if (animando) return;
        animando = true;
        t = 0;
        paso();
    });

    onClick("btnMRUAReset", () => {
        cancelAnimationFrame(raf);
        animando = false;
        t = 0;
        dibujar(0, v0);
    });

    dibujar(0, v0);
})();

/* ---------- SEMANA 2: MCU ---------- */
(() => {
    const canvas = $("canvasMCU");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 350, cy = 140;
    let omega = 1.5, r = 80, theta = 0, corriendo = false, raf;

    const dibujar = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        const rMetros = r / 55;
        const v = omega * rMetros;
        const ac = omega * omega * rMetros;
        $("outVMCU").textContent = v.toFixed(2);
        $("outAc").textContent = ac.toFixed(2);
    };

    const paso = () => {
        theta += omega * 0.03;
        dibujar();
        if (corriendo) raf = requestAnimationFrame(paso);
    };

    onInput("sliderOmega", (e) => { omega = +e.target.value; $("valOmega").textContent = omega.toFixed(1); dibujar(); });
    onInput("sliderR", (e) => { r = +e.target.value; $("valR").textContent = r; dibujar(); });

    onClick("btnMCU", () => {
        corriendo = !corriendo;
        if (corriendo) paso();
        else cancelAnimationFrame(raf);
    });

    dibujar();
})();

/* ---------- SEMANA 3: Fricción en plano inclinado ---------- */
(() => {
    const canvas = $("canvasFriccion");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const g = 9.8;
    let angulo = 20, mu = 0.3, pos = 0, animando = false, raf;

    const dibujarPlano = () => {
        const rad = angulo * Math.PI / 180;
        const largo = 500;
        const x0 = 40, y0 = 190;
        const x1 = x0 + largo * Math.cos(rad);
        const y1 = y0 - largo * Math.sin(rad);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.lineWidth = 1;

        const px = x0 + pos * Math.cos(rad);
        const py = y0 - pos * Math.sin(rad);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-rad);
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(-14, -28, 28, 28);
        ctx.restore();

        return rad;
    };

    const actualizarDatos = (rad) => {
        const aNeta = g * (Math.sin(rad) - mu * Math.cos(rad));
        $("outANeta").textContent = aNeta.toFixed(2);
        $("outEstado").textContent = aNeta > 0.05
            ? "La caja se desliza"
            : "La fricción retiene la caja (equilibrio)";
        return aNeta;
    };

    const paso = () => {
        const rad = angulo * Math.PI / 180;
        const aNeta = g * (Math.sin(rad) - mu * Math.cos(rad));
        if (aNeta > 0) {
            pos += aNeta * 1.4;
        }
        dibujarPlano();
        actualizarDatos(rad);
        if (aNeta > 0 && pos < 480) {
            raf = requestAnimationFrame(paso);
        } else {
            animando = false;
        }
    };

    onInput("sliderAngulo", (e) => {
        angulo = +e.target.value; $("valAngulo").textContent = angulo;
        const rad = dibujarPlano(); actualizarDatos(rad);
    });
    onInput("sliderMu", (e) => {
        mu = +e.target.value; $("valMu").textContent = mu.toFixed(2);
        const rad = dibujarPlano(); actualizarDatos(rad);
    });

    onClick("btnFriccion", () => {
        if (animando) return;
        animando = true;
        paso();
    });

    onClick("btnFriccionReset", () => {
        cancelAnimationFrame(raf);
        animando = false;
        pos = 0;
        const rad = dibujarPlano();
        actualizarDatos(rad);
    });

    const radInicial = dibujarPlano();
    actualizarDatos(radInicial);
})();

/* ---------- SEMANA 4: Energía en rampa curva ---------- */
(() => {
    const canvas = $("canvasEnergia");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const g = 9.8, masa = 2, alturaMax = 5;
    let s = 0, animando = false, raf;

    // Rampa: altura en función de la distancia recorrida (curva descendente)
    const altura = (s) => alturaMax * Math.max(0, 1 - s / 400) ** 1.5;

    const dibujar = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // pista
        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath();
        for (let px = 0; px <= 500; px += 5) {
            const h = altura(px);
            const py = 220 - h * 30;
            px === 0 ? ctx.moveTo(60 + px, py) : ctx.lineTo(60 + px, py);
        }
        ctx.stroke();

        const h = altura(s);
        const py = 220 - h * 30;
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.arc(60 + s, py, 12, 0, Math.PI * 2);
        ctx.fill();

        const ep = masa * g * h;
        const epMax = masa * g * alturaMax;
        const ec = Math.max(epMax - ep, 0);

        $("outEp").textContent = ep.toFixed(0);
        $("outEc").textContent = ec.toFixed(0);
        $("outEtotal").textContent = (ep + ec).toFixed(0);

        // barras de energía
        const baseY = 260, altoMax = 60;
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(600, baseY - (ep / epMax) * altoMax, 30, (ep / epMax) * altoMax);
        ctx.fillStyle = "#f97316";
        ctx.fillRect(645, baseY - (ec / epMax) * altoMax, 30, (ec / epMax) * altoMax);
        ctx.fillStyle = "#0f172a";
        ctx.font = "12px Poppins, sans-serif";
        ctx.fillText("Ep", 605, baseY + 15);
        ctx.fillText("Ec", 650, baseY + 15);
    };

    const paso = () => {
        s += 3;
        dibujar();
        if (s < 400) raf = requestAnimationFrame(paso);
        else animando = false;
    };

    onClick("btnEnergia", () => {
        if (animando) return;
        animando = true;
        paso();
    });

    onClick("btnEnergiaReset", () => {
        cancelAnimationFrame(raf);
        animando = false;
        s = 0;
        dibujar();
    });

    dibujar();
})();

/* ---------- SEMANA 3: Fuerza Centrípeta en curva ---------- */
(() => {
    const canvas = $("canvasCentripeta");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const masaAuto = 1000; // kg
    let v = 12, r = 80, mu = 0.8;

    const calcular = () => {
        const fc = (masaAuto * v * v) / r;
        const fricMax = mu * masaAuto * 9.8;
        $("outFcNec").textContent = fc.toFixed(0);
        $("outFricMax").textContent = fricMax.toFixed(0);
        $("outDerrape").textContent = fc > fricMax
            ? "⚠ El auto derrapa fuera de la curva"
            : "✔ El auto toma la curva sin derrapar";
        return { fc, fricMax };
    };

    const dibujar = () => {
        const { fc, fricMax } = calcular();
        const cx = 350, cy = 150;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        const ang = -Math.PI / 2;
        const x = cx + r * Math.cos(ang);
        const y = cy + r * Math.sin(ang);
        ctx.fillStyle = fc > fricMax ? "#ef4444" : "#2563eb";
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
    };

    onInput("sliderVAuto", (e) => { v = +e.target.value; $("valVAuto").textContent = v; dibujar(); });
    onInput("sliderRCurva", (e) => { r = +e.target.value; $("valRCurva").textContent = r; dibujar(); });
    onInput("sliderMuCurva", (e) => { mu = +e.target.value; $("valMuCurva").textContent = mu.toFixed(2); dibujar(); });

    dibujar();
})();

/* ---------- SEMANA 5: Impulso ---------- */
(() => {
    const canvas = $("canvasImpulso");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let F = 500, dt = 2, m = 200;

    const dibujar = () => {
        const J = F * dt;
        const deltaV = J / m;
        $("outJ").textContent = J.toFixed(0);
        $("outDeltaV").textContent = deltaV.toFixed(2);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath(); ctx.moveTo(20, 100); ctx.lineTo(680, 100); ctx.stroke();

        // nave (triángulo) con longitud de "estela" proporcional al impulso
        const estela = Math.min(J / 10, 400);
        ctx.strokeStyle = "#f97316";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(150, 100); ctx.lineTo(150 - estela, 100);
        ctx.stroke();
        ctx.lineWidth = 1;

        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.moveTo(170, 100); ctx.lineTo(150, 88); ctx.lineTo(150, 112);
        ctx.closePath();
        ctx.fill();
    };

    onInput("sliderFImpulso", (e) => { F = +e.target.value; $("valFImpulso").textContent = F; dibujar(); });
    onInput("sliderTImpulso", (e) => { dt = +e.target.value; $("valTImpulso").textContent = dt; dibujar(); });
    onInput("sliderMImpulso", (e) => { m = +e.target.value; $("valMImpulso").textContent = m; dibujar(); });

    dibujar();
})();

/* ---------- SEMANA 5: Colisión perfectamente inelástica ---------- */
(() => {
    const canvas = $("canvasColision");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const v1i = 4, v2i = -2; // velocidades iniciales fijas (m/s)
    let m1 = 2, m2 = 4, x1 = 100, x2 = 500, vel1 = 0, vel2 = 0, animando = false, raf, colisiono = false, unidas = false;

    const radio = (m) => 10 + m * 3;

    const dibujar = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.moveTo(20, 140); ctx.lineTo(680, 140); ctx.stroke();

        if (unidas) {
            ctx.fillStyle = "#7c3aed";
            ctx.beginPath(); ctx.arc((x1 + x2) / 2, 120, radio(m1 + m2), 0, Math.PI * 2); ctx.fill();
        } else {
            ctx.fillStyle = "#2563eb";
            ctx.beginPath(); ctx.arc(x1, 120, radio(m1), 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#f97316";
            ctx.beginPath(); ctx.arc(x2, 120, radio(m2), 0, Math.PI * 2); ctx.fill();
        }
    };

    const reset = () => {
        cancelAnimationFrame(raf);
        animando = false; colisiono = false; unidas = false;
        x1 = 100; x2 = 500;
        vel1 = v1i; vel2 = v2i;
        $("outV1p").textContent = "0.0";
        $("outPTotal").textContent = (m1 * v1i + m2 * v2i).toFixed(1);
        dibujar();
    };

    const paso = () => {
        if (!unidas) {
            x1 += vel1 * 4; x2 += vel2 * 4;
        } else {
            x1 += vel1 * 4; x2 = x1;
        }

        if (!colisiono && x2 - x1 <= radio(m1) + radio(m2)) {
            colisiono = true; unidas = true;
            const vf = (m1 * v1i + m2 * v2i) / (m1 + m2);
            vel1 = vf;
            $("outV1p").textContent = vf.toFixed(2);
        }

        dibujar();
        if (x1 > 15 && x1 < 685) {
            raf = requestAnimationFrame(paso);
        } else {
            animando = false;
        }
    };

    onInput("sliderM1", (e) => { m1 = +e.target.value; $("valM1").textContent = m1; reset(); });
    onInput("sliderM2", (e) => { m2 = +e.target.value; $("valM2").textContent = m2; reset(); });

    onClick("btnColision", () => {
        if (animando) return;
        animando = true;
        paso();
    });

    onClick("btnColisionReset", reset);

    reset();
})();

/* ---------- SEMANA 6: Conservación del Momento Angular ---------- */
(() => {
    const canvas = $("canvasMomentoAngular");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 350, cy = 140;
    const L = 1.2; // momento angular constante de referencia
    let r = 90, theta = 0, corriendo = false, raf;

    const dibujar = () => {
        const I = (r / 100) ** 2;      // I ∝ r² (masa puntual)
        const omega = L / I;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

        ctx.strokeStyle = "#94a3b8";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r * Math.cos(theta), cy + r * Math.sin(theta));
        ctx.stroke();

        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        ctx.fillStyle = "#2563eb";
        ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "#0f172a";
        ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();

        $("outIRel").textContent = I.toFixed(2);
        $("outOmegaL").textContent = omega.toFixed(2);
        $("outLConst").textContent = (I * omega).toFixed(2);

        return omega;
    };

    const paso = () => {
        const omega = dibujar();
        theta += omega * 0.03;
        if (corriendo) raf = requestAnimationFrame(paso);
    };

    onInput("sliderRGiro", (e) => { r = +e.target.value; $("valRGiro").textContent = r; dibujar(); });

    onClick("btnMomentoAngular", () => {
        corriendo = !corriendo;
        if (corriendo) paso();
        else cancelAnimationFrame(raf);
    });

    dibujar();
})();

/* ---------- SEMANA 8: Órbita de un satélite ---------- */
(() => {
    const canvas = $("canvasOrbita");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 350, cy = 150;
    const G = 6.674e-11, M = 5.972e24, radioTierraKm = 6371;
    const escala = 0.028; // px por km (sobre la altitud)
    let altitud = 300, theta = 0, corriendo = false, raf;

    const dibujar = () => {
        const rKm = radioTierraKm + altitud;
        const rM = rKm * 1000;
        const vOrbital = Math.sqrt(G * M / rM); // m/s
        const periodoSeg = 2 * Math.PI * Math.sqrt(rM ** 3 / (G * M));

        $("outVOrbital").textContent = (vOrbital / 1000).toFixed(2);
        $("outPeriodo").textContent = (periodoSeg / 60).toFixed(1);

        const radioTierraPx = 55;
        const radioOrbitaPx = radioTierraPx + altitud * escala;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#2563eb";
        ctx.beginPath(); ctx.arc(cx, cy, radioTierraPx, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath(); ctx.arc(cx, cy, radioOrbitaPx, 0, Math.PI * 2); ctx.stroke();

        const x = cx + radioOrbitaPx * Math.cos(theta);
        const y = cy + radioOrbitaPx * Math.sin(theta);
        ctx.fillStyle = "#f97316";
        ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();

        return periodoSeg;
    };

    const paso = () => {
        const periodoSeg = dibujar();
        const omegaVisual = (2 * Math.PI) / (periodoSeg / 90); // velocidad angular visual acelerada
        theta += omegaVisual * 0.03;
        if (corriendo) raf = requestAnimationFrame(paso);
    };

    onInput("sliderAltOrbita", (e) => { altitud = +e.target.value; $("valAltOrbita").textContent = altitud; dibujar(); });

    onClick("btnOrbita", () => {
        corriendo = !corriendo;
        if (corriendo) paso();
        else cancelAnimationFrame(raf);
    });

    dibujar();
})();