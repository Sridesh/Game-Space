package com.example.demo.nqueens;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name="recognized_solutions")
public class RecognizedSolution {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String solution;

    @Column(nullable = false)
    private String playerName;

    @Column(nullable = false)
    private String timeTaken;

    // Constructors
    public RecognizedSolution() {}

    public RecognizedSolution(String solution, String playerName, String timeTaken) {
        this.solution = solution;
        this.playerName = playerName;
        this.timeTaken = timeTaken;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
