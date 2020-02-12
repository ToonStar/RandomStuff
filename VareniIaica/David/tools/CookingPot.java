package tools;

import ingredients.Water;

public class CookingPot<T> extends Container{
	private boolean hasWater;
	
	public void fill(Water water) {
		hasWater = true;
		System.out.println("* Pot filled with water");
	}

	public boolean hasWater() {
		return hasWater;
	}

	public boolean waterBoiling() {
		// TODO Auto-generated method stub
		return false;
	}
}
