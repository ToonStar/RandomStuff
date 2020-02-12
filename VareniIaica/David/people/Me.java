package people;

import ingredients.Egg;
import store.Store;
import tools.Container;
import tools.Fridge;
import util.Item;
import util.RandomUtil;

public class Me 
	implements Person{
	String name;
	Inventory inventory;
	public Inventory getInventory() { return inventory; }
	
	public boolean isImportantToMe(Person person) {
		return RandomUtil.randomTrueChance(70);
	}
	
	public Object getFromFridge(Fridge fridge, Item item) {
		return fridge.getItem(item);
	}
	
	public <T> void give(Requestor someone, T item) {
		someone.get(item);
	}
	
	public Container<Egg> goToStoreAndBuyEggs(Store store) {
		if(store.hasEggs()) {
			return store.buyEggs(10, (Integer)inventory.getItems().get("Money"));
		}
		return null;
	}

	public boolean count(Container<?> container, int count) {
		return container.getContents().size() == count;
	}
	
	@Override
	public void think(String thought) {
		System.out.println(name+" ~ ** "+thought+" **");
	}
	
	@Override
	public void say(String msg) {
		System.out.println(name+" - "+msg);
	}
	
	@Override
	public void subcounciousCalculation(String thought) {
		System.out.println(name+" ~ ## "+thought+" ##");
	}
}
