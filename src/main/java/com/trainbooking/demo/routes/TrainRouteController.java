package com.trainbooking.demo.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class TrainRouteController {

    @Autowired
    private TrainRouteService trainRouteService;

    @PostMapping
    public TrainRoute addRoute(@RequestBody TrainRoute route) {
        return trainRouteService.addRoute(route);
    }

    @GetMapping("/{trainId}")
    public List<TrainRoute> getTrainRoute(@PathVariable Integer trainId) {
        return trainRouteService.getTrainRoute(trainId);
    }
}