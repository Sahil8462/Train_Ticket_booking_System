package com.trainbooking.demo.train;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
public class TrainController {

    @Autowired
    private TrainService trainService;

    @PostMapping
    public Train addTrain(@RequestBody Train train) {
        return trainService.addTrain(train);
    }

    @GetMapping
    public List<Train> getAllTrains() {
        return trainService.getAllTrains();
    }

    @GetMapping("/search")
    public List<Train> searchTrain(@RequestParam String source,
                                   @RequestParam String destination) {

        return trainService.searchTrain(source, destination);
    }
    @GetMapping("/{trainId}")
public Train getTrainById(@PathVariable Integer trainId) {
    return trainService.getTrainById(trainId);
}
}