package com.trainbooking.demo.train;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TrainRepository extends JpaRepository<Train, Integer> {

    List<Train> findBySourceStationAndDestinationStation(String source, String destination);

    Optional<Train> findByTrainNumber(String trainNumber);
}