import kareltherobot.Directions;
import kareltherobot.UrRobot;
import kareltherobot.World;

public class Algo implements Directions {
    private static final int START_STREET = 6;
    private static final int START_AVENUE = 7;
    private static final int START_BEEPERS = 0;
    private static final int MOVE_COUNT = 3;

    static {
        World.setVisible(true);
        World.readWorld("world.txt");
    }

    public static void main(String[] args) {
        UrRobot sam = new UrRobot(START_STREET, START_AVENUE, East, START_BEEPERS);

        turnAround(sam);
        // Counts 3, 1 and 0 finish on avenues 4, 6 and 7, all facing west.
        moveMany(sam, MOVE_COUNT);
    }

    private static void turnAround(UrRobot robot) {
        robot.turnLeft();
        robot.turnLeft();
    }

    private static void moveMany(UrRobot robot, int steps) {
        for (int i = 0; i < steps; i++) {
            robot.move();
        }
    }
}
