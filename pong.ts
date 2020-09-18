import { interval, fromEvent, from, zip, observable, Subscription } from 'rxjs'
import { map, scan, filter, merge, flatMap, take, concat } from 'rxjs/operators'
import { Observable, Subject, ReplaySubject, of, range } from 'rxjs';
import { ComplexOuterSubscriber } from 'rxjs/internal/innerSubscribe';
function pong() {

  /*
  Type called Pos contains attributes x, y that will be used to generate the random position later
  */
  type Pos = Readonly<{
    x: number,
    y: number

  }>
  // type State = Readonly<{
  //   score_Enemy:number,
  //   score_Player:number,
  //   game_Over:boolean
  //   x_velocity:number,
  //   yvelocity:number
  // }>

  // const scoreenemy=x=>x+1
  // const enem=scoreenemy
  // const test= (x)=>(y)=>(x+y)
  
  let scoreEnemy: number = 0;
  let scorePlayer: number = 0;
  //xvelocity is for the speed going left and right
  let xvelocity: number = 1.5;
  let yvelocity: Number = 1;


  /*
  Sound effects for game
  */
  const audio_jump: HTMLAudioElement = new Audio('./jump.wav');
  const audio_gameover: HTMLAudioElement = new Audio('./gameover.wav')
  const audio_win: HTMLAudioElement = new Audio('./win.wav')
  const audio_powerup: HTMLAudioElement = new Audio('./powerup.wav')
  
  /*
  Declaring Pong Components including the paddles,ball, Score, Powerup
  For the rectangles and ellipse components I used the for each function
  in order to set the attributes for the components.
  I use svg.append in order to draw the components on the canvas
  */
  const speed_up: Element = document.getElementById('svg_8')
  const size_up: Element = document.getElementById('svg_1')
  const svg: HTMLElement = document.getElementById("canvas")!;
  const middleLine: Element = document.createElementNS(svg.namespaceURI, 'rect')
  Object.entries({
    x: svg.clientWidth / 2, y: 0,
    width: 5, height: svg.clientHeight,
    fill: 'white',
  }).forEach(([key, val]) => middleLine.setAttribute(key, String(val)))
  svg.appendChild(middleLine);

  const paddleEnemy: Element = document.createElementNS(svg.namespaceURI, 'rect')
  Object.entries({
    x: 0, y: svg.clientHeight / 2 - 50,
    width: 20, height: 120,
    fill: 'pink',
  }).forEach(([key, val]) => paddleEnemy.setAttribute(key, String(val)))
  svg.appendChild(paddleEnemy);
  const paddlePlayer: Element = document.createElementNS(svg.namespaceURI, 'rect')
  Object.entries({
    x: svg.clientWidth - 20, y: svg.clientHeight / 2 - 50,
    width: 20, height: 120, id: 'player',
    fill: 'pink',
  }).forEach(([key, val]) => paddlePlayer.setAttribute(key, String(val)))
  svg.appendChild(paddlePlayer);

  const ball: Element = document.createElementNS(svg.namespaceURI, 'ellipse')
  Object.entries({
    cx: 300, cy: 300
    , rx: 10, ry: 10,
    fill: 'lightblue',
  }).forEach(([key, val]) => ball.setAttribute(key, String(val)))
  svg.appendChild(ball);

  const text_enemy: Element = document.createElementNS(svg.namespaceURI, "text");
  text_enemy.setAttributeNS(null, "x", "20");
  text_enemy.setAttributeNS(null, "y", "40");
  text_enemy.setAttributeNS(null, "fill", "white")
  text_enemy.setAttributeNS(null, 'font-size', '30px')
  text_enemy.textContent = "Enemy: " + scoreEnemy.toString();
  svg.appendChild(text_enemy)

  const newText:Element  = document.createElementNS(svg.namespaceURI, "text");
  newText.setAttributeNS(null, "x", "450");
  newText.setAttributeNS(null, "y", "40");
  newText.setAttributeNS(null, "fill", "white")
  newText.setAttributeNS(null, 'font-size', '30px')
  var textNode = document.createTextNode("Player: " + scorePlayer.toString());
  newText.appendChild(textNode);

  svg.appendChild(newText)
  const lose_msg :Element = document.createElementNS(svg.namespaceURI, "text");
  lose_msg.setAttributeNS(null, "x", "150");
  lose_msg.setAttributeNS(null, "y", "300");
  lose_msg.setAttributeNS(null, "fill", "red")
  lose_msg.setAttributeNS(null, 'font-size', '30px')
    ;

 const win_msg :Element = document.createElementNS(svg.namespaceURI, "text");
  win_msg.setAttributeNS(null, "x", "150");
  win_msg.setAttributeNS(null, "y", "300");
  win_msg.setAttributeNS(null, "fill", "red")
  win_msg.setAttributeNS(null, 'font-size', '30px')
  svg.appendChild(win_msg)
  svg.appendChild(lose_msg);




  /*
  The function returns a Type Pos that contains a random x and y position
  */
  function generate_pos():Pos {
    //console.log(speed_up)
    return <Pos>{
      x: Math.floor(1 * Math.random() * (svg.clientWidth)),
      y: Math.floor(1 * Math.random() * (svg.clientHeight))
    }
  }


  //generates random position for the power up using the generate pos function
  //which returns a type of vector containg the random x and y potions
  //takes in the the powerup element as another paramter so that it can dynamically mutate the state when called in observable stream
  function random_pos(p: Pos, b: Element) {
    //console.log(p.x, p.y)
    var str = 'rotate(-180 {p.x}, {p.y})';
    var str2 = str.replace('{p.x}', p.x.toString());
    var final = str2.replace('{p.y}', p.y.toString())
    b.setAttribute('transform', final)

  }

  /*
  Animate is the main observable for animating the ball by mapping the new position of the ball by keep on adding the xvelocity to it
  The balls position only gets changed in the subscribe where the position is set using the new values that were created in the map function
  */
  const animate:Subscription = interval(5)
    .pipe(

      map(() => String(xvelocity + Number(ball.getAttribute('cx')))),


    )
    .subscribe(val => ball.setAttribute('cx', val));
  
  //enemy paddle will follow the ball's y position but at a slower pace * 0.5 therefore the player has more chance of winning
  const enemy_paddle_speed:number=0.5;
  const animate_Enemy:Subscription = interval(5)
    .pipe(
      map(() => String(Number(yvelocity) * Math.random() + Number(ball.getAttribute('cy'))))

    )
    .subscribe(val => { ball.setAttribute('cy', val); paddleEnemy.setAttribute('y', (Number(ball.getAttribute('cy'))*(enemy_paddle_speed)).toString()) });

  /*
  Checking to see if the ball has reached either side of the canvas and update the score of the Enemy and Player respectively
  Use filter in order to check the conditions 
  */

  const updatescorePlayer:Subscription = interval(5)
    .pipe(
      filter(_ => Number(ball.getAttribute("cx")) > 600 && scoreEnemy < 7 && scorePlayer < 7)

    )
    .subscribe(() => {
      scoreEnemy += 1; ball.setAttribute('cx', '300'); xvelocity = 1; yvelocity = 1; text_enemy.textContent = "Enemy: " + scoreEnemy.toString()

    })
  const updatescoreEnemy:Subscription = interval(5)
    .pipe(
      filter(_ => Number(ball.getAttribute("cx")) < 0 && scoreEnemy < 7 && scorePlayer < 7)

    )
    .subscribe(() => {
      scorePlayer += 1; ball.setAttribute('cx', '300'); xvelocity = 1; yvelocity = 1; newText.textContent = "Player: " + scorePlayer.toString()

    })
  

  /*
  This chunk of code is to filter for collisions between paddle and ball, ball and wall, and ball and power up
  For the normal collisions between paddle and ball, i generate a new position for the power up in order to make it harder for user to
  achieve it.
  Each time a collision occurs the velocity will increase making the ball bounce faster
  I also update the y velocity so that it will bounce at an appropriate angle
  */

  /*
  I check if the filter for my function is Collide which takes the attributes of the ball and paddle and compares them to each other to check if any 
  attribute of them has collided
  */
  const collisions:Subscription = interval(5).pipe(
    filter(_ => isCollide(paddlePlayer, ball)),

  )
    .subscribe(() => {
      random_pos(generate_pos(), speed_up);
      audio_jump.play();
      xvelocity = (1.2 * -xvelocity);
      yvelocity = -yvelocity;
    })
  /*
  I check if my function hit wall which compares if the ball has reached either the top or bottom of wall and causes
  the y velocity to change
  */
    
 function hitWall(a: Element, b: HTMLElement):boolean {

  return ((Number(a.getAttribute('cy'))) < 0 && Number(a.getAttribute('cx')) > 0) ||
    ((Number(a.getAttribute('cy'))) > Number(b.getAttribute('height')) && Number(a.getAttribute('cx')) > 0)
}

  const collisions_wall :Subscription= interval(5).pipe(
    filter(_ => hitWall(ball, svg)),

  )
    .subscribe(() => { yvelocity = -yvelocity; })

  const collisions_enemy:Subscription = interval(5).pipe(
    filter(_ => isCollide(paddleEnemy, ball))

  )
    .subscribe(() => { xvelocity = -xvelocity; })
  /*
  I created a new function isCollidePowerUp which is slightly different to the other isCollide functions as
  the power ups are made of SVG Path Elements therefore I need to Compare them to the bounding box values of them instead of the normal x,y positions
  if the ball collides with speed power up the velocity increases by 1.5 times, which seems like 2* speed when the user actually achieves this power up
  */
  const collisions_speed:Subscription=interval(5).pipe(
    filter(_=>isCollidePowerUp(speed_up,ball))

  )
  .subscribe(()=>{audio_powerup.play();xvelocity=1.5*xvelocity;})

  //can only use the sizeup power up once, it will then be removed from the canvas after colliding with the ball
  //sets the paddleplayer height be *1.1 of its original size
  const collisions_sizeup:Subscription=interval(5).pipe(
    filter(_=>isCollidePowerUp(size_up,ball))

  )
  .subscribe(()=>{audio_powerup.play();paddlePlayer.setAttribute('height',(Number(paddlePlayer.getAttribute('height'))*1.1).toString()); svg.removeChild(size_up)})

  
  /*
  filters for the Score of either player to have reached 7 
  if yes the previous observables are all unsubscribed
  */

  const gameover:Subscription = interval(5)
    .pipe(
      filter(_ => scoreEnemy === 7 )
    )
    .subscribe(() => { audio_gameover.play(); lose_msg.textContent = "Game Over :("; animate.unsubscribe(); svg.removeChild(ball); animate_Enemy.unsubscribe(); svg.removeChild(middleLine) })

  const win:Subscription = interval(5)
    .pipe(
      filter(_ => scorePlayer === 7)
    )
    .subscribe(() => { audio_win.play(); win_msg.textContent = "Congrats! You Won!"; animate.unsubscribe(); svg.removeChild(ball); animate_Enemy.unsubscribe(); svg.removeChild(middleLine) })
  
  //for randomising the position of the better power up which is making the paddle of the player bigger
  //I have chosen to filter the score of the enemy to 4 so that the player will be more pressured to win
  //There will also be a condition where the power up for size only appears when the ball is hit on a wall
  //Once it hits the wall and the score of enemy is equal to 4
  //The power up for size will be randomly generated on the canvas

  /*
  generating a position for size up power up when enemy is near to winning
  */
  const Enemy_winning:Subscription= interval(5)
  .pipe(
    filter(_=>scoreEnemy===4),
    filter(_ => hitWall(ball, svg))
    )
    .subscribe(()=>{random_pos(generate_pos(),size_up)})


  // const keydown = fromEvent<KeyboardEvent>(document, 'keydown');
  // const arrowKeys = keydown.pipe(
  //   filter(({ key }) => key === 'r')).subscribe(console.log('3'))
//   function keyr(e) {
//     if(e.keyCode === 82){
//        console.log('r');
//     };
// }
//   document.onkeydown = keyr;
  

  // const clickObservable: Observable<Event> = fromEvent(document, 'click')
  // const example = clickObservable.pipe(map(event => 'Event time: ${event.timeStamp}'));
  // const subscribe = example.subscribe(val => console.log(val));

  //this code is taken from Observableexamples.ts from week 4 Exercise File
  function mousePosObservable() {
    const
      pos = document.getElementById("player")!,
      o = fromEvent<MouseEvent>(document, "mousemove").
        pipe(map(({ clientY }) => ({ y: clientY })))

    o.pipe(map(({ y }) => `${y}`))
      .subscribe((s: string) => pos.innerHTML = s);
    //move up down the paddle
    //o.subscribe(({y})=> pos.setAttribute('y',y.toString()));
    o.pipe(filter(({ y }) => y <= 480 && y >= 0))
      .subscribe(({ y }) => pos.setAttribute('y', y.toString()));


    o.pipe(filter(({ y }) => y > 600 || y < 0))
      .subscribe(_ => pos.classList.add('highlight'));

    o.pipe(filter(({ y }) => y <= 600 || y >= 0))
      .subscribe(_ => { pos.classList.remove('highlight'); });
  }
  mousePosObservable();


  //Collide functions that takes in the y and x positions of the two elements and compares whether they have collided or not returns a boolean attribute
  function isCollide(a: Element, b: Element): boolean {
    return !(
      (Number(a.getAttribute("y")) + Number(a.getAttribute('height'))) < Number(b.getAttribute('cy')) ||
      (Number(a.getAttribute("y")) > Number(b.getAttribute("cy")) + Number(b.getAttribute("ry")) ||
        (Number(a.getAttribute("x"))) + Number(a.getAttribute("width")) < Number(b.getAttribute('cx')) ||
        (Number(a.getAttribute("x"))) > Number(b.getAttribute("cx")) + Number(b.getAttribute("rx")))

    )
  }
  //collision with svg path is a bit different and will need to be based on the bounding box of said svg element
  function isCollidePowerUp(a: Element, b: Element){
    const boundingbox=a.getBoundingClientRect()
    return !(Number(boundingbox.x+Number(boundingbox.width)<Number(b.getAttribute('cx'))||
    Number(boundingbox.x)>Number(b.getAttribute('cx'))+Number(b.getAttribute('rx'))||
    Number(boundingbox.y)+Number(boundingbox.height)<Number(b.getAttribute('cy'))||
    Number(boundingbox.y)> Number(b.getAttribute('cy'))+Number(b.getAttribute('ry')))

    )
  }

  


}

// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = () => {

    pong();

  }



