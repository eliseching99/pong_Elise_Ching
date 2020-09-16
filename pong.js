"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function pong() {
    let scoreEnemy = 0;
    let scorePlayer = 0;
    //xvelocity is for the speed going left and right
    let xvelocity = 1;
    //yvelocity is for the speed going up and down
    let yvelocity = 0.9;
    const svg = document.getElementById("canvas");
    const paddleEnemy = document.createElementNS(svg.namespaceURI, 'rect');
    Object.entries({
        x: 0, y: svg.clientHeight / 2 - 50,
        width: 20, height: 120,
        fill: 'pink',
    }).forEach(([key, val]) => paddleEnemy.setAttribute(key, String(val)));
    svg.appendChild(paddleEnemy);
    const paddlePlayer = document.createElementNS(svg.namespaceURI, 'rect');
    Object.entries({
        x: svg.clientWidth - 20, y: svg.clientHeight / 2 - 50,
        width: 20, height: 120, id: 'player',
        fill: 'pink',
    }).forEach(([key, val]) => paddlePlayer.setAttribute(key, String(val)));
    svg.appendChild(paddlePlayer);
    const ball = document.createElementNS(svg.namespaceURI, 'ellipse');
    Object.entries({
        cx: 300, cy: 300,
        rx: 10, ry: 10,
        fill: 'lightblue',
    }).forEach(([key, val]) => ball.setAttribute(key, String(val)));
    svg.appendChild(ball);
    const animate = rxjs_1.interval(5)
        .pipe(operators_1.map(() => String(1.5 + Number(ball.getAttribute('cx')))))
        .subscribe(val => ball.setAttribute('cx', val));
    //map(()=> String(Math.random()+Number(ball.getAttribute('cy')))
    let y_velocity = 1;
    // const animate_y = interval(5)
    // .pipe(
    //   map(()=> String(Number(y_velocity)*Math.random()+Number(ball.getAttribute('cy'))))
    // )
    // .subscribe(val => {y_velocity>0?Number(y_velocity)*-1:-y_velocity;ball.setAttribute('cy', String(Number(val)*Number(y_velocity)));console.log(y_velocity) });
    var text_enemy = document.createElementNS(svg.namespaceURI, "text");
    text_enemy.setAttributeNS(null, "x", "450");
    text_enemy.setAttributeNS(null, "y", "40");
    text_enemy.setAttributeNS(null, "fill", "white");
    text_enemy.setAttributeNS(null, 'font-size', '30px');
    text_enemy.textContent = "Enemy: " + scoreEnemy.toString();
    svg.appendChild(text_enemy);
    const updatescore = rxjs_1.interval(5)
        .pipe(operators_1.filter(_ => Number(ball.getAttribute("cx")) > 600 && scoreEnemy < 7 && scorePlayer < 7))
        .subscribe(() => {
        scoreEnemy += 1;
        ball.setAttribute('cx', '300');
        text_enemy.textContent = "Enemy: " + scoreEnemy.toString();
    });
    const collisions = rxjs_1.interval(5).pipe(operators_1.filter(_ => isCollide(ball, paddlePlayer)))
        .subscribe(() => { console.log("yes"); console.log(ball.getAttribute('cx')); });
    var lose_msg = document.createElementNS(svg.namespaceURI, "text");
    lose_msg.setAttributeNS(null, "x", "150");
    lose_msg.setAttributeNS(null, "y", "300");
    lose_msg.setAttributeNS(null, "fill", "red");
    lose_msg.setAttributeNS(null, 'font-size', '30px');
    svg.appendChild(lose_msg);
    const gameover = rxjs_1.interval(5)
        .pipe(operators_1.filter(_ => scoreEnemy === 7))
        .subscribe(() => { lose_msg.textContent = "pepehands u lost :("; animate.unsubscribe(); svg.removeChild(ball); });
    /*const animate = setInterval(() => ball.setAttribute('cx', String(1 + Number(ball.getAttribute('cx')))), 10);
const timer = setInterval(() => {
  clearInterval(animate);
  clearInterval(timer);
}, 5000);*/
    const keydown$ = rxjs_1.fromEvent(document, 'keydown');
    const arrowKeys$ = keydown$.pipe(operators_1.filter(({ key }) => key === 'ArrowUp' || key === 'ArrowDown'), operators_1.filter(({ repeat }) => !repeat));
    // let o =new Observable()
    // let o =new Observable()
    // let gameanimation =o.subscribe(()=>{ball.setAttribute('cx',xvelocity*Math.random()+ball.getAttributeNS(svg.namespaceURI,'cx'))})
    var newText = document.createElementNS(svg.namespaceURI, "text");
    newText.setAttributeNS(null, "x", "20");
    newText.setAttributeNS(null, "y", "40");
    newText.setAttributeNS(null, "fill", "white");
    newText.setAttributeNS(null, 'font-size', '30px');
    var textNode = document.createTextNode("Player: " + scorePlayer.toString());
    newText.appendChild(textNode);
    svg.appendChild(newText);
    // var enemy = document.createTextNode("Enemy: "+ scoreEnemy.toString());
    // text_enemy.appendChild(enemy);
    // svg.appendChild(text_enemy)
    function moveBall(ball) {
    }
    function mousePosObservable() {
        const pos = document.getElementById("player"), o = rxjs_1.fromEvent(document, "mousemove").
            pipe(operators_1.map(({ clientY }) => ({ y: clientY })));
        o.pipe(operators_1.map(({ y }) => `${y}`))
            .subscribe((s) => pos.innerHTML = s);
        //move up down the paddle
        //o.subscribe(({y})=> pos.setAttribute('y',y.toString()));
        o.pipe(operators_1.filter(({ y }) => y <= 480 && y >= 0))
            .subscribe(({ y }) => pos.setAttribute('y', y.toString()));
        o.pipe(operators_1.filter(({ y }) => y > 600 || y < 0))
            .subscribe(_ => pos.classList.add('highlight'));
        o.pipe(operators_1.filter(({ y }) => y <= 600 || y >= 0))
            .subscribe(_ => { pos.classList.remove('highlight'); });
    }
    mousePosObservable();
    function isCollide(a, b) {
        var paddle = b.getBoundingClientRect();
        return ((Number(a.getAttribute('cx'))) + Number(a.getAttribute('rx')) >= paddle.left &&
            (Number(a.getAttribute('cx'))) <= Number(b.getAttribute('x')) + Number(b.getAttribute('width')) &&
            (Number(a.getAttribute('cy')) + Number(a.getAttribute('ry')) >= paddle.top &&
                (Number(a.getAttribute('cy'))) <= Number(b.getAttribute('y')) + Number(b.getAttribute('height')))
        //  (Number(a.getAttribute('cy')))+Number(a.getAttribute('ry'))<paddle.top
        //  (Number(a.getAttribute('cx')))>paddle.right||
        //  (Number(a.getAttribute('cy')))>paddle.bottom
        );
    }
    // function isCollide(a:Element, b:Element) {
    //   return !(
    //     (Number(a.attr("y")) + Number(a.attr("height"))) < Number(b.attr("cy")) ||
    //     Number(a.attr("y")) > (Number(b.attr("cy")) + Number(b.attr("ry"))) ||
    //     (Number(a.attr("x")) + Number(a.attr("width"))) < Number(b.attr("cx"))||
    //     Number(a.attr("x")) > (Number(b.attr("cx")) + Number(b.attr("rx")))
    //   )}
}
// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map