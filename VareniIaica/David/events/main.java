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

public class main {
	public static void main(String[] args) {
		Me me = new Me();
		Requestor someone = new Requestor();
		
		someone.say("I want 10 boiled eggs!");
		me.subcounciousCalculation("Is this person important enough for me to provide the requested items? Yes/No");
		if(me.isImportantToMe(someone)) {
			me.say("K.");
			me.subcounciousCalculation("Ok, first check if there are boiled eggs in the fridge");
			
			if(!giveEggsFromFridge(me, someone)) {
				me.subcounciousCalculation("How else can I get boiled eggs? Buy some/Make some");
				me.think("I can't buy boiled eggs(don't know where they are sold), but I can buy eggs and boil them.");
				buyEggsBoilAndGiveThem(me, someone);
			}
		}
		else {
			me.say("?!? Get them yourself wtf...!");
		}
	}
	
	public static boolean giveEggsFromFridge(Me me, Requestor someone) {
		Fridge fridge = new Fridge();
		if(fridge.hasBoiledEggs()) {
			Container<Egg> plateWithBoiledEggs = 
					(Container<Egg>)me.getFromFridge(fridge, Item.PLATE_WITH_BOILED_EGGS);
			if(me.count(plateWithBoiledEggs, 10)) {
				me.give(someone, plateWithBoiledEggs);
				return true;
			}
			else {
				me.think("Need more eggs, these are old anyway...");
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
			while(!pot.waterBoiling()) me.subcounciousCalculation("Waiting for water to start boiling");
			int i = 0;
			while (!eggBox.isEmpty()) 
				pot.getContents().add((Egg) eggBox.getContents().get(i++));
			System.out.println("* Waiting 7-8 minutes for eggs to get boiled...");
			
			Container<Egg> plate = new Container<Egg>();
			me.subcounciousCalculation("Get the eggs out of the pot and give them to "+someone.getName());
			i = 0;
			while(!pot.isEmpty()) {
				Egg egg = (Egg) pot.getContents().get(i);
				egg.setBoiled(true);
				pot.getContents().remove(egg);
				plate.getContents().add(egg);
			}
			
			if(plate != null && plate.getContents().size() == 10) {
				me.give(someone, plate);
			}
		}
	}
	
}
