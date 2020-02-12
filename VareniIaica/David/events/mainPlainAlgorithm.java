package events;

import ingredients.Egg;
import ingredients.Water;
import people.Me;
import people.Requestor;
import store.Store;
import tools.Container;
import tools.CookingPot;
import tools.Fridge;
import tools.Stove;
import util.Item;
import util.RandomUtil;

public class mainPlainAlgorithm {
	public static void main(String[] args) {
		Me me = new Me();
		Requestor someone = new Requestor();
		
		if(me.isImportantToMe(someone)) {
			if(!giveEggsFromFridge(me, someone)) {
				buyEggsBoilAndGiveThem(me, someone);
			}
		}
	}
	
	public static boolean giveEggsFromFridge(Me me, Requestor someone) {
		Fridge fridge = new Fridge();
		if(fridge.hasBoiledEggs()) {
			Container<Egg> plate = 
					(Container<Egg>)me.getFromFridge(fridge, Item.PLATE_WITH_BOILED_EGGS);
			if(me.count(plate, 10)) {
				me.give(someone, plate);
				return true;
			}
			else {
				return false;
			}
		}
		return false;
	}
	
	public static void buyEggsBoilAndGiveThem(Me me, Requestor someone) {
		Container<Egg> eggBox = null;
		while (eggBox == null) {
			Store store = new Store(RandomUtil.randomStoreName());
			me.subcounciousCalculation("Check if store has eggs and buy some");
			eggBox = me.goToStoreAndBuyEggs(store);
		}
		me.subcounciousCalculation("Go home and boil the fuckers");
		
		Stove stove = new Stove();
		CookingPot<Egg> pot = new CookingPot<Egg>();
		if(!pot.hasWater()) {
			pot.fill(new Water());
		}
		
		stove.turnOn();
		if(stove.isOn() && pot.hasWater()){
			stove.put(pot);
			while(!pot.waterBoiling()); 
			
			int i = 0;
			while (!eggBox.isEmpty()) 
				pot.getContents().add((Egg) eggBox.getContents().get(i++));
			
			Container<Egg> plate = new Container<Egg>();
			i = 0;
			while(!pot.isEmpty()) {
				Egg egg = (Egg) pot.getContents().get(i);
				egg.setBoiled(true);
				pot.getContents().remove(egg);
				plate.getContents().add(egg);
			}
			
			if(me.count(plate, 10)) {
				me.give(someone, plate);
			}
		}
	}
	
}
