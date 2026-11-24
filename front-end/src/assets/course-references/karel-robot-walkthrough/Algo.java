import kareltherobot.Directions;
import kareltherobot.UrRobot;
import kareltherobot.World;

public class Algo implements Directions {
    private static final int START_STREET = 6;
    private static final int START_AVENUE = 7;
    private static final int START_BEEPERS = 0;

    static {
        World.setVisible(true);
        World.readWorld("world.txt");
    }

    public static void main(String[] args) {
        UrRobot sam = new UrRobot(START_STREET, START_AVENUE, East, START_BEEPERS);

        // A first sam.move() would hit the east wall at (6, 7).
        // Trace: (street, avenue, direction). The bag stays empty.
        sam.turnLeft(); // (6, 7, North)
        sam.move();     // (7, 7, North)
        sam.turnLeft(); // (7, 7, West)
        sam.turnLeft(); // (7, 7, South)
        sam.turnLeft(); // (7, 7, East)
        sam.move();     // (7, 8, East)
        sam.move();     // (7, 9, East)
        sam.turnLeft(); // (7, 9, North)
        sam.turnLeft(); // (7, 9, West)
        sam.turnLeft(); // (7, 9, South)
        sam.move();     // (6, 9, South), on the beeper
    }
}
