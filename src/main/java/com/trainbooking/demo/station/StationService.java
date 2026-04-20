package com.trainbooking.demo.station;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {

    @Autowired
    private StationRepository stationRepository;

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    public List<Station> searchStations(String name) {
        return stationRepository.findByStationNameContainingIgnoreCase(name);
    }

    public Station addStation(Station station) {
        return stationRepository.save(station);
    }
}