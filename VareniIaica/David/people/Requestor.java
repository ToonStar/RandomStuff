package people;

public class Requestor 
	implements Person{
	String name;

	@Override
	public void think(String thought) {
		System.out.print(name+" ~ ** "+thought+" **");
	}
	
	@Override
	public void say(String msg) {
		System.out.println(name+" - "+msg);
	}

	@Override
	public void subcounciousCalculation(String thought) {
		System.out.println(name+" ~ ## "+thought+" ##");
	}

	public <T> void get(T item) {
		
	}

	public String getName() {
		return name;
	}
}
