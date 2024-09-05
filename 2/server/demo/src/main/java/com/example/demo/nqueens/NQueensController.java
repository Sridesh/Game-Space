//package com.example.demo.nqueens;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalTime;
//import java.util.List;
//
//@RestController
//@RequestMapping("/nqueens")
//public class NQueensController {
//
//    @Autowired
//    private NQueensService nQueensService;
//
//    @PostMapping("/validate")
//    public String validateSolution(@RequestBody SolutionRequest request) {
//        return nQueensService.validateSolution(request.getSolution(), request.getPlayerName(), request.getTimeTaken());
//    }
//
//    @GetMapping("/solutions")
//    public List<int[]> getSolutions() {
//        return nQueensService.getSolutions();
//    }
//
//    @GetMapping("/recognized")
//    public List<RecognizedSolution> getRecognizedSolutions() {
//        return nQueensService.getRecognizedSolutions();
//    }
//}

package com.example.demo.nqueens;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nqueens")
public class NQueensController {

    @Autowired
    private NQueensService nQueensService;

//    @PostMapping("/validate")
//    public ResponseEntity<String> validateSolution(@RequestBody SolutionRequest solutionRequest) {
//        int[] solutionArray = convertArrayFromString(solutionRequest.getSolution());
//        String result = nQueensService.validateSolution(solutionArray, solutionRequest.getPlayerName(), solutionRequest.getTimeTaken());
//
//        // Return appropriate response based on validation result
//        if ("valid".equals(result)) {
//            return ResponseEntity.status(HttpStatus.OK).body("Solution is valid.");
//        } else if ("already recognized".equals(result)) {
//            return ResponseEntity.status(HttpStatus.OK).body("Solution is already recognized.");
//        } else {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Solution is invalid.");
//        }
//    }

    @PostMapping("/validate")
    public ResponseEntity<String> validateSolution(@RequestBody SolutionRequest solutionRequest) {
        try {
            int[] solutionArray = convertArrayFromString(solutionRequest.getSolution());
            String result = nQueensService.validateSolution(solutionArray, solutionRequest.getPlayerName(), solutionRequest.getTimeTaken());

            // Return appropriate response based on validation result
            if ("valid".equals(result)) {
                return ResponseEntity.status(HttpStatus.OK).body("Solution is valid.");
            } else if ("already recognized".equals(result)) {
                return ResponseEntity.status(HttpStatus.OK).body("Solution is already recognized.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Solution is invalid.");
            }
        } catch (Exception e) {
            // Log the exception
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }


    @GetMapping("/solutions")
    public ResponseEntity<List<int[]>> getSolutions() {
        List<int[]> solutions = nQueensService.getSolutions();
        return ResponseEntity.ok(solutions);
    }

    @GetMapping("/recognized-solutions")
    public ResponseEntity<List<RecognizedSolution>> getRecognizedSolutions() {
        List<RecognizedSolution> recognizedSolutions = nQueensService.getRecognizedSolutions();
        return ResponseEntity.ok(recognizedSolutions);
    }

    @GetMapping("/solutions/by-player/{playerName}")
    public ResponseEntity<List<RecognizedSolution>> getSolutionsByPlayer(@PathVariable String playerName) {
        List<RecognizedSolution> solutions = nQueensService.getSolutionsByPlayer(playerName);
        return ResponseEntity.ok(solutions);
    }

    @GetMapping("/solutions/first-ten")
    public ResponseEntity<List<int[]>> getFirstTenSolutions() {
        List<int[]> firstTenSolutions = nQueensService.getFirstTenSolutions();
        return ResponseEntity.ok(firstTenSolutions);
    }

    // Utility method to convert solution from String format to int array
    private int[] convertArrayFromString(String solution) {
        String[] parts = solution.split(",");
        int[] result = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            result[i] = Integer.parseInt(parts[i].trim());
        }
        return result;
    }
}
