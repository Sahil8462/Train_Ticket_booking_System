package com.trainbooking.demo.station;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StationRepository extends JpaRepository<Station, Integer> {

    List<Station> findByStationNameContainingIgnoreCase(String name);

}