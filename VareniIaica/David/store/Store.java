package store;

import java.math.BigDecimal;

import ingredients.Egg;
import tools.Container;
import util.RandomUtil;

public class Store {
	private double eggCost = 0.20;
	
	public boolean hasEggs() { return RandomUtil.randomTrueChance(50); }
	
	public Store(String name) {
		eggCost += RandomUtil.randomNumberFromTo(1,3);
		if(hasEggs()) 
			System.out.println(name+" - \"This store sells eggs for "+eggCost+"$!\"");
		else
			System.out.print(name+" - \"This store has no eggs at the moment!\"");
	}
	
	public Container<Egg> buyEggs(double quantity, double money){
		if(money >= eggCost*quantity) {
			Container<Egg> container = new Container<Egg>();
			while(quantity-- > 0) 
				container.getContents().add(new Egg());
			return container;
		}
		return null;
	}
}
