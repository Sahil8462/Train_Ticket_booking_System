package com.trainbooking.demo.external;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/external")
@CrossOrigin(origins = "http://localhost:5173")
public class RailwayApiController {

    private final RailwayApiService railwayApiService;

    public RailwayApiController(RailwayApiService railwayApiService) {
        this.railwayApiService = railwayApiService;
    }

     @GetMapping("/test")
    public String test() {
        System.out.println("External controller hit hua");
        return "external controller working";
    }

    @GetMapping("/train-details")
    public String getTrainDetails(@RequestParam String trainNo) {
        return railwayApiService.getTrainDetails(trainNo);
    }

    @GetMapping("/search-station")
public String searchStation(@RequestParam String query) {
    return railwayApiService.searchStation(query);
}
@GetMapping("/trains-between-stations")
public String getTrainsBetweenStations(
        @RequestParam String startStationCode,
        @RequestParam String endStationCode,
        @RequestParam String date
) {
    return railwayApiService.getTrainsBetweenStations(startStationCode, endStationCode, date);
}
}