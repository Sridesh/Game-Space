

package com.example.demo.nqueens;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NQueensService {

    private static final int N = 16;  // Size of the board
    private final List<int[]> solutions = new ArrayList<>();


    @Autowired
    private RecognizedSolutionRepository recognizedSolutionRepository;

    @PostConstruct
    public void init() {
        int[] board = new int[N];
        generateSolutions(board, 0);


    }

    @Transactional
    public void clearAndRegenerateSolutions() {

        recognizedSolutionRepository.deleteAll();

        solutions.clear();
        int[] board = new int[N];
        generateSolutions(board, 0);
    }

    private void generateSolutions(int[] board, int row) {
        if (row == board.length) {
            solutions.add(board.clone());  // Store a copy of the current board
            return;
        }

        for (int col = 0; col < board.length; col++) {
            if (isSafe(board, row, col)) {
                board[row] = col;
                generateSolutions(board, row + 1);
            }
        }
    }

    /////////////////////////////////////////////////

    @PostConstruct
    public void init() {
        generateSolutionsThreaded();
    }

    private void generateSolutionsThreaded() {
        executor = Executors.newFixedThreadPool(THREAD_COUNT);

        for (int col = 0; col < N; col++) {
            final int startingCol = col;
            executor.submit(() -> {
                int[] board = new int[N];
                board[0] = startingCol;
                generateSolutions(board, 1);
            });
        }


        executor.shutdown();
        try {
            executor.awaitTermination(1, TimeUnit.HOURS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }


    private void generateSolutions(int[] board, int row) {
        if (row == N) {
            synchronized (solutions) { 
                solutions.add(board.clone());
            }
            return;
        }

        for (int col = 0; col < N; col++) {
            if (isSafe(board, row, col)) {
                board[row] = col;
                generateSolutions(board, row + 1);
            }
        }
    }

    ///////////////////////////////

    private boolean isSafe(int[] board, int row, int col) {
        for (int i = 0; i < row; i++) {
            if (board[i] == col || Math.abs(board[i] - col) == Math.abs(i - row)) {
                return false;
            }
        }
        return true;
    }

    public String validateSolution(int[] userSolution, String playerName, String timeTaken) {
        String solutionStr = convertArrayToString(userSolution);  // Convert array to string

        // Check if this solution is already recognized
        List<RecognizedSolution> existingSolutions = recognizedSolutionRepository.findBySolution(solutionStr);
        if (!existingSolutions.isEmpty()) {
            return "already recognized";
        }

        // Check if the solution is in the list of solutions
        for (int[] solution : solutions) {
            if (java.util.Arrays.equals(solution, userSolution)) {
                RecognizedSolution recognizedSolution = new RecognizedSolution(solutionStr, playerName, timeTaken);
                recognizedSolutionRepository.save(recognizedSolution);
                solutions.remove(solution);
                if(solutions.size()==0){
                    clearAndRegenerateSolutions();
                }
                return "valid";
            }
        }

        return "invalid";
    }

    private String convertArrayToString(int[] array) {
        StringBuilder sb = new StringBuilder();
        for (int value : array) {
            sb.append(value).append(",");
        }
        // Remove trailing comma
        if (sb.length() > 0) {
            sb.setLength(sb.length() - 1);
        }
        return sb.toString();
    }

    public List<int[]> getSolutions() {
        return new ArrayList<>(solutions);
    }

    public List<RecognizedSolution> getRecognizedSolutions() {
        return recognizedSolutionRepository.findAll();
    }

    public List<int[]> getFirstTenSolutions() {
        return solutions.subList(0, Math.min(10, solutions.size()));
    }

    public List<RecognizedSolution> getSolutionsByPlayer(String playerName) {
        return recognizedSolutionRepository.findByPlayerName(playerName);
    }
}



