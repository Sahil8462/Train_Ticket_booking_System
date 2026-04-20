package com.trainbooking.demo.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RailwayApiService {

    @Value("${rapidapi.key}")
    private String apiKey;

    @Value("${rapidapi.host}")
    private String apiHost;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getTrainDetails(String trainNo) {

         try {
        System.out.println("===== getTrainDetails called =====");
        System.out.println("Train No: " + trainNo);
        System.out.println("API KEY: " + apiKey);
        System.out.println("API HOST: " + apiHost);

        String url = "https://" + apiHost + "/api/v1/train-details?trainNo=" + trainNo;
        System.out.println("Final URL: " + url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-RapidAPI-Key", apiKey);
        headers.set("X-RapidAPI-Host", apiHost);
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        System.out.println("Response Status: " + response.getStatusCode());
        System.out.println("Response Body: " + response.getBody());

        return response.getBody();

    } catch (Exception e) {
    e.printStackTrace();
    throw new RuntimeException("External API failed: " + e.getMessage());
}
    }
    public String searchStation(String code) {
    try {
        String url = "https://" + apiHost + "/api/v1/search-station?code=" + code;

        System.out.println("URL: " + url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-RapidAPI-Key", apiKey);
        headers.set("X-RapidAPI-Host", apiHost);
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();

    }catch (Exception e) {
    e.printStackTrace();
    throw new RuntimeException("External API failed: " + e.getMessage());
}
}
   
  public String getTrainsBetweenStations(String startStationCode, String endStationCode, String date) {
    try {
        String url = "https://" + apiHost
                + "/api/v1/trains-between-stations?startStationCode=" + startStationCode
                + "&endStationCode=" + endStationCode
                + "&date=" + date;

        System.out.println("URL: " + url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-RapidAPI-Key", apiKey);
        headers.set("X-RapidAPI-Host", apiHost);
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();

    } catch (Exception e) {
    e.printStackTrace();
    throw new RuntimeException("External API failed: " + e.getMessage());
}
}
}