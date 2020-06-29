BIRD_HEIGHT = 60


l = null
gameManager = null
p = null
b_image = null
bird_image = null
backManager = null
play_image = null
function preload(){
    b_image = loadImage("assets/background.png")
    bird_image = loadImage("assets/bird.png")
    play_image = loadImage("assets/play.png")
}


function setup(){
    
    createCanvas(500,500)
    l = new PipeAbove()
    p = new PipeBelow()
    bird_image.resize(60,60)
    gameManager = new GameManager(bird_image)
    backManager = new BackgroundManager(b_image)

}

function draw(){
    image(b_image,0,0)
    backManager.draw()
    gameManager.run()
    textSize(24)
    fill(0)
    text("Score : "+gameManager.bird.score,400,50)
    text("High Score : "+gameManager.highscore,10,50)
    
}

function keyPressed(){
    if(keyCode==32){
        gameManager.bird.jump()
    }
}


class Pipe{
    x;
    h;
    draw(){
        fill(10,200,20)
        rect(this.x,0,100,this.h)
    }

    
}


class Bird{
    constructor(img){
        this.bImage       = img
        this.y            = 150
        this.velocity = 0
        this.acceleration = 2
        this.score  = 0

    }
    draw(){
        this.applyGravity()
        image(this.bImage,150,this.y)
        
    }

    jump(){
        this.acceleration = -10
    }

    applyGravity(){
        let MAX_SPEED = 8
        let MAX_NEGATIVE_SPEED = -14

        if(this.velocity<MAX_SPEED && this.acceleration>0){
            this.velocity+=this.acceleration
        }

        if(this.velocity>MAX_NEGATIVE_SPEED && this.acceleration<0){
            this.velocity+=this.acceleration
        }
        
        if(this.velocity<=MAX_NEGATIVE_SPEED){
            this.acceleration = 2
        }

        if(this.y<height-60)
            this.y+=this.velocity

    }

}


class GameManager{
    pipes = []
    gameStarted = false
    highscore = 0
   
    constructor(bImage){
        this.pipes.push(new PipePair())
        this.bird = new Bird(bImage) 
    }

    run(){
        if(this.gameStarted){
            if(this.pipes.length!=0){
                let frontpipe = this.pipes[0]
                

                if(frontpipe.pipeAbove.collision(this.bird) || frontpipe.pipeBelow.collision(this.bird)){
                    this.gameOver()
                }

                this.pipes.forEach(pipe=>{
                    pipe.decX(1)
                    pipe.draw()
                })
    
                if(frontpipe.getX()==150-100){
                    this.bird.score+=1
                    if(this.highscore<this.bird.score){
                        this.highscore = this.bird.score
                    }
                }
               
                if(frontpipe.getX()==200){
                    this.pipes.push(new PipePair())
                }
                
                if(frontpipe.getX()<-100){
                    this.pipes.shift()
                    
                }
                
                
                
            }
            this.bird.draw()
        }else{
            this.displayPlay()
        }
        
        
        
    }

    displayPlay(){
        if(mouseIsPressed){
            if(mouseX>(width/2)-(play_image.width/2)){
                if(mouseX<(width/2)+(play_image.width/2)){
                    if(mouseY>(height/2)-(play_image.height/2)){
                        if(mouseY<(height/2)+(play_image.height/2)){
                            this.gameStarted = true
                        }
                    }
                }
            }
        }
        image(play_image,(width/2)-(play_image.width/2),height/2-(play_image.height/2))
    }
    
    
    gameOver(){
        this.bird.y = 150
        this.score = 0
        this.pipes = []
        this.pipes.push(new PipePair())
        this.gameStarted = false
    }    

}


class PipePair{
    
    constructor(){
        this.pipeAbove = new PipeAbove()
        this.pipeBelow = new PipeBelow()
        console.log("created")
    }
    
    draw(){
        this.pipeAbove.draw()
        this.pipeBelow.draw()
    }

    decX(num){
        this.pipeBelow.x -= num
        this.pipeAbove.x -= num
    }

    getX(){
        return this.pipeAbove.x;
    }

    

}

class PipeAbove extends Pipe{
    constructor(){
        super()
        this.h = random()*(height/2 - BIRD_HEIGHT)
        this.x = width+100
    }

    collision(bird){
        let BIRDX = 150
        let BIRDY = bird.y
        let BIRDS = 60
        let PIPEX = this.x
        let PIPEY = 0
        let PIPEW = 100
        let PIPEH = this.h

        if( BIRDY>=PIPEY-BIRDS && BIRDY<=PIPEY+PIPEH && BIRDX>=PIPEX-BIRDS && BIRDX<=PIPEX+PIPEW){
            return true
        }else{
            return false
        }

    }
}

class PipeBelow extends Pipe{
    constructor(){
        super()
        this.h = random()*(height/2 - BIRD_HEIGHT)
        this.x = width+100
    }

    draw(){
        fill(10,200,20)
        rect(this.x,height-this.h,100,this.h)
    }

    collision(bird){
        let BIRDX = 150
        let BIRDY = bird.y
        let BIRDS = 60
        let PIPEX = this.x
        let PIPEY = height-this.h
        let PIPEW = 100
        let PIPEH = this.h

        if( BIRDY>=PIPEY-BIRDS && BIRDY<=PIPEY+PIPEH && BIRDX>=PIPEX-BIRDS && BIRDX<=PIPEX+PIPEW){
            return true
        }else{
            return false
        }

    }
    
    
}

class Background{
    constructor(b_image,x){
        this.image = b_image
        this.x = x
    }
    draw(){
        image(this.image,this.x,0)
        image(this.image,this.x+this.image.width,0)
    }
}

class BackgroundManager{
    constructor(b_image){
        this.image = b_image
        this.backList = []
        this.backList.push(new Background(b_image,0))
        this.backList.push(new Background(b_image,width))
        this.speed = 0.5
    }
    draw(){
        this.backList.forEach(bg=>{
            bg.x -= this.speed
            bg.draw()
        })
        if(this.backList.length!=0){
            if(this.backList[0].x+2*this.image.width<0){
                this.backList.shift()
                this.backList.push(new Background(this.image,width))
            }
        }
    }
}




