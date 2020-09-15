import { interval, fromEvent, from, zip, observable } from 'rxjs'
import { map, scan, filter, merge, flatMap, take, concat} from 'rxjs/operators'
import { Observable, Subject, ReplaySubject, of, range } from 'rxjs';
function pong() {
  let scoreEnemy:number =0;
  let scorePlayer:number= 0;
    //xvelocity is for the speed going left and right
let xvelocity: number = 1;
//yvelocity is for the speed going up and down
let yvelocity: number = 0.9; 

  
    const svg:HTMLElement= document.getElementById("canvas")!;
    const paddleEnemy:Element = document.createElementNS(svg.namespaceURI,'rect')
    Object.entries({
      x: 0, y: svg.clientHeight/2-50,
      width: 20, height: 120,
      fill: 'pink', 
    }).forEach(([key,val])=>paddleEnemy.setAttribute(key,String(val)))
    svg.appendChild(paddleEnemy);
    const paddlePlayer:Element = document.createElementNS(svg.namespaceURI,'rect')
    Object.entries({
      x: svg.clientWidth-20, y: svg.clientHeight/2-50,
      width: 20, height: 120, id:'player',
      fill: 'pink',
    }).forEach(([key,val])=>paddlePlayer.setAttribute(key,String(val)))
    svg.appendChild(paddlePlayer);

    const ball:Element = document.createElementNS(svg.namespaceURI,'ellipse')
    Object.entries({
      cx: 300, cy:300
      ,rx:10,ry:10,
      fill: 'lightblue',
    }).forEach(([key,val])=>ball.setAttribute(key,String(val)))
    svg.appendChild(ball);
    const animate = interval(5)
    .pipe(

      map(() => String(1.5 + Number(ball.getAttribute('cx')))),

    )
    .subscribe(val => ball.setAttribute('cx', val));
    //map(()=> String(Math.random()+Number(ball.getAttribute('cy')))
    let y_velocity:Number=1;

    const animate_y = interval(5)
    .pipe(
      map(()=> String(Number(y_velocity)*Math.random()+Number(ball.getAttribute('cy'))))

    )
    .subscribe(val => {y_velocity>0?Number(y_velocity)*-1:-y_velocity;ball.setAttribute('cy', String(Number(val)*Number(y_velocity)));console.log(y_velocity) });


    var text_enemy:Element = document.createElementNS(svg.namespaceURI,"text");
    text_enemy.setAttributeNS(null,"x","450");      
    text_enemy.setAttributeNS(null,"y","40"); 
    text_enemy.setAttributeNS(null,"fill","white")  
    text_enemy.setAttributeNS(null,'font-size','30px')
    text_enemy.textContent="Enemy: "+scoreEnemy.toString();
    svg.appendChild(text_enemy)

    const updatescore= interval(5)
    .pipe(
      filter(_=> Number(ball.getAttribute("cx"))>600 && scoreEnemy<7 && scorePlayer<7)

    )
    .subscribe(()=>{scoreEnemy+=1; ball.setAttribute('cx','300');    text_enemy.textContent="Enemy: "+scoreEnemy.toString()

  })
  const collisions=interval(5).pipe(
    filter(_=>isCollide(ball,paddlePlayer))
  )
  .subscribe(()=>{console.log("yes")})
  var lose_msg = document.createElementNS(svg.namespaceURI,"text");
  lose_msg.setAttributeNS(null,"x","150");      
  lose_msg.setAttributeNS(null,"y","300"); 
  lose_msg.setAttributeNS(null,"fill","red")  
  lose_msg.setAttributeNS(null,'font-size','30px')
;
  svg.appendChild(lose_msg);
  const gameover=interval(5)
  .pipe(
    filter(_=> scoreEnemy===7)
  )
  .subscribe(  ()=>{lose_msg.textContent="pepehands u lost :(";animate.unsubscribe(); svg.removeChild(ball);})

    /*const animate = setInterval(() => ball.setAttribute('cx', String(1 + Number(ball.getAttribute('cx')))), 10);
const timer = setInterval(() => {
  clearInterval(animate);
  clearInterval(timer);
}, 5000);*/

const keydown$ = fromEvent<KeyboardEvent>(document, 'keydown');
const arrowKeys$ = keydown$.pipe(
  filter(({key})=>key === 'ArrowUp' || key === 'ArrowDown'),
  filter(({repeat})=>!repeat));

          // let o =new Observable()

    // let o =new Observable()
    // let gameanimation =o.subscribe(()=>{ball.setAttribute('cx',xvelocity*Math.random()+ball.getAttributeNS(svg.namespaceURI,'cx'))})
  
    var newText = document.createElementNS(svg.namespaceURI,"text");
    newText.setAttributeNS(null,"x","20");      
    newText.setAttributeNS(null,"y","40"); 
    newText.setAttributeNS(null,"fill","white")  
    newText.setAttributeNS(null,'font-size','30px')
    var textNode = document.createTextNode("Player: "+ scorePlayer.toString());
    newText.appendChild(textNode);
    svg.appendChild(newText)

   
    // var enemy = document.createTextNode("Enemy: "+ scoreEnemy.toString());
    // text_enemy.appendChild(enemy);
    // svg.appendChild(text_enemy)
    function moveBall(ball){

    }

    function mousePosObservable() {
      const
        pos = document.getElementById("player")!,
        o = fromEvent<MouseEvent>(document, "mousemove").
          pipe(map(({  clientY }) => ({  y: clientY })))
    
      o.pipe(map(({  y }) => `${y}`))
        .subscribe((s : string) => pos.innerHTML = s);
      //move up down the paddle
      //o.subscribe(({y})=> pos.setAttribute('y',y.toString()));
      o.pipe(filter(({ y }) => y<=480 && y>=0) )
      .subscribe(({y})=> pos.setAttribute('y',y.toString()));


      o.pipe(filter(({ y }) => y > 600 ||y<0))
        .subscribe(_ => pos.classList.add('highlight'));
    
      o.pipe(filter(({ y }) => y <= 600 || y>=0))
        .subscribe(_ => {pos.classList.remove('highlight');});
    }
    mousePosObservable();

    function isCollide(a:Element, b:Element) {
      return (
       (Number(a.getAttribute('cx')))+Number(a.getAttribute('rx'))>Number(b.getAttribute('x'))
      )}
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
    window.onload = ()=>{
      pong();
    }
  
  

