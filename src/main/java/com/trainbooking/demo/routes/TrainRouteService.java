package com.trainbooking.demo.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainRouteService {

    @Autowired
    private TrainRouteRepository trainRouteRepository;

    public TrainRoute addRoute(TrainRoute route) {
        return trainRouteRepository.save(route);
    }

    public List<TrainRoute> getTrainRoute(Integer trainId) {
        return trainRouteRepository.findByTrainIdOrderByStopNumber(trainId);
    }
}