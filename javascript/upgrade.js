

class Upgrade {
    constructor(name, cost, description, effect) {
        this.name = name;           
        this.baseCost = cost;        
        this.cost = cost;            
        this.description = description;  
        this.effect = effect;        
        this.level = 0;            
    }

    
    buy(game) {
        if (game.cookies < this.cost) return false;  

        game.cookies -= this.cost;                    
        this.level++;                                
        this.cost = Math.round(this.baseCost * 1.5 ** this.level);
        this.effect();                                
        return true;
    }
}
