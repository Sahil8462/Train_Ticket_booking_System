package com.trainbooking.demo.search;

import org.springframework.stereotype.Service;
import com.trainbooking.demo.external.RailwayApiService;

@Service
public class SearchIntegrationService {

    private final RailwayApiService railwayApiService;

    public SearchIntegrationService(RailwayApiService railwayApiService) {
        this.railwayApiService = railwayApiService;
    }

    public String searchStations(String code) {
        try {
            return railwayApiService.searchStation(code);
        } catch (Exception e) {
            System.out.println("External API failed, using fallback");

            return "[{\"stationName\":\"New Delhi\",\"stationCode\":\"NDLS\"}," +
                   "{\"stationName\":\"Delhi\",\"stationCode\":\"DLI\"}]";
        }
    }

    public String getTrainsBetweenStations(String start, String end, String date) {
        try {
            return railwayApiService.getTrainsBetweenStations(start, end, date);
        } catch (Exception e) {
            System.out.println("External API failed, using fallback");

            return "[{\"trainName\":\"Demo Express\",\"trainNo\":\"12345\",\"from\":\"NDLS\",\"to\":\"BCT\"}]";
        }
    }

    public String getTrainDetails(String trainNo) {
        try {
            return railwayApiService.getTrainDetails(trainNo);
        } catch (Exception e) {
            System.out.println("External API failed, using fallback");

            return "{\"trainName\":\"Demo Rajdhani\",\"trainNo\":\"12951\",\"from\":\"NDLS\",\"to\":\"BCT\"}";
        }
    }
}