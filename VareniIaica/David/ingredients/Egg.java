package ingredients;

public class Egg {
	private boolean isBoiled;
	private boolean isBad;
	
	public boolean isBad() { return !isBoiled || isBad; }
	public boolean isBoiled() { return isBoiled; }
	public void setBoiled(boolean b) {
		isBoiled = true;
	}
}
