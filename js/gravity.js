window.onload=function(){
  var box1=document.getElementById('box1');//获取节点
  var boxheight=0 //松手时的高度
  var speedcalculation//鼠标移动速度计算
  var mouseX//储存x轴坐标
  var mouseY//储存y轴坐标
  let diameter=parseInt(box1.style.width.slice(0,-2))//小球直径
  let X_speed=60//水平初速度
  // let Y_speed=0//y初速度
  let Falltime=0 //下落时间
  let Fallingheight=document.documentElement.clientHeight//默认下落高度
  let Freefallcalculation//计算
  let airwall=0//空气墙
  let Frictionfactor=0.6//摩擦因数
  const g=9.80665 //重力加速度
  
  box1.onmousedown=function(event){
    var of=event.clientX - box1.offsetLeft;
    var ot=event.clientY - box1.offsetTop;
    // motionstate.height=0
    // motionstate.Y_speed=0
    clearInterval(Freefallcalculation)
    document.onmousemove=function(event){//鼠标移动
      if(event.clientX-of<document.documentElement.clientWidth-diameter&&event.clientX-of>0&&event.clientY-ot>0){
        box1.style.transition='none'
        var left=event.clientX;
        var top=event.clientY;
        box1.style.left=(left-of) + 'px';
        box1.style.top=(top-ot) + 'px';
      }
      if(event.clientX-of>=document.documentElement.clientWidth-diameter){
        box1.style.transition='none'
        var left=event.clientX;
        var top=event.clientY;
        box1.style.left=document.documentElement.clientWidth-diameter + 'px';
        box1.style.top=(top-ot) + 'px';
      }
      if(event.clientX-of<=0){
        box1.style.transition='none'
        var left=event.clientX;
        var top=event.clientY;
        box1.style.left='0px';
        box1.style.top=(top-ot) + 'px';
      }
      if(event.clientY-ot<=0){
        box1.style.transition='none'
        var left=event.clientX;
        var top=event.clientY;
        box1.style.left=(left-of) + 'px';
        box1.style.top='0px';
      }
      // let mousefX=event.clientX
      // let mousefY=event.clientY
      if(speedcalculation) return
      speedcalculation=setTimeout(() => {
        mouseX=event.clientX
        mouseY=event.clientY
        // console.log(event.clientX,event.clientY,'移动');
        speedcalculation=null
      }, 100);
    };
  };
  box1.onmouseup=function(event){//松手
    // console.log(event.clientX,event.clientY,'松手');
    console.log(event.clientX-mouseX,'理论速度');
    if(event.clientX-mouseX>0){
      motionstate.X_direction='right'
    }else{
      motionstate.X_direction='left'
    }
    // if(event.clientY-mouseX>0){
    //   motionstate.Y_direction='interveneup'
    // }else{
    //   motionstate.Y_direction='down'
    // }
    if(event.clientX>=document.documentElement.clientWidth-diameter){
      box1.style.left=document.documentElement.clientWidth-diameter + 'px'
    }
    computerheight()
    // console.log(motionstate);
    document.onmousemove=null;
    // if(motionstate.height>0){
    boxheight=event.clientY-(diameter/2)
    Fallheight=0
    Falltime=0
    if(Math.abs(event.clientX-mouseX)>=150){
      X_speed=150
    }else{
      X_speed=Math.abs(event.clientX-mouseX)      
    }
    // if(Math.abs(event.clientY-mouseY)>=150){
    //   Y_speed=150
    // }else{
    //   Y_speed=Math.abs(event.clientY-mouseY)
    // }
    airwall=X_speed*0.5
    console.log(X_speed,'限制速度',airwall,'空气墙距离');
    Fallingheight=motionstate.height
    Freefall()
    // }
  };
  var motionstate={//小球运动状态
    Y_speed:0,
    X_speed:0,
    height:0,
    Y_direction:'down',
    X_direction:'right',
  };
  let speed=0//储存高度为0时的速度
  function computerheight(){//计算当前高度
    motionstate.height=document.documentElement.clientHeight-(parseInt(box1.style.top.slice(0,-2))+diameter)
  }
  function computerY_speed(){//初速度为0时的落地速度
    motionstate.Y_speed=g*Falltime
  }
  function Freefall(){
    box1.style.transition='0.1s'
    box1.style.transitionTimingFunction='linear'
    Freefallcalculation=setInterval(() => {
      Falltime+=0.1
      if(motionstate.Y_direction==='down'){
        // console.log(motionstate);
        if(motionstate.height>0){
          Fallheight=boxheight+(g*Math.pow(Falltime,2))/2*100 //自由落体
          box1.style.top=Fallheight + 'px'
          computerheight()
          // console.log(motionstate.height);
        }
        if(motionstate.height<=0&&motionstate.Y_speed>=0.1){
          // box1.style.top=(window.innerHeight-20)+'px'
          computerheight()
          Falltime=0
          motionstate.Y_direction='up'
          motionstate.Y_speed=Math.sqrt(2*(Fallingheight/100)*g)*0.6;
          speed=motionstate.Y_speed
        }
        if(motionstate.height<=0&&motionstate.Y_speed<0.1){
          box1.style.top=(window.innerHeight-diameter)+'px'
          motionstate.height=0
          Falltime=0
          motionstate.Y_speed=0
          speed=0
          // if(X_speed<=Frictionfactor*g){
          //   motionstate.X_direction='null'
          //   clearInterval(Freefallcalculation)
          //   console.log('stop');
          // }
        }
        computerY_speed()
      }
      if(motionstate.Y_direction==='up'){
        Fallheight=document.documentElement.clientHeight-diameter-(speed*Falltime-(g*Math.pow(Falltime,2))/2)*100
        box1.style.top=Fallheight + 'px'
        boxheight=Fallheight
        motionstate.Y_speed=speed-g*Falltime
        // console.log(motionstate.Y_speed,motionstate.height);
        computerheight()
        if(motionstate.height-20>=document.documentElement.clientHeight){
          motionstate.Y_direction='down'
        }
        if(motionstate.Y_speed<=0){
          Fallingheight=motionstate.height
          Falltime=0
          motionstate.Y_speed=0
          // console.log(motionstate);
          motionstate.Y_direction='down'
          // computerheight()
          // computerY_speed()
        }
      }
      // if(motionstate.Y_direction==='interveneup'){
      //   console.log(boxheight,'boxheight');
      //   Fallheight=boxheight-((Y_speed/10)*Falltime-(g*Math.pow(Falltime,2))/2)*100
      //   box1.style.top=Fallheight + 'px'
      //   motionstate.Y_speed=Y_speed-g*Falltime
      //   console.log(motionstate.Y_speed);
      //   computerheight()
      //   if(motionstate.height<=0){
      //     computerheight()
      //     Falltime=0
      //     motionstate.Y_direction='up'
      //     motionstate.Y_speed=Math.sqrt(2*(Fallingheight/100)*g)*0.6;
      //     speed=motionstate.Y_speed
      //   }
      //   if(motionstate.height-20>=document.documentElement.clientHeight){
      //     Fallingheight=motionstate.height
      //     Falltime=0
      //     motionstate.Y_speed=0
      //     motionstate.Y_direction='down'
      //   }
      //   if(motionstate.Y_speed<=0){
      //     Falltime=0
      //     motionstate.Y_speed=0
      //     motionstate.Y_direction='down'
      //   }
      // }
      if(motionstate.X_direction==='right'){
        box1.style.left=(parseInt(box1.style.left.slice(0,-2))+X_speed)+'px'
        if(parseInt(box1.style.left.slice(0,-2))>=document.documentElement.clientWidth+airwall){
          motionstate.X_direction='left'
        }
      }
      if(motionstate.X_direction==='left'){
        box1.style.left=(parseInt(box1.style.left.slice(0,-2))-X_speed)+'px'
        if(parseInt(box1.style.left.slice(0,-2))<=0){
          motionstate.X_direction='right'
        }
      }
      if(motionstate.height===0){
        if(X_speed<=0.5){
          X_speed=0
          airwall=0
        }else{
          X_speed*=0.8
          airwall=X_speed*0.5
          // console.log(airwall,'airwall');
        }
      }
    }, 100);
  }
  computerheight()
  Freefall()
}