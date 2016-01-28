function drawTheShapes() {
    for(var i=0;i<15;i++){
        var theShape = new createjs.Shape();
        theShape.graphics.setStrokeStyle(1).beginStroke(createjs.Graphics.getRGB(0, 0, 0)).beginFill(createjs.Graphics.getRGB(255,255,51)).drawCircle(0, 0, 20).moveTo(-20,0).lineTo
        (20,0);
        theShape.x = Math.floor(Math.random() * 600);
        theShape.y = Math.floor(Math.random() * 300);
        theShape.scaleX = Math.floor(Math.random() * 2)+1;
        theShape.scaleY = Math.floor(Math.random() * 2)+1;
        theShape.alpha = Math.random() * 1;
        theShape.rotation = Math.floor(Math.random() * 360);
        theShape.on("click",handleClick,null,false);            
        theShape.on("mouseout",handleMouseOut,null,false);
        stage.addChild(theShape);
    }
    stage.update();
}