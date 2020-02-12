package tools;
import java.util.List;

public class Container<T> {
	List<T> contents;
	public List<T> getContents() { return contents; }

	public boolean isEmpty() {
		return contents.isEmpty();
	}
}
