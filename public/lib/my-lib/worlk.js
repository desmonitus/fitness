var item = [
            {id:1,name:'Food Storage',lv:0,type:'food',qty:100,foodPrice:0,woordPrice:500,goldPrice:0,sciencePrice:0,peoplePrice:0},
            {id:2,name:'Wood Storage',lv:0,type:'wood',qty:100,foodPrice:0,woordPrice:500,goldPrice:0,sciencePrice:0,peoplePrice:0},
            {id:3,name:'Gold Storage',lv:0,type:'gold',qty:100,foodPrice:0,woordPrice:500,goldPrice:0,sciencePrice:0,peoplePrice:0},
            {id:4,name:'House',lv:0,type:'people',qty:1,foodPrice:2000,woordPrice:2000,goldPrice:500,sciencePrice:100,peoplePrice:0}
           ];
(function(window, $) {
  function WGame(save) {
    this.name = 'Worlk';
    this.maps = null;
    this.players = {};
    this.items = [];
    this.shops = [];
    this.people = {qty:0,max:0};
    this.food = {qty:0,max:500,auto:0};
    this.wood = {qty:0,max:500,auto:0};
    this.gold = {qty:0,max:500,auto:0};
    this.science = {qty:0,auto:0};
    this.buyItem = function(ids){
      var enable = false;
      var itemSelected = _.find(item,{id:ids});
      if(!POONT.isEmpty(itemSelected)){
        if(control.food.qty>=itemSelected.foodPrice
          &&control.wood.qty>=itemSelected.woordPrice
          &&control.gold.qty>=itemSelected.goldPrice
          &&control.science.qty>=itemSelected.sciencePrice
          &&control.people.qty>=itemSelected.peoplePrice){

          control.food.qty -= itemSelected.foodPrice;
          control.wood.qty -= itemSelected.woordPrice;
          control.gold.qty -= itemSelected.goldPrice;
          control.science.qty -= itemSelected.sciencePrice;
          control.people.qty -= itemSelected.peoplePrice;
          enable = true;
          if(itemSelected.lv >= 1){
            itemSelected.foodPrice +=  itemSelected.foodPrice != 0 ?50:0;
            itemSelected.woordPrice += itemSelected.woordPrice != 0 ?50:0;
            itemSelected.goldPrice += itemSelected.goldPrice != 0 ?50:0;
            itemSelected.sciencePrice += itemSelected.sciencePrice != 0 ?50:0;
            itemSelected.peoplePrice += itemSelected.peoplePrice != 0 ?1:0;
          }
          itemSelected.lv +=1;
          if(itemSelected.lv%50 == 0 && itemSelected.id == 1){
            itemSelected.goldPrice += 250;
            itemSelected.woordPrice += 1000;
          }
          if(itemSelected.lv%50 == 0 && itemSelected.id == 2){
            itemSelected.foodPrice += 500;
            itemSelected.woordPrice += 1000;
          }
          if(itemSelected.lv%50 == 0 && itemSelected.id == 3){
            itemSelected.sciencePrice += 100;
            itemSelected.woordPrice += 2000;
          }
        }
        if(enable){
          switch (itemSelected.type) {
            case 'food':
              control.food.max += itemSelected.qty;
              break;
            case 'wood':
              control.wood.max += itemSelected.qty;
              break;
            case 'gold':
              control.gold.max += itemSelected.qty;
              break;
            case 'science':
              control.science.max += itemSelected.qty;
              break;
            case 'people':
              control.people.max += itemSelected.qty;
          }
        }else{
          // toastr["error"]("ทรัพยากรไม่เพียงพอ");
        }
      }
    }
    window.control = !POONT.isEmpty(save)?save:this;
  };
  window.wGame = {
    Game: WGame,
    version: '1.0.0'
  };
}(window, jQuery));
(function(wGame, $) {
  function Map(config) {
    window.control.maps = _.assignIn(this.defaultConfig, config);
  }

  Map.prototype.defaultConfig = {
    id: 1,
    name: 'Map 1',
    now: [1,1],
    width: 10,
    height: 10,
    food: [],
    wood: [],
    gold: [],
    enemy: {name:'',dmg:''}
  };
  window.Map = Map;
}(wGame, jQuery));
(function(wGame, $) {
  function Player(config) {
    window.control.players = _.assignIn(this.defaultConfig, config);
  }
  Player.prototype.defaultConfig = {
    name: '',
    lv: 1,
    money: 0,
    speed: 1,
    inventory:[], //name,qty
    mining: function(){
      var map =  _.find(control.maps,{active:true});
      if(!POONT.isEmpty(map)){
        var time = map.mountain;
        function miningProcess(){
          setTimeout(function(){
            if(time>0){
              time -= control.players.str;
              console.log(time);
              miningProcess();
            }else{
              var mineral = map.mineral;
              _.forEach(mineral,function(obj){
                var rateCheck = POONT.randomInt(100);
                console.log(rateCheck);
                if(rateCheck<=obj.rate){
                  console.log(obj);
                }
              });
            }
          },500);
        }
        miningProcess();
      }
    }
  };
  window.Player = Player;
}(wGame, jQuery));
(function(wGame, $) {
  function Shop(config) {
    window.control.shops.push(_.assignIn(this.defaultConfig, config));
  }
  Shop.prototype.defaultConfig = {
    name: '',
    foodPrice: 0,
    woordPrice: 0,
    foodStat: 0,
    woodStat: 0
  };
  window.Shop = Shop;
}(wGame, jQuery));