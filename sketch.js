var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var lastfeed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
   feedthedog=createButton("Feed The Dog");
   feedthedog.position(700,95);
    feedthedog.mousePressed(feedDog)
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  database.ref('/FeedTime').on(
    "value",function(data){
      lastfeed=data.val()
    }
  );
  //write code to display text lastFed time here
  fill ("blue");
  textSize(16)
  if(lastfeed>=12){
    text("Last Feed"+lastfeed%12+"PM",350,30);
  }
  else if(lastfeed===0){
    text("Last Feed"+"12 AM",350,30);
  }
 else if(lastfeed<12){
  text("Last Feed"+lastfeed+"AM",350,30);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  //write code here to update food stock and last fed time
  var foodStockvalue=foodObj.getFoodStock();
  if(foodStockvalue<=0){
    foodObj.updateFoodStock(foodStockvalue*0);
  }
  else {
    foodObj.updateFoodStock(foodStockvalue-1);
  }
  database.ref('/').update({
    FeedTime:hour(),
    Food:foodObj.getFoodStock()
  })

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
