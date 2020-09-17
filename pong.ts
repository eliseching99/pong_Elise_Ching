import { interval, fromEvent, from, zip, observable } from 'rxjs'
import { map, scan, filter, merge, flatMap, take, concat} from 'rxjs/operators'
import { Observable, Subject, ReplaySubject, of, range } from 'rxjs';
function pong() {
  let scoreEnemy:number =0;
  let scorePlayer:number= 0;
    //xvelocity is for the speed going left and right
let xvelocity: number = 1.5;

const audio_jump:HTMLAudioElement= new Audio('./jump.wav');
const audio_gameover:HTMLAudioElement= new Audio('./gameover.wav')
const audio_win:HTMLAudioElement= new Audio('./win.wav')

  
    const svg:HTMLElement= document.getElementById("canvas")!;
    const middleLine:Element = document.createElementNS(svg.namespaceURI,'rect')
    Object.entries({
      x: svg.clientWidth/2 ,y: 0,
      width: 5, height:svg.clientHeight,
      fill: 'white', 
    }).forEach(([key,val])=>middleLine.setAttribute(key,String(val)))
    svg.appendChild(middleLine);

    const speed_up:Element = document.createElement('img')
    Object.entries({
      x: Math.floor(Math.random() * svg.clientWidth) ,y:  Math.floor(Math.random() * svg.clientHeight),
      width: 5, height:5,
      fill: 'white', 
      src:'./lightning.png'
    }).forEach(([key,val])=>speed_up.setAttribute(key,String(val)))
    svg.appendChild(speed_up);
    function GFG_Fun() { 
      var img = document.createElement('img'); 
      img.src =  
'lightning.png'; 
img.width=10;
img.height=10;

      svg.appendChild(img); 
  }  
  GFG_Fun()
  

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

      map(() => String(xvelocity + Number(ball.getAttribute('cx')))),


    )
    .subscribe(val => ball.setAttribute('cx', val));
    //map(()=> String(Math.random()+Number(ball.getAttribute('cy')))
    let y_velocity:Number=1;

    const animate_Enemy = interval(5)
    .pipe(
      map(()=> String(Number(y_velocity)*Math.random()+Number(ball.getAttribute('cy'))))

    )
    .subscribe(val => {ball.setAttribute('cy', val);paddleEnemy.setAttribute('y',ball.getAttribute('cy'))});


    var text_enemy:Element = document.createElementNS(svg.namespaceURI,"text");
    text_enemy.setAttributeNS(null,"x","450");      
    text_enemy.setAttributeNS(null,"y","40"); 
    text_enemy.setAttributeNS(null,"fill","white")  
    text_enemy.setAttributeNS(null,'font-size','30px')
    text_enemy.textContent="Enemy: "+scoreEnemy.toString();
    svg.appendChild(text_enemy)

    const updatescorePlayer= interval(5)
    .pipe(
      filter(_=> Number(ball.getAttribute("cx"))>600 && scoreEnemy<7 && scorePlayer<7)

    )
    .subscribe(()=>{scoreEnemy+=1; ball.setAttribute('cx','300');  xvelocity=1;y_velocity=1;  text_enemy.textContent="Enemy: "+scoreEnemy.toString()

  })
  const updatescoreEnemy= interval(5)
  .pipe(
    filter(_=> Number(ball.getAttribute("cx"))<0 && scoreEnemy<7 && scorePlayer<7)

  )
  .subscribe(()=>{scorePlayer+=1; ball.setAttribute('cx','300');  xvelocity=1;y_velocity=1;  newText.textContent="Player: "+scorePlayer.toString()

})

  
  const collisions=interval(5).pipe(
    filter(  _=>isCollide(paddlePlayer,ball)),

  )
  .subscribe(()=>{audio_jump.play();xvelocity=(1.2*-xvelocity) ;y_velocity=-y_velocity; })

  const collisions_wall=interval(5).pipe(
    filter(  _=>hitWall(ball,svg)),

  )
  .subscribe(()=>{ y_velocity=-y_velocity; })

  const collisions_enemy=interval(5).pipe(
    filter(  _=>isCollide(paddleEnemy,ball))

  )
  .subscribe(()=>{xvelocity=-xvelocity ; })
  var lose_msg = document.createElementNS(svg.namespaceURI,"text");
  lose_msg.setAttributeNS(null,"x","150");      
  lose_msg.setAttributeNS(null,"y","300"); 
  lose_msg.setAttributeNS(null,"fill","red")  
  lose_msg.setAttributeNS(null,'font-size','30px')
;

var win_msg = document.createElementNS(svg.namespaceURI,"text");
win_msg.setAttributeNS(null,"x","150");      
win_msg.setAttributeNS(null,"y","300"); 
win_msg.setAttributeNS(null,"fill","red")  
win_msg.setAttributeNS(null,'font-size','30px')
  svg.appendChild(lose_msg);
  const gameover=interval(5)
  .pipe(
    filter(_=> scoreEnemy===7||scorePlayer===7)
  )
  .subscribe(  ()=>{audio_gameover.play();lose_msg.textContent="pepehands u lost :(";animate.unsubscribe(); svg.removeChild(ball);animate_Enemy.unsubscribe();svg.removeChild(middleLine)})

  const win=interval(5)
  .pipe(
    filter(_=> scorePlayer===7)
  )
  .subscribe(  ()=>{audio_win.play();win_msg.textContent="Godddamn son u won";animate.unsubscribe(); svg.removeChild(ball);animate_Enemy.unsubscribe() ;svg.removeChild(middleLine)})

    /*const animate = setInterval(() => ball.setAttribute('cx', String(1 + Number(ball.getAttribute('cx')))), 10);
const timer = setInterval(() => {
  clearInterval(animate);
  clearInterval(timer);
}, 5000);*/

const keydown$ = fromEvent<KeyboardEvent>(document, 'keydown');
const arrowKeys$ = keydown$.pipe(
  filter(({key})=>key === 'ArrowUp' || key === 'ArrowDown'),
  filter(({repeat})=>!repeat));

  const clickObservable:Observable<Event> = fromEvent(document,'click')
  const example=clickObservable.pipe(map(event=>'Event time: ${event.timeStamp}'));
  const subscribe= example.subscribe(val=>console.log(val));

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

    function isCollide(a:Element, b:Element):boolean {
      return !(
       (Number(a.getAttribute("y"))+Number(a.getAttribute('height')))<Number(b.getAttribute('cy'))||
       (Number(a.getAttribute("y"))>Number(b.getAttribute("cy"))+Number(b.getAttribute("ry"))||
       (Number(a.getAttribute("x")))+Number(a.getAttribute("width"))<Number(b.getAttribute('cx'))||
       (Number(a.getAttribute("x")))>Number(b.getAttribute("cx"))+Number(b.getAttribute("rx")))

      //  (Number(a.getAttribute('cy')))+Number(a.getAttribute('ry'))<paddle.top
      //  (Number(a.getAttribute('cx')))>paddle.right||
      //  (Number(a.getAttribute('cy')))>paddle.bottom

      )}

    function hitWall(a:Element,b:HTMLElement){
    
      return ((Number(a.getAttribute('cy')))<0 && Number(a.getAttribute('cx'))>0) ||
      ((Number(a.getAttribute('cy')))>Number(b.getAttribute('height')) && Number(a.getAttribute('cx'))>0)
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
    window.onload = ()=>{

      pong();
    }
  
  

