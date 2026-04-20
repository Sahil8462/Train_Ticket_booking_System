package com.trainbooking.demo.station;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    @Autowired
    private StationService stationService;

    @GetMapping
    public List<Station> getAllStations() {
        return stationService.getAllStations();
    }

    @GetMapping("/search")
    public List<Station> searchStations(@RequestParam String name) {
        return stationService.searchStations(name);
    }

    @PostMapping
    public Station addStation(@RequestBody Station station) {
        return stationService.addStation(station);
    }
}