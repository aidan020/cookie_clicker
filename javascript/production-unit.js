class ProductionUnit {
    constructor(name, baseCost, cps) {
        this.name = name;         
        this.baseCost = baseCost;  
        this.cost = baseCost;      
        this.cps = cps;            
        this.owned = 0;            
    }

   
    buy(game) {
        if (game.cookies < this.cost) return false;   

        game.cookies -= this.cost;                
        this.owned++;                             
        this.cost = Math.round(this.baseCost * 1.8 ** this.owned);  
        return true;
    }

    
    get totalCps() {
        return this.cps * this.owned;
    }
}
