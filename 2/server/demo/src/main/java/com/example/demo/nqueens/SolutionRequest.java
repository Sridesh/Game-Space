//package com.example.demo.nqueens;
//
//import java.time.LocalTime;
//
//public class SolutionRequest {
//    private int[] solution;
//    private String playerName;
//    private LocalTime timeTaken;
//
//    public int[] getSolution() {
//        return solution;
//    }
//
//    public void setSolution(int[] solution) {
//        this.solution = solution;
//    }
//
//    public String getPlayerName() {
//        return playerName;
//    }
//
//    public void setPlayerName(String playerName) {
//        this.playerName = playerName;
//    }
//
//    public LocalTime getTimeTaken() {
//        return timeTaken;
//    }
//
//    public void setTimeTaken(LocalTime timeTaken) {
//        this.timeTaken = timeTaken;
//    }
//}

package com.example.demo.nqueens;

public class SolutionRequest {
    private String solution; // CSV format of the solution
    private String playerName;
    private String timeTaken; // Time as a String

    // Getters and Setters
    public String getSolution() {
        return solution;
    }

    public void setSolution(String solution) {
        this.solution = solution;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(String timeTaken) {
        this.timeTaken = timeTaken;
    }
}

