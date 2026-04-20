package com.trainbooking.demo.routes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TrainRouteRepository extends JpaRepository<TrainRoute, Integer> {

    List<TrainRoute> findByTrainIdOrderByStopNumber(Integer trainId);

    @Query(value = """
        SELECT 
            t.train_id,
            t.train_number,
            t.train_name,
            s1.station_code AS source_station,
            s2.station_code AS destination_station,
            r1.departure_time AS departure_time,
            r2.arrival_time AS arrival_time
        FROM trains t
        JOIN train_routes r1 ON t.train_id = r1.train_id
        JOIN train_routes r2 ON t.train_id = r2.train_id
        JOIN stations s1 ON r1.station_id = s1.station_id
        JOIN stations s2 ON r2.station_id = s2.station_id
        WHERE s1.station_code = :fromStation
          AND s2.station_code = :toStation
          AND r1.stop_number < r2.stop_number
        """, nativeQuery = true)
    List<Object[]> searchTrains(String fromStation, String toStation);
}