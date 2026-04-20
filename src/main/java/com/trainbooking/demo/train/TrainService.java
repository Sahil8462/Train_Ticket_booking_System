package com.trainbooking.demo.train;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainService {

    @Autowired
    private TrainRepository trainRepository;

    public Train addTrain(Train train) {
        return trainRepository.save(train);
    }

    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    public List<Train> searchTrain(String source, String destination) {
        return trainRepository.findBySourceStationAndDestinationStation(source, destination);
    }

    public Train getTrainById(Integer trainId) {
    return trainRepository.findById(trainId)
            .orElseThrow(() -> new RuntimeException("Train not found with id: " + trainId));
}
}