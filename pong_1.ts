// FIT2102 2018 Assignment 1
// https://docs.google.com/document/d/1woMAgJVf1oL3M49Q8N3E1ykTuTu5_r28_MQPVS5QIVo/edit?usp=sharing

function pong() {
  // Inside this function you will use the classes and functions 
  // defined in svgelement.ts and observable.ts
  // to add visuals to the svg element in pong.html, animate them, and make them interactive.
  // Study and complete the tasks in basicexamples.ts first to get ideas.

  // You will be marked on your functional programming style
  // as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to 
  // create reusable, generic functions.
  
  //xvelocity is for the speed going left and right
  let xvelocity: number = 1;
  //yvelocity is for the speed going up and down
  let yvelocity: number = 0.9; 

  



  const svg:HTMLElement= document.getElementById("canvas")!;

  //creates ball
  let ball:Elem= new Elem (svg,"ellipse")
  .attr("cx",300)
  .attr("cy",300)
  .attr("rx",10)
  .attr("ry",10)
  .attr("fill","white")

 
  
  //map is to pass in variable x, y
  //filter - if conditions
  //subscribe

  //creates text for the score of the Player
  let scoreplayer:Elem= new Elem(svg,"text")
  .attr("x",450)
  .attr("y",50)
  .attr("fill","white")
  .attr("font-size","50px")
  
  //creates text for the score of the Enemy
  let scoreEnemy:Elem= new Elem(svg,"text")
  .attr("x",150)
  .attr("y",50)
  .attr("fill","white")
  .attr("font-size","50px")

  //text that shows when player wins
  let winPlayertext:Elem= new Elem(svg,"text")
  .attr("x",300)
  .attr("y",80)
  .attr("fill","green")
  .attr("font-size","30px")
  .attr("text-anchor","middle")

  //text that shows when enemy wins
  let winEnemytext:Elem = new Elem(svg,"text")
  .attr("x",300)
  .attr("y",80)
  .attr("fill","red")
  .attr("font-size","25px")
  .attr("text-anchor","middle")

    //creates the line in the middle of the canvas
    let dot1 = new Elem(svg, "rect")
    .attr("x",Number(300))
    .attr("width",5)
    .attr("height",600)
    .attr("fill","white")

  
  

  

  //initialise score to 0 for both Enemy and Player
  let counterEnemy:number =0;
  let counterPlayer:number= 0;


  //function for collisions
  //takes in two parameters of type Element, a and b

  function isCollide(a:Elem, b:Elem) {
    return !(
      (Number(a.attr("y")) + Number(a.attr("height"))) < Number(b.attr("cy")) ||
      Number(a.attr("y")) > (Number(b.attr("cy")) + Number(b.attr("ry"))) ||
      (Number(a.attr("x")) + Number(a.attr("width"))) < Number(b.attr("cx"))||
      Number(a.attr("x")) > (Number(b.attr("cx")) + Number(b.attr("rx")))
    )}



    /*
    function isCollide(a:Elem, b:Elem) {
      return !(
          (a.attr("cx") + a.attr("rx")) < b.attr("x") ||
          (a.attr("cy") + (a.attr("ry") > b.attr("y"))) ||
          //(a.attr("cx") + a.attr("rx")) < b.attr("x") ||
          (a.attr("cy") > (b.attr("y") + b.attr("height")))
      )}*/

  


  
     

  let o =Observable.interval(5)
    //enemy wins 
    // if the ball reaches coordinate x more than 600 and neither player has won yet
    o.filter(_=> Number(ball.attr("cx"))>600 && counterEnemy<11 && counterPlayer<11)
    .subscribe(()=>{
      //increment score of Enemy
      counterEnemy+=1;
      //puts back the ball into the original position
      Number(ball.attr('cx',300))
      Number(ball.attr('cy',300))
     
      })
    
  //animates ball
    //o.filter(_=> counterEnemy<11 && counterPlayer<11)
    let gameanimation =o.subscribe(()=>{ball.attr('cx', xvelocity*Math.random()+Number(ball.attr('cx')));
    //updates the score of the enemy and shows it on the canvas
    scoreEnemy.elem.textContent=counterEnemy.toString()
  
    ball.attr("cy",0+Number(ball.attr("cy")))})


    //player wins
    //if ball reaches coordinate x<0 and neither player has won
    //increment counter player by 1 and reset the ball position
    o.filter(_=> Number(ball.attr("cx"))<0 && counterEnemy<11 && counterPlayer<11 )
    .subscribe(()=>{
      counterPlayer+=1;
      Number(ball.attr('cx',300))
      Number(ball.attr('cy',300))
      
    })

    let gameanimation1=o.subscribe(()=>{ball.attr('cx', xvelocity*Math.random()+Number(ball.attr('cx')))
    
    scoreplayer.elem.textContent=counterPlayer.toString()

    ball.attr("cy",0+Number(ball.attr("cy")))})
  
    //to bounce the ball when the ball reaches the top of the canvas
    o.filter(_=> Number(ball.attr("cy"))>600)
    .subscribe(()=>(yvelocity=-yvelocity))
    let gameanimation2=o.subscribe(()=>{ball.attr('cy', yvelocity+Number(ball.attr('cy')));
    ball.attr("cx",0+Number(ball.attr("cx")))})

    //to bounce the ball when the ball reaches the bottom of the canvas
    o.filter(_=> Number(ball.attr("cy"))<0)
    .subscribe(()=>(yvelocity=-yvelocity))
    let gameanimation3=o.subscribe(()=>{ball.attr('cy', yvelocity+Number(ball.attr('cy')));
    ball.attr("cx",0+Number(ball.attr("cx")))})


    //this checks whether the enemy or the player has won and stops the game animation
    o.filter(_=>counterEnemy===11 || counterPlayer===11).subscribe(()=>{gameanimation(); gameanimation1();gameanimation2();gameanimation3();  dot1.elem.remove()})
    
    //o.filter(_=> counterEnemy=11)

    //check if Enemy won
    //prints out enemy win statement
    o.filter(_=>counterEnemy===11)
    .subscribe(()=>winEnemytext.elem.textContent="Booohoo the Enemy has won :(")

    //check if player won prints out player wins statement
    o.filter(_=>counterPlayer===11)
    .subscribe(()=>winPlayertext.elem.textContent="Yay! You have won the game! :)")

  
  
      //or to hide the all svg
      //document.getElementById("mySvg").style.display = "none";
    
    
  
  
    
    

  
  // creates Paddle for the Enemy
  let paddleEnemy:Elem = new Elem(svg, "rect")
  .attr("x",Number(10))
  .attr("width",12)
  .attr("height",120)
  .attr("fill","#cdebf9")

  
  //checks if the paddle Enemy and the ball has collided if yes then bounce ball
  o.filter(_=>isCollide(paddleEnemy,ball))
  .subscribe(()=>(xvelocity=-xvelocity))

  //this allows the Enemy paddle to follow the ball but at a delay as well
  o.subscribe(()=>{paddleEnemy.attr('y', (yvelocity+Number(ball.attr('cy'))- Number(paddleEnemy.attr('height'))/2)/1.3);
  })

  
 

 



  
  //creates paddle for the player

  let paddleplayer = new Elem(svg, "rect")
  .attr("x",580)
  .attr("y",20)
  .attr("width",12)
  .attr("height",120)
  .attr("fill","#f9f1cd")

  //checks if the paddleplayer and the ball has collided if yes then reverse the x velocity for the ball to bounce back
  o.filter(_=>isCollide(paddleplayer,ball))
  .subscribe(()=>(xvelocity=-xvelocity))
  
  //creates observable for mousemove
  const mousemove:Observable<MouseEvent> = Observable.fromEvent<MouseEvent>(svg,"mousemove")

  paddleplayer.observe<MouseEvent>("mousemove")
  
  //allows player to move paddle by hovering over the paddle
  .map(({ clientY}) => ({ yOffset: Number(paddleplayer.attr('y')) - clientY }))
  .flatMap(({yOffset}) =>
    mousemove
      .map(({ clientY}) => ({y: clientY + yOffset })))
  .subscribe(({y}) =>
    paddleplayer
        .attr('y', y));

}



// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = ()=>{
    pong();
  }

 

 