export {drawRectangle, drawCircle, drawLine, drawTriangle, drawArc, drawBezier};

// Draw rectangle
function drawRectangle(ctx,x=0,y=0,width=25,height=25,fillStyle="red",strokeStyle="black",lineWidth=0, alpha=1){
    ctx.save();                
    ctx.beginPath();            
    ctx.rect(x,y,width,height);   
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;    
    ctx.lineWidth = lineWidth;  
    ctx.fill();              
    ctx.stroke();                            
    ctx.restore();             
}

// Draw circle
function drawCircle(ctx,x=0,y=0,radius=10, fillStyle="red",strokeStyle="black",lineWidth=0,startAngle=0,endAngle=Math.PI*2, alpha=1){
    ctx.save();                
    ctx.beginPath();            
    ctx.arc(x, y, radius, startAngle, endAngle, false);  
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;    
    ctx.lineWidth = lineWidth;  
    ctx.fill();              
    ctx.stroke();                            
    ctx.restore();       
}

// Draw line
function drawLine(ctx,x1=0,y1=0,x2=100,y2=0,strokeStyle="black",lineWidth=5){
    ctx.save();                
    ctx.beginPath();            
    ctx.moveTo(x1, y1);  
    ctx.lineTo(x2, y2);
    ctx.closePath(); 
    ctx.strokeStyle = strokeStyle;    
    ctx.lineWidth = lineWidth;              
    ctx.stroke();                            
    ctx.restore();   
}

// Draw triangle
function drawTriangle(ctx,x1=0,y1=0,x2=50,y2=50,x3=-50,y3=50,fillStyle="red",strokeStyle="black",lineWidth=5){
    ctx.save();                
    ctx.beginPath();            
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;    
    ctx.lineWidth = lineWidth;  
    ctx.fill();              
    ctx.stroke();                            
    ctx.restore();    
}

// Draw quadratic curve
function drawArc(ctx,x1=0,y1=0,x2=300,y2=0,cpX=150,cpY=75,fillStyle="red",strokeStyle="black",lineWidth=5,fillAlpha=1,strokeAlpha=1){
    ctx.save();                
    ctx.beginPath();            
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cpX, cpY, x2, y2);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;    
    ctx.lineWidth = lineWidth;  
    ctx.globalAlpha = fillAlpha;
    ctx.fill();  
    ctx.globalAlpha = strokeAlpha;
    ctx.stroke();                            
    ctx.restore();  
}

// Draw bezier curve
function drawBezier(ctx, x1=0, y1=0, x2=300, y2=0, cpX1=150, cpY1=75, cpX2=250, cpY2=150, fillStyle="red", strokeStyle="black", lineWidth=5, fillAlpha=1, strokeAlpha=1){
    ctx.save();                
    ctx.beginPath();            
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x2, y2);
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;    
    ctx.lineWidth = lineWidth; 
    ctx.globalAlpha = fillAlpha;
    ctx.fill();
    ctx.globalAlpha = strokeAlpha;
    ctx.stroke();                      
    ctx.restore();  
}