package com.trainbooking.demo.search;

import com.trainbooking.demo.routes.TrainRouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainSearchService {

    @Autowired
    private TrainRouteRepository trainRouteRepository;

    public List<Object[]> searchTrain(String from, String to) {

        return trainRouteRepository.searchTrains(from, to);

    }

}