//package com.example.demo.nqueens;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import java.util.List;
//
//public interface RecognizedSolutionRepository extends JpaRepository<RecognizedSolution, Long> {
//    List<RecognizedSolution> findByPlayerName(String playerName);
//}

package com.example.demo.nqueens;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecognizedSolutionRepository extends JpaRepository<RecognizedSolution, Long> {
    List<RecognizedSolution> findBySolution(String solution);
    List<RecognizedSolution> findByPlayerName(String playerName);
}
