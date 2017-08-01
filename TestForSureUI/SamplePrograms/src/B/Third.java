package B;

import A.First;
import B.Second;
public class Third extends Second{
	public static void main(String[] args){
		Third obj = new Third();
		obj.a=10;
		System.out.println(obj.a);
	}
}